import { configure, action } from 'mobx';
import Store from './Stores/Store';
import ChromeExtensionStorage from './StorageProviders/ChromeExtensionStorage';
import { parse } from 'url';
configure({
    enforceActions: 'never'
});
const manifest = chrome.runtime.getManifest();

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "../settings.html"
        });
    }
    if (details.reason == "update") {

        var notificationOptions = {
            type: 'basic',
            title: manifest.name,
            message: manifest.name + ' been updated to version: "' + manifest.version + '".',
            iconUrl: "../icons/icon48.png",
            isClickable: false
        }

        chrome.notifications.create(null, notificationOptions);
    }
});


const storageProvider = new ChromeExtensionStorage();
const store = new Store(storageProvider, true, false, onStoreLoaded);

function onStoreLoaded() {
    const rules = store.rules;
    let conditions: Array<string> = [];

    rules.forEach(rule => {
        conditions.push(rule.condition);
    });

    chrome.contextMenus.removeAll();

    if (conditions.length > 0) {
        chrome.contextMenus.create({
            id: "get-file-path",
            title: 'Get file path',
            documentUrlPatterns: conditions
        });

        chrome.contextMenus.onClicked.addListener((info, tabs) => {
            if (info.menuItemId == "get-file-path") {
                const url = info.frameUrl || info.pageUrl;
                let associatedRule: { id: string, condition: string } = null;
                let success = false;

                for (var rule of rules) {
                    if (url.startsWith(rule.condition.replace(/\*$/i, ''))) {
                        associatedRule = rule;
                        break;
                    }
                }

                if (associatedRule != null) {
                    const environment = store.getEnvironmentById(associatedRule.id);

                    if (environment != null) {
                        let partialPath = parse(url).pathname;

                        if (partialPath === '' || partialPath.endsWith('/')) {
                            partialPath += environment.indexPage;
                        }

                        let rulePath = parse(associatedRule.condition.replace(/\*$/i, '')).pathname;
                        partialPath = partialPath.replace(rulePath, '');

                        let filePath = environment.directory + '/' + partialPath;

                        //Ensure we only have '/' and not '\'
                        filePath = filePath.replace(/\\/g, '/');

                        //remove double '//'
                        while (filePath.indexOf('//') >= 0) {
                            filePath = filePath.replace(/\/\//g, '/');
                        }

                        if (navigator.appVersion.indexOf("Win") != -1) {
                            //Some windows programs require '\' instead of '/'.
                            filePath = filePath.replace(/\//g, '\\');
                        }

                        success = true;

                        chrome.scripting.executeScript({
                            target: { tabId: tabs.id },
                            func: injectedFunction,
                            args: [filePath]
                        },
                            (injectionResults) => {
                                for (const frameResult of injectionResults)
                                    if (!frameResult.result) {
                                        displayErrorNotification();
                                    }
                            });
                    }
                }

                if (!success) {
                    displayErrorNotification();
                }
            }
        });
    }
};


chrome.storage.onChanged.addListener(function (changes, AreaName) {
    if (AreaName == 'local') {
        storageProvider.load((data) => {
            store.load(data);
        });
    }
});

function displayErrorNotification() {
    var notificationOptions = {
        type: 'basic',
        title: manifest.name,
        message: 'No file path found, clipboard has not been changed.',
        iconUrl: "../icons/icon48.png",
        isClickable: false
    }

    chrome.notifications.create(null, notificationOptions);
}

function injectedFunction(filePath: string) {
    const oldFocus: any = document.activeElement;
    let input = document.createElement('textarea');
    document.body.appendChild(input);
    input.style.position = 'fixed';
    input.style.zIndex = '-999';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.margin = '-100px 0 0 -100px';
    input.style.width = '200px';
    input.style.height = '200px';
    input.value = filePath;
    input.focus();
    input.select();
    document.execCommand("copy");
    input.remove();

    if (oldFocus != null) {
        oldFocus.focus();
    }

    return true;
}
var rules = [];

var _ = require('lodash'),
  uuid = require('node-uuid'),
  _url = require('url'),
  patches = require('./lib/patches');

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "settings.html"
        });
    }
    if (details.reason == "update") {
        var manifest = chrome.runtime.getManifest();

        var patchFnName = 'patch_' + manifest.version.replace(/\./g, '_');

        if (_.isFunction(patches[patchFnName])) {
            patches[patchFnName]();
        }

        var notificationOptions = {
            type: 'basic',
            title: manifest.name,
            message: manifest.name + ' been updated to version: "' + manifest.version + '".',
            iconUrl: "icons/icon48.png",
            isClickable: false
        }

        chrome.notifications.create(uuid.v1(), notificationOptions, function() {});
    }
});

//Load the current settings.
chrome.storage.local.get(null, function(items) {
    _.forEach(items.rules, function(rule) {
        rules.push(rule);
    });

    //Create the context menu item.
    initContextMenuItem(rules);
});

//Listen for any changes in the options
chrome.storage.onChanged.addListener(function(changes, AreaName) {
    if (AreaName == 'local') {
        rules = changes.rules.newValue;

        //Update the context menu item.
        initContextMenuItem(rules);
    }
});

function initContextMenuItem(rules) {
    var conditions = [];

    _.forEach(rules, function(rule) {
        conditions = conditions.concat(rule.conditions);
    });

    chrome.contextMenus.removeAll();

    if (conditions.length > 0) {
        chrome.contextMenus.create({
            title: 'Get file path',
            documentUrlPatterns: conditions,
            onclick: function(info, tabs) {
                function getFilePathByUrl(url) {
                    var associatedRule = null;
                    var filePath = '';

                    _.forEach(rules, function(rule) {
                        var found = false;
                        _.forEach(rule.conditions, function(condition) {
                            if (url.startsWith(condition.replace(/\*$/i, ''))) {
                                associatedRule = rule;
                                found = true;
                                return false;
                            }
                        });

                        if (found) {
                            return false;
                        }
                    })

                    if (!_.isNull(associatedRule)) {
                        //Ensure we have an partial path
                        var partialPath = _url.parse(url).pathname;
                        if (_.isEmpty(partialPath) || partialPath.endsWith('/')) {
                            partialPath += associatedRule.indexPage;
                        }
                        var rulePath = _url.parse(associatedRule.conditions[0].replace(/\*$/i, '')).pathname;
                        partialPath = partialPath.replace(rulePath, '');

                        filePath = associatedRule.directory + '/' + partialPath;

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
                    }

                    return filePath;
                }

                var url = info.frameUrl || info.pageUrl;
                var filePath = getFilePathByUrl(url);

                if (filePath != null && _.isEmpty(filePath)) {
                    var manifest = chrome.runtime.getManifest();

                    var notificationOptions = {
                        type: 'basic',
                        title: manifest.name,
                        message: 'No file path found, clipboard has not been changed.',
                        iconUrl: "icons/icon48.png",
                        isClickable: false
                    }

                    chrome.notifications.create(uuid.v1(), notificationOptions, function() {});
                } else {
                    clipboardholder = document.getElementById('clipboard');
                    clipboardholder.value = filePath;

                    clipboardholder.select();
                    document.execCommand("Copy");
                }
            }
        });
    }
}
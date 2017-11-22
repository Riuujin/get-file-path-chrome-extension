import IStoreStorageData from '../Stores/IStoreStorageData';
import IStoreStorageProvider from '../StorageProviders/IStoreStorageProvider';

export default class ChromeExtensionStorage implements IStoreStorageProvider {
    constructor() {
    }

    public load(callback: (data: IStoreStorageData) => void): void {
        chrome.storage.local.get(null, (data: any) => {
            callback(data);
        });
    }

    public save(data: IStoreStorageData) {
        chrome.storage.local.set(data);
    };
}
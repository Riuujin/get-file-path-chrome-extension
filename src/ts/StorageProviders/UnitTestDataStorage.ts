import IStoreStorageData from '../Stores/IStoreStorageData';
import IStoreStorageProvider from './IStoreStorageProvider';

export default class UnitTestDataStorage implements IStoreStorageProvider {
    constructor(private data: IStoreStorageData, private loadTime: number = 0) { }

    public load(callback: (data: IStoreStorageData) => void): void {
        setTimeout(() => {
            callback(this.data);
        }, this.loadTime);
    }

    public save(data: IStoreStorageData) {
        this.data = data;
    };
}
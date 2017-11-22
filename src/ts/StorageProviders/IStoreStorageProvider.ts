import IStoreStorageData from '../Stores/IStoreStorageData';

export default interface IStoreStorageProvider {
    load: (callback: (data: IStoreStorageData) => void) => void;
    save: (data: IStoreStorageData) => void;
    onSaved?: () => void;
    onLoaded?: () => void;
}
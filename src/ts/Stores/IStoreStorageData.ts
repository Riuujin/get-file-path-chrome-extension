import IEnvironment from '../Environment/IEnvironment';

export default interface IStoreStorageData{
    readonly version : string;
    environments: Array<IEnvironment>;
}
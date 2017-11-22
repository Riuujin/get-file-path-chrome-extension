import IEnvironment from '../Environment/IEnvironment';
import IStoreStorageData from '../Stores/IStoreStorageData';

export default interface IStore {
    environments: Array<IEnvironment>
    readonly rules: Array<{ id: string, condition: string }>;
    getEnvironmentById: (id: string) => IEnvironment | null;
    addEnvironment: (id?: string) => IEnvironment;
    removeEnvironment: (env: IEnvironment) => void;
    moveEnvironmentDown: (env: IEnvironment) => void;
    moveEnvironmentUp: (env: IEnvironment) => void;
    export: () => IStoreStorageData;
    import: (data: IStoreStorageData) => void;
    save:()=>void;
    load:(data: IStoreStorageData)=>void;
    onLoaded?:()=>void;
}
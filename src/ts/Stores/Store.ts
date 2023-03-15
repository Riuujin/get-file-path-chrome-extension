import { observable, autorun, action, toJS, makeObservable } from 'mobx';
import Environment from '../Environment/Environment';
import { generateId, getVersion } from '../Utils';
import IStore from './IStore';
import IEnvironment from '../Environment/IEnvironment';
import IStoreStorageProvider from '../StorageProviders/IStoreStorageProvider';
import IStoreStorageData from './IStoreStorageData';

export default class Store implements IStore {
    private timer: number;
    private storageProvider: IStoreStorageProvider;

    public onLoaded: () => void;

    @observable public environments: Array<IEnvironment> = [];

    constructor(storageProvider?: IStoreStorageProvider, loadData: boolean = true, saveOnChange: boolean = false, onLoaded?: () => void) {
        makeObservable(this);
        if (onLoaded != null) {
            this.onLoaded = onLoaded;
        }

        if (storageProvider != null) {
            this.storageProvider = storageProvider;
            if (loadData) {
                this.storageProvider.load((data) => {
                    this.load(data);

                    if (saveOnChange != null) {
                        let firstRun = true;
                        autorun(() => {
                            if (firstRun) {
                                this.export(); //Ensure autorun is triggered when required.
                                firstRun = false;
                            }
                            else {
                                this.save();
                            }
                        })
                    }
                });
            }
            else {
                if (saveOnChange != null) {
                    let firstRun = true;
                    autorun(() => {
                        if (firstRun) {
                            this.export(); //Ensure autorun is triggered when required.
                            firstRun = false;
                        }
                        else {
                            this.save();
                        }
                    })
                }
            }
        }
    }

    public get rules(): Array<{ id: string, condition: string }> {
        let results: Array<{ id: string, condition: string }> = [];
        this.environments.forEach((env) => {
            if (env.isValid) {

                if (/^https?/.test(env.url)) {
                    if (/\/$/.test(env.url)) {
                        results.push({ id: env.id, condition: env.url + '*' });
                    } else {
                        results.push({ id: env.id, condition: env.url + '/*' });
                    }
                }
                else {
                    if (/\/$/.test(env.url)) {
                        results.push({ id: env.id, condition: 'http://' + env.url + '*' });
                        results.push({ id: env.id, condition: 'https://' + env.url + '*' });
                    } else {
                        results.push({ id: env.id, condition: 'http://' + env.url + '/*' });
                        results.push({ id: env.id, condition: 'https://' + env.url + '/*' });
                    }
                }
            }
        });

        return results;
    }

    @action
    public load(data: any): void {
        this.environments = [];
        this.import(data);

        if (this.onLoaded != null) {
            this.onLoaded();
        }
    }

    public save() {
        if (this.storageProvider != null) {
            this.storageProvider.save(this.export());
        }
    }

    public export(): IStoreStorageData {
        let data: IStoreStorageData = Object.assign({}, { version: getVersion() }, toJS(this));
        //Remove data we dont want to export.
        delete (<any>data).storageProvider
        return data;
    };

    @action
    public import(data: any): void {
        let storageData: IStoreStorageData = data as IStoreStorageData;

        if (data.version === undefined && data.rules != null && Array.isArray(data.rules)) {
            //assume v0.0.6
            storageData = {
                version: getVersion(),
                environments: []
            };

            data.rules.forEach((rule: any) => {
                storageData.environments.push({
                    id: rule.id,
                    name: rule.name,
                    url: rule.url,
                    directory: rule.directory,
                    indexPage: rule.indexPage,
                })
            });
        }

        const allowedVersion = ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.1.0', '1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6','1.1.7'];
        let versionAllowed = allowedVersion.indexOf(storageData.version) > -1;

        if (versionAllowed && storageData.environments != null && Array.isArray(storageData.environments)) {
            storageData.environments.forEach(loadedEnv => {
                let env = this.getEnvironmentById(loadedEnv.id);
                if (env == null) {
                    env = this.addEnvironment(loadedEnv.id);
                }

                env.name = loadedEnv.name;
                env.directory = loadedEnv.directory;
                env.indexPage = loadedEnv.indexPage;
                env.url = loadedEnv.url;
            });
        }
    }

    public getEnvironmentById(id: string): IEnvironment | null {
        let env = this.environments.find(env => env.id === id);

        return env;
    }

    @action
    public addEnvironment(id?: string): IEnvironment {
        if (id == null) {
            id = generateId();
        }
        const env = new Environment(id);
        this.environments.push(env);
        return env;
    }

    public removeEnvironment(env: IEnvironment) {
        this.removeEnvironmentById(env.id);
    }

    @action
    private removeEnvironmentById(id: string) {
        const i = this.environments.findIndex(env => env.id === id);
        this.environments.splice(i, 1);
    }

    @action
    public moveEnvironmentDown(env: IEnvironment) {
        const i = this.environments.findIndex(e => e.id === env.id);

        if (i < this.environments.length - 1) {
            const env = this.environments.splice(i, 1);
            this.environments.splice(i + 1, 0, env[0]);
        }
    }

    @action
    public moveEnvironmentUp(env: IEnvironment) {
        const i = this.environments.findIndex(e => e.id === env.id);
        if (i > 0) {
            const env = this.environments.splice(i, 1);
            this.environments.splice(i - 1, 0, env[0]);
        }
    }
}

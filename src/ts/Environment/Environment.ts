import { observable, computed, makeObservable } from 'mobx';
import IEnvironment from './IEnvironment';

export default class Environment implements IEnvironment {
    public id: string;
    @observable public name: string;
    @observable public url: string;
    @observable public directory: string;
    @observable public indexPage: string;
    @computed public get urls(): Array<string> {
        if (this.url == null || this.url === '') {
            return [];
        }

        if (/^https?/.test(this.url)) {
            return [this.url];
        }

        return ['http://' + this.url, 'https://' + this.url];
    }

    @computed public get isValid(): boolean {
        return this.url != null && this.url !== ''
                    && this.directory != null && this.directory !== ''
                        && this.indexPage != null && this.indexPage !== ''
    }


    constructor(id: string) {
        makeObservable(this);
        this.id = id;
        this.name = '';
        this.url = '';
        this.directory = '';
        this.indexPage = '';
    }
}
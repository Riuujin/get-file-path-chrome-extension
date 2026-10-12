import { makeAutoObservable } from 'mobx';
import IEnvironment from './IEnvironment';

export default class Environment implements IEnvironment {
    public id: string;
    public name: string;
    public url: string;
    public directory: string;
    public indexPage: string;

    public get urls(): Array<string> {
        if (this.url == null || this.url === '') {
            return [];
        }

        if (/^https?/.test(this.url)) {
            return [this.url];
        }

        return ['http://' + this.url, 'https://' + this.url];
    }

    public get isValid(): boolean {
        return this.url != null && this.url !== ''
                    && this.directory != null && this.directory !== ''
                        && this.indexPage != null && this.indexPage !== ''
    }

    constructor(id: string) {
        makeAutoObservable(this);
        this.id = id;
        this.name = '';
        this.url = '';
        this.directory = '';
        this.indexPage = '';
    }
}
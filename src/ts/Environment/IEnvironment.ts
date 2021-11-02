export default interface IEnvironment {
    id: string;
    name: string;
    directory: string;
    indexPage: string;
    url: string;
    readonly isValid?: boolean;
}
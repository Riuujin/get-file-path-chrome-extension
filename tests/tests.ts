import { expect } from 'chai';
import 'mocha';
import Store from '../src/ts/Stores/Store'
import { generateId, getVersion } from '../src/ts/Utils'
import UnitTestDataStorage from '../src/ts/StorageProviders/UnitTestDataStorage'
import IStoreStorageData from '../src/ts/Stores/IStoreStorageData';

//NOTE: Make sure Utils.getVersion returns the latest version!
// @ts-ignore
const importData_v0_0_6 = require('./export v0.0.6.json');
// @ts-ignore
const importData_v1_0_0 = require('./export v1.0.0.json');


describe('Store', () => {
    describe('new Store', () => {
        it('should create an empty store', () => {
            const store = new Store();
            expect(store.environments).to.be.lengthOf(0);
        });
    });
    describe('import', () => {
        it('should import data', () => {
            const store = new Store();
            const importData: IStoreStorageData = {
                version: getVersion(),
                environments: [
                    {
                        id: generateId(),
                        directory: 'c:\\wwwroot\\',
                        indexPage: 'index.html',
                        name: 'wwwroot',
                        url: 'localhost'
                    }
                ]
            }

            store.import(importData);
            const rules = store.rules;
            expect(store.environments).to.be.lengthOf(1);
            expect(rules).to.be.lengthOf(2);

            for (let i = 0; i < store.environments.length; i++) {
                const environment = store.environments[i];
                const importedRule = importData.environments[i];

                expect(environment.id).to.be.equal(importedRule.id);
                expect(environment.name).to.be.equal(importedRule.name);
                expect(environment.indexPage).to.be.equal(importedRule.indexPage);
                expect(environment.directory).to.be.equal(importedRule.directory);
                expect(environment.url).to.be.equal(importedRule.url);
                expect(environment.isValid).to.be.equal(true);
            }

            expect(rules[0].id).to.be.equal(store.environments[0].id);
            expect(rules[1].id).to.be.equal(store.environments[0].id);
            expect(rules[0].condition).to.be.equal('http://localhost/*');
            expect(rules[1].condition).to.be.equal('https://localhost/*');

        });

        it('should not remove current environments', () => {
            const store = new Store();
            const importData: IStoreStorageData = {
                version: getVersion(),
                environments: [
                    {
                        id: generateId(),
                        directory: 'c:\\wwwroot\\',
                        indexPage: 'index.html',
                        name: 'wwwroot',
                        url: 'localhost'
                    }
                ]
            }

            const env = store.addEnvironment();
            env.directory = 'd:\\wwwroot\\';
            env.indexPage = 'index.html';
            env.directory = 'd:\\wwwroot\\';
            env.url = 'localhost';

            store.import(importData);
            const rules = store.rules;
            expect(store.environments).to.be.lengthOf(2);
            expect(rules).to.be.lengthOf(4);

            let environment = store.environments[0];

            expect(environment.id).to.be.equal(env.id);
            expect(environment.name).to.be.equal(env.name);
            expect(environment.indexPage).to.be.equal(env.indexPage);
            expect(environment.directory).to.be.equal(env.directory);
            expect(environment.url).to.be.equal(env.url);
            expect(environment.isValid).to.be.equal(true);

            environment = store.environments[1];
            const importedRule = importData.environments[0];

            expect(environment.id).to.be.equal(importedRule.id);
            expect(environment.name).to.be.equal(importedRule.name);
            expect(environment.indexPage).to.be.equal(importedRule.indexPage);
            expect(environment.directory).to.be.equal(importedRule.directory);
            expect(environment.url).to.be.equal(importedRule.url);
            expect(environment.isValid).to.be.equal(true);

            expect(rules[0].id).to.be.equal(store.environments[0].id);
            expect(rules[1].id).to.be.equal(store.environments[0].id);
            expect(rules[0].condition).to.be.equal('http://localhost/*');
            expect(rules[1].condition).to.be.equal('https://localhost/*');
            expect(rules[2].id).to.be.equal(store.environments[1].id);
            expect(rules[3].id).to.be.equal(store.environments[1].id);
            expect(rules[2].condition).to.be.equal('http://localhost/*');
            expect(rules[3].condition).to.be.equal('https://localhost/*');

        });

        it('should import v0.0.6 data', () => {
            const store = new Store();
            store.import(importData_v0_0_6);
            const rules = store.rules;
            expect(store.environments).to.be.lengthOf(4);
            expect(rules).to.be.lengthOf(8);

            for (let i = 0; i < store.environments.length; i++) {
                const environment = store.environments[i];
                const importData = importData_v0_0_6.rules[i];

                expect(environment.id).to.be.equal(importData.id);
                expect(environment.name).to.be.equal(importData.name);
                expect(environment.indexPage).to.be.equal(importData.indexPage);
                expect(environment.directory).to.be.equal(importData.directory);
                expect(environment.url).to.be.equal(importData.url);
                expect(environment.isValid).to.be.equal(true);
            }

            expect(rules[0].id).to.be.equal(store.environments[0].id);
            expect(rules[1].id).to.be.equal(store.environments[0].id);
            expect(rules[0].condition).to.be.equal('http://MyAmazingWebsite.com/wp-admin/*');
            expect(rules[1].condition).to.be.equal('https://MyAmazingWebsite.com/wp-admin/*');

            expect(rules[2].id).to.be.equal(store.environments[1].id);
            expect(rules[3].id).to.be.equal(store.environments[1].id);
            expect(rules[2].condition).to.be.equal('http://MyAmazingWebsite.com/*');
            expect(rules[3].condition).to.be.equal('https://MyAmazingWebsite.com/*');

            expect(rules[4].condition).to.be.equal('http://MySecondAmazingWebsite.co.uk/*');
            expect(rules[5].condition).to.be.equal('https://MySecondAmazingWebsite.co.uk/*');

            expect(rules[6].id).to.be.equal(store.environments[3].id);
            expect(rules[7].id).to.be.equal(store.environments[3].id);
            expect(rules[6].condition).to.be.equal('http://MyNotSoAmazingWebsite.org/*');
            expect(rules[7].condition).to.be.equal('https://MyNotSoAmazingWebsite.org/*');

        });

        it('should import v1.0.0 data', () => {
            const store = new Store();
            store.import(importData_v1_0_0);
            const rules = store.rules;
            expect(store.environments).to.be.lengthOf(4);
            expect(rules).to.be.lengthOf(8);

            for (let i = 0; i < store.environments.length; i++) {
                const environment = store.environments[i];
                const importData = importData_v1_0_0.environments[i];

                expect(environment.id).to.be.equal(importData.id);
                expect(environment.name).to.be.equal(importData.name);
                expect(environment.indexPage).to.be.equal(importData.indexPage);
                expect(environment.directory).to.be.equal(importData.directory);
                expect(environment.url).to.be.equal(importData.url);
                expect(environment.isValid).to.be.equal(true);
            }

            expect(rules[0].id).to.be.equal(store.environments[0].id);
            expect(rules[1].id).to.be.equal(store.environments[0].id);
            expect(rules[0].condition).to.be.equal('http://MyAmazingWebsite.com/wp-admin/*');
            expect(rules[1].condition).to.be.equal('https://MyAmazingWebsite.com/wp-admin/*');

            expect(rules[2].id).to.be.equal(store.environments[1].id);
            expect(rules[3].id).to.be.equal(store.environments[1].id);
            expect(rules[2].condition).to.be.equal('http://MyAmazingWebsite.com/*');
            expect(rules[3].condition).to.be.equal('https://MyAmazingWebsite.com/*');

            expect(rules[4].condition).to.be.equal('http://MySecondAmazingWebsite.co.uk/*');
            expect(rules[5].condition).to.be.equal('https://MySecondAmazingWebsite.co.uk/*');

            expect(rules[6].id).to.be.equal(store.environments[3].id);
            expect(rules[7].id).to.be.equal(store.environments[3].id);
            expect(rules[6].condition).to.be.equal('http://MyNotSoAmazingWebsite.org/*');
            expect(rules[7].condition).to.be.equal('https://MyNotSoAmazingWebsite.org/*');

        });
    });
    describe('load', () => {
        it('should remove current environments', () => {
            const store = new Store();
            const importData: IStoreStorageData = {
                version: getVersion(),
                environments: [
                    {
                        id: generateId(),
                        directory: 'c:\\wwwroot\\',
                        indexPage: 'index.html',
                        name: 'wwwroot',
                        url: 'localhost'
                    }
                ]
            }

            const env = store.addEnvironment();
            env.directory = 'd:\\wwwroot\\';
            env.indexPage = 'index.html';
            env.directory = 'd:\\wwwroot\\';
            env.url = 'localhost';

            store.load(importData);
            const rules = store.rules;
            expect(store.environments).to.be.lengthOf(1);
            expect(rules).to.be.lengthOf(2);

            const environment = store.environments[0];
            const importedRule = importData.environments[0];

            expect(environment.id).to.be.equal(importedRule.id);
            expect(environment.name).to.be.equal(importedRule.name);
            expect(environment.indexPage).to.be.equal(importedRule.indexPage);
            expect(environment.directory).to.be.equal(importedRule.directory);
            expect(environment.url).to.be.equal(importedRule.url);
            expect(environment.isValid).to.be.equal(true);

            expect(rules[0].id).to.be.equal(store.environments[0].id);
            expect(rules[1].id).to.be.equal(store.environments[0].id);
            expect(rules[0].condition).to.be.equal('http://localhost/*');
            expect(rules[1].condition).to.be.equal('https://localhost/*');
        });

        it('should load v0.0.6 data', (done) => {
            const timeOut = 0;
            const storageProvider = new UnitTestDataStorage(importData_v0_0_6, timeOut);
            const store = new Store(storageProvider, true, false);
            setTimeout(() => {
                const rules = store.rules;
                expect(store.environments).to.be.lengthOf(4);
                expect(rules).to.be.lengthOf(8);

                for (let i = 0; i < store.environments.length; i++) {
                    const environment = store.environments[i];
                    const importData = importData_v0_0_6.rules[i];

                    expect(environment.id).to.be.equal(importData.id);
                    expect(environment.name).to.be.equal(importData.name);
                    expect(environment.indexPage).to.be.equal(importData.indexPage);
                    expect(environment.directory).to.be.equal(importData.directory);
                    expect(environment.url).to.be.equal(importData.url);
                    expect(environment.isValid).to.be.equal(true);
                }

                expect(rules[0].id).to.be.equal(store.environments[0].id);
                expect(rules[1].id).to.be.equal(store.environments[0].id);
                expect(rules[0].condition).to.be.equal('http://MyAmazingWebsite.com/wp-admin/*');
                expect(rules[1].condition).to.be.equal('https://MyAmazingWebsite.com/wp-admin/*');

                expect(rules[2].id).to.be.equal(store.environments[1].id);
                expect(rules[3].id).to.be.equal(store.environments[1].id);
                expect(rules[2].condition).to.be.equal('http://MyAmazingWebsite.com/*');
                expect(rules[3].condition).to.be.equal('https://MyAmazingWebsite.com/*');

                expect(rules[4].condition).to.be.equal('http://MySecondAmazingWebsite.co.uk/*');
                expect(rules[5].condition).to.be.equal('https://MySecondAmazingWebsite.co.uk/*');

                expect(rules[6].id).to.be.equal(store.environments[3].id);
                expect(rules[7].id).to.be.equal(store.environments[3].id);
                expect(rules[6].condition).to.be.equal('http://MyNotSoAmazingWebsite.org/*');
                expect(rules[7].condition).to.be.equal('https://MyNotSoAmazingWebsite.org/*');

                done();
            }, timeOut);
        });

        it('should load v1.0.0 data', (done) => {
            const timeOut = 0;
            const storageProvider = new UnitTestDataStorage(importData_v1_0_0, timeOut);
            const store = new Store(storageProvider, true, false);
            setTimeout(() => {
                const rules = store.rules;
                expect(store.environments).to.be.lengthOf(4);
                expect(rules).to.be.lengthOf(8);

                for (let i = 0; i < store.environments.length; i++) {
                    const environment = store.environments[i];
                    const importData = importData_v1_0_0.environments[i];

                    expect(environment.id).to.be.equal(importData.id);
                    expect(environment.name).to.be.equal(importData.name);
                    expect(environment.indexPage).to.be.equal(importData.indexPage);
                    expect(environment.directory).to.be.equal(importData.directory);
                    expect(environment.url).to.be.equal(importData.url);
                    expect(environment.isValid).to.be.equal(true);
                }

                expect(rules[0].id).to.be.equal(store.environments[0].id);
                expect(rules[1].id).to.be.equal(store.environments[0].id);
                expect(rules[0].condition).to.be.equal('http://MyAmazingWebsite.com/wp-admin/*');
                expect(rules[1].condition).to.be.equal('https://MyAmazingWebsite.com/wp-admin/*');

                expect(rules[2].id).to.be.equal(store.environments[1].id);
                expect(rules[3].id).to.be.equal(store.environments[1].id);
                expect(rules[2].condition).to.be.equal('http://MyAmazingWebsite.com/*');
                expect(rules[3].condition).to.be.equal('https://MyAmazingWebsite.com/*');

                expect(rules[4].condition).to.be.equal('http://MySecondAmazingWebsite.co.uk/*');
                expect(rules[5].condition).to.be.equal('https://MySecondAmazingWebsite.co.uk/*');

                expect(rules[6].id).to.be.equal(store.environments[3].id);
                expect(rules[7].id).to.be.equal(store.environments[3].id);
                expect(rules[6].condition).to.be.equal('http://MyNotSoAmazingWebsite.org/*');
                expect(rules[7].condition).to.be.equal('https://MyNotSoAmazingWebsite.org/*');

                done();
            }, timeOut);
        });
    });
});
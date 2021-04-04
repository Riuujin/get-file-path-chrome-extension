import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EnvironmentListView from './Components/EnvironmentListView';
import ButtonBar from './Components/ButtonBar';
import Store from './Stores/Store';
import ChromeExtensionStorage from './StorageProviders/ChromeExtensionStorage';

// @ts-ignore
require('../style/style.scss');//Ensure styling 
configure({
    enforceActions: 'never'
});

const storageProvider = new ChromeExtensionStorage();
const store = new Store(storageProvider, true, true);


ReactDOM.render(
    <Provider store={store}>
        <div className="app">
            <EnvironmentListView />
            <ButtonBar />
        </div>
    </Provider>
    , document.getElementById('root'));



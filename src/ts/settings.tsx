import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import EnvironmentListView from './Components/EnvironmentListView';
import ButtonBar from './Components/ButtonBar';
import Store from './Stores/Store';
import ChromeExtensionStorage from './StorageProviders/ChromeExtensionStorage';

// @ts-ignore
import '../style/style.scss'
configure({
    enforceActions: 'never'
});

const storageProvider = new ChromeExtensionStorage();
const store = new Store(storageProvider, true, true);


const root = createRoot(document.getElementById('root'));
root.render(<Provider store={store}>
        <div className="app">
            <EnvironmentListView />
            <ButtonBar />
        </div>
    </Provider>);





import { action } from 'mobx';
import { observer, inject } from 'mobx-react';
import * as React from 'react';
import Environment from '../Environment/Environment';
import EnvironmentView from './EnvironmentView';
import { generateId } from '../Utils';
import IStore from '../Stores/IStore';

@inject('store')
@observer
export default class EnvironmentListView extends React.Component {
    private fileField: HTMLInputElement;

    private get injected(): { store: IStore } {
        return this.props as { store: IStore };
    }

    public render() {
        return <div className="fixed-buttonbar">
            <button type="button" className="btn btn-light" onClick={() => this.import()} >Import</button>
            <button type="button" className="btn btn-light" onClick={() => this.export()} disabled={this.injected.store.environments.length === 0}>Export</button>
            <button type="button" onClick={() => this.injected.store.addEnvironment()} className="btn btn-primary">New</button>
        </div>
    }

    private import() {
        if (this.fileField != null) {
            this.fileField.remove();
            this.fileField = null;
        }


        this.fileField = document.createElement('input');
        this.fileField.type = 'file';
        this.fileField.className = 'hidden';
        this.fileField.onchange = () => {

            var file = this.fileField.files[0];
            var reader = new FileReader();
            reader.onload = (e) => {
                var data = JSON.parse(reader.result);
                this.injected.store.import(data)
            };
            reader.readAsText(file);


            this.fileField.remove();
        }


        document.getElementsByTagName('body')[0].appendChild(this.fileField);
        this.fileField.click();
    }

    private export() {
        let a = document.createElement('a');
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.injected.store.export()));
        a.download = 'export.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

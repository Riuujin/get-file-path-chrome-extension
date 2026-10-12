import { observer } from 'mobx-react';
import * as React from 'react';
import IStore from '../Stores/IStore';

interface IButtonBarProps {
    store: IStore;
}

const ButtonBar = observer(class ButtonBar extends React.Component<IButtonBarProps> {
    private fileField: HTMLInputElement;

    constructor(props: IButtonBarProps, context: any) {
        super(props, context);
    }

    public render() {
        const { store } = this.props;
        return <div className="fixed-buttonbar">
            <button type="button" className="btn btn-light" onClick={() => this.import()} >Import</button>
            <button type="button" className="btn btn-light" onClick={() => this.export()} disabled={store.environments.length === 0}>Export</button>
            <button type="button" onClick={() => store.addEnvironment()} className="btn btn-primary">New</button>
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
            let file = this.fileField.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                let data = JSON.parse(reader.result as any);
                this.props.store.import(data);
            };
            reader.readAsText(file);

            this.fileField.remove();
        };

        document.getElementsByTagName('body')[0].appendChild(this.fileField);
        this.fileField.click();
    }

    private export() {
        let a = document.createElement('a');
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.store.export()));
        a.download = 'export.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

export default ButtonBar;

import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import ConfirmDialog from './Dialog'
import IEnvironment from '../Environment/IEnvironment';

interface IEnvironmentview {
    env: IEnvironment;
    onRemove: (id: string) => void;
    onMoveDown: (id: string) => void;
    onMoveUp: (id: string) => void;
    canMoveDown: boolean;
    canMoveUp: boolean;
}


@observer
export default class EnvironmentView extends React.Component<IEnvironmentview> {
    private confirmDialog: ConfirmDialog | null;

    public render() {
        const env = this.props.env;
        return (
            <tr className="was-validated">
                <td><input type='text' defaultValue={env.name} onChange={this.onRename} placeholder="My website" className="form-control" /></td>
                <td><input type='text' defaultValue={env.url} onChange={this.onUrlChange} placeholder="mywebsite.com" required className="form-control" /></td>
                <td><input type='text' defaultValue={env.directory} onChange={this.onDirChange} placeholder="/mywebsite/wwwroot/" required className="form-control" /></td>
                <td><input type='text' defaultValue={env.indexPage} onChange={this.onIndexPageChange} placeholder="index.html" required className="form-control" /></td>
                <td className="collumn-small">
                    <button onClick={this.onRemovePrompt} className="btn btn-danger">Remove</button>
                    <ConfirmDialog title="Are you sure?" question="Are you sure you want to delete this item?" onOk={this.onRemove} ref={(c) => { this.confirmDialog = c; }} />
                </td>
                <td className="collumn-small">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-secondary" disabled={!this.props.canMoveUp} onClick={this.onMoveUp}>&#x25B2;</button>
                        <button type="button" className="btn btn-secondary" disabled={!this.props.canMoveDown} onClick={this.onMoveDown}>&#x25BC;</button>
                    </div>
                </td>
            </tr>
        );
    }

    @action private onRename = (event: React.ChangeEvent<HTMLInputElement>) => {
        const env = this.props.env;
        env.name = event.currentTarget.value;
    }

    @action private onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const env = this.props.env;
        env.url = event.currentTarget.value;
    }

    @action private onDirChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const env = this.props.env;
        env.directory = event.currentTarget.value;
    }

    @action private onIndexPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const env = this.props.env;
        env.indexPage = event.currentTarget.value;
    }

    private onMoveDown = () => {
        this.props.onMoveDown(this.props.env.id);
    }

    private onMoveUp = () => {
        this.props.onMoveUp(this.props.env.id);
    }

    private onRemove = () => {
        this.props.onRemove(this.props.env.id);
    }

    private onRemovePrompt = () => {
        if (this.confirmDialog != null) {
            this.confirmDialog.open();
        }
    }
}
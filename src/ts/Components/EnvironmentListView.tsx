import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Environment from '../Environment/Environment';
import EnvironmentView from './EnvironmentView';
import IStore from '../Stores/IStore';

@inject('store')
@observer
export default class EnvironmentListView extends React.Component {
    constructor(props: {}, context: any) {
        super(props, context);
    }

    private get injected(): { store: IStore } {
        return this.props as { store: IStore };
    }

    public render() {
        return <div className="fixed-content">
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Url</th>
                        <th scope="col">Dir</th>
                        <th scope="col">Index page</th>
                        <th scope="col"></th>
                        <th scope="col">
                            <a href="https://github.com/Riuujin/get-file-path-chrome-extension" title="GitHub Page" target="_blank" className="float-right url-github"></a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.injected.store.environments.map(env => {
                        const canMoveUp = this.injected.store.environments[0].id !== env.id;
                        const canMoveDown = this.injected.store.environments[this.injected.store.environments.length - 1].id !== env.id;
                        return <EnvironmentView env={env} key={env.id}
                            onRemove={() => this.injected.store.removeEnvironment(env)}
                            onMoveDown={() => this.injected.store.moveEnvironmentDown(env)}
                            onMoveUp={() => this.injected.store.moveEnvironmentUp(env)}
                            canMoveUp={canMoveUp} canMoveDown={canMoveDown} />
                    }
                    )}
                </tbody>
            </table>
        </div>
    }

}

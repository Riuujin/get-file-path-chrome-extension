import { observer } from 'mobx-react';
import * as React from 'react';
import EnvironmentView from './EnvironmentView';
import IStore from '../Stores/IStore';

interface IEnvironmentListViewProps {
    store: IStore;
}

const EnvironmentListView = observer(class EnvironmentListView extends React.Component<IEnvironmentListViewProps> {
    constructor(props: IEnvironmentListViewProps, context: any) {
        super(props, context);
    }

    public render() {
        const { store } = this.props;
        return <div className="fixed-content">
            <table className="table table-hover">
                <thead className="table-dark">
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
                    {store.environments.map(env => {
                        const canMoveUp = store.environments[0].id !== env.id;
                        const canMoveDown = store.environments[store.environments.length - 1].id !== env.id;
                        return <EnvironmentView env={env} key={env.id}
                            onRemove={() => store.removeEnvironment(env)}
                            onMoveDown={() => store.moveEnvironmentDown(env)}
                            onMoveUp={() => store.moveEnvironmentUp(env)}
                            canMoveUp={canMoveUp} canMoveDown={canMoveDown} />
                    }
                    )}
                </tbody>
            </table>
        </div>
    }
});

export default EnvironmentListView;

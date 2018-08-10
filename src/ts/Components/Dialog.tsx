import * as React from 'react';

interface IDialogProps {
    title: string;
    question: string;
    onOk: () => void;
}

export default class ConfirmDialog extends React.Component<IDialogProps, { isOpen: boolean }> {
    constructor(props?: IDialogProps) {
        super(props);
        this.state = { isOpen: false };

    }

    public render() {
        if (!this.state.isOpen) {
            return null;
        }

        return <div className="confirm-dialog">
            <dialog className="confirm-dialog__dialog modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{this.props.title}</h5>
                    <button type="button" className="close" onClick={()=>this.setState({isOpen: false})} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>{this.props.question}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={()=>{this.setState({isOpen: false});this.props.onOk();}}>Ok</button>
                    <button type="button" className="btn btn-secondary" onClick={()=>this.setState({isOpen: false})}>Cancel</button>
                </div>
            </dialog>
            <div className="confirm-dialog__overlay"></div>
        </div>
    }

    public open(){
        this.setState({isOpen: true });
    }
}
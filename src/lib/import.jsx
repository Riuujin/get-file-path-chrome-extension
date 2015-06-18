var React = require('react')
    Confirm = require('./confirm');

var  Import = React.createClass({
    getInitialState:function(){
        return {importing: false};
    },
    onFileChange : function(e){
        $(React.findDOMNode(this.refs.importProgress)).openModal({ dismissible: false });

        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);

        //Ensure that the same file will work again.
        e.target.value = null;

        reader.onload = function(e){
            var data = JSON.parse(e.target.result);
            this.props.onImport(data);
            $(React.findDOMNode(this.refs.importProgress)).closeModal();
        }.bind(this);
    },
    onImportClick:function(){
       this.refs.confirmImport.show();
    },
    onImportConfirmedClick:function(){
        React.findDOMNode(this.refs.fileField).click();
    },
    render : function(){
        return (
                <div>
                    <div className="fixed-action-btn" style={{bottom: '25px',right: '90px'}}>
                        <a className="btn-floating btn-large waves-effect waves-light button-secondary-color" title="Import" onClick={this.onImportClick}><i className="mdi-file-file-upload"></i></a>
                    </div>
                    <input type="file" onChange={this.onFileChange} ref="fileField" style={{display:'none'}} />
                    <Confirm ref="confirmImport" title="Import" message="Data could be overwritten, make sure you have a backup (export)." onConfirm={this.onImportConfirmedClick} />
                    <div className="modal" ref="importProgress">
                        <div className="modal-content">
                            <h4>Importing</h4>
                            <div className="progress">
                                <div className="indeterminate"></div>
                            </div>
                            <div className="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
});

module.exports = Import;
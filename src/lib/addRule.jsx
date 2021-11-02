var React = require('react'),
    helpers = require('./helpers'),
    uuid = require('node-uuid');

var AddRule = React.createClass({
    handleSubmit:function(e){
        e.preventDefault();

        var name = React.findDOMNode(this.refs.name).value.trim();
        var directory = React.findDOMNode(this.refs.directory).value.trim();
        var url = React.findDOMNode(this.refs.url).value.trim();
        var indexPage = React.findDOMNode(this.refs.indexPage).value.trim();
        var conditions = helpers.createConditions(url);

        this.props.onCreateRule({
            name : name,
            directory: directory,
            url: url,
            indexPage:indexPage,
            conditions: conditions
        });

        $(React.findDOMNode(this.refs.dialog)).closeModal();

        setTimeout(function(){
            React.findDOMNode(this.refs.name).value = '';
            React.findDOMNode(this.refs.directory).value = '';
            React.findDOMNode(this.refs.url).value = '';
            React.findDOMNode(this.refs.indexPage).value = '';
        }.bind(this),50);

        return;
    },
    onAddClick:function(){
        $(React.findDOMNode(this.refs.dialog)).openModal({dismissible: false });
    },
    render : function(){
        return (
            <div>
                <div className="fixed-action-btn" style={{bottom: '25px',right: '25px'}}>
                    <a className="btn-floating btn-large waves-effect waves-light button-primary-color" title="Add rule" onClick={this.onAddClick}><i className="mdi-content-add"></i></a>
                </div>
                <div id={uuid.v1()} className="modal" ref="dialog">
                    <form onSubmit={this.handleSubmit}>
                        <div className="modal-content">
                            <h4>Add rule</h4>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input required id="name" type="text" className="validate" ref="name" />
                                    <label htmlFor="name">Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input required id="directory" type="text" className="validate" ref="directory" />
                                    <label htmlFor="directory">Directory</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input required id="url" type="text" className="validate" ref="url" />
                                    <label htmlFor="url">Url</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input required id="indexPage" type="text" className="validate" ref="indexPage" />
                                    <label htmlFor="indexPage">Index page</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="waves-effect waves-green btn-flat">Ok</button>
                            <button type="button" className="modal-action modal-close  waves-effect waves-green btn-flat">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
});

    module.exports = AddRule;
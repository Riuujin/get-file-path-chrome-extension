var React = require('react'),
  helpers = require('./helpers'),
  uuid = require('node-uuid');

var EditRule = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();

    var name = React.findDOMNode(this.refs.name).value.trim();
    var directory = React.findDOMNode(this.refs.directory).value.trim();
    var url = React.findDOMNode(this.refs.url).value.trim();
    var indexPage = React.findDOMNode(this.refs.indexPage).value.trim();
    var conditions = this.props.conditions;

    if (url != this.props.url) {
      conditions = helpers.createConditions(url);
    }

    this.props.onRuleChange({
      id: this.props.id,
      name: name,
      directory: directory,
      url: url,
      indexPage: indexPage,
      conditions: conditions
    });

    $(React.findDOMNode(this.refs.dialog)).closeModal();

    setTimeout(function(){
        React.findDOMNode(this.refs.name).value = name;
        React.findDOMNode(this.refs.directory).value = directory;
        React.findDOMNode(this.refs.url).value = url;
        React.findDOMNode(this.refs.indexPage).value = indexPage;
    }.bind(this),50);

    return;
  },
  onCancelClick:function(){
    setTimeout(function(){
        React.findDOMNode(this.refs.name).value = this.props.name;
        React.findDOMNode(this.refs.directory).value = this.props.directory;
        React.findDOMNode(this.refs.url).value = this.props.url;
        React.findDOMNode(this.refs.indexPage).value = this.props.indexPage;
    }.bind(this),50);
  },
  onEditClick: function () {
    $(React.findDOMNode(this.refs.dialog)).openModal({
      dismissible: false
    });
  },
  render: function () {
    return (
      <div  style={{display:'inline-block'}}>
        <button className="btn-floating waves-effect waves-light custom-btn-icon" onClick={this.onEditClick} title="Edit" type="button">
          <i className="mdi-image-edit" />
        </button>
        <div className="modal" id={uuid.v1()} ref="dialog">
          <form onSubmit={this.handleSubmit}>
            <div className="modal-content">
              <h4>Edit rule</h4>
              <div className="row">
                <div className="input-field col s12">
                  <input className="validate" defaultValue={this.props.name} id="name" ref="name" required type="text" />
                  <label htmlFor="name" className="active">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input className="validate" defaultValue={this.props.directory} id="directory" ref="directory" required type="text" />
                  <label htmlFor="directory" className="active">Directory</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input className="validate" defaultValue={this.props.url} id="url" ref="url" required type="text" />
                  <label htmlFor="url" className="active">Url</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input className="validate" defaultValue={this.props.indexPage} id="indexPage" ref="indexPage" required type="text" />
                  <label htmlFor="indexPage" className="active">Index page</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="waves-effect waves-green btn-flat" type="submit">Ok</button>
              <button className="modal-action modal-close waves-effect waves-green btn-flat" type="button" onClick={this.onCancelClick}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = EditRule;
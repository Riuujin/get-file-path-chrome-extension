var React = require('react'),
  Confirm = require('./confirm'),
  EditRule = require('./editRule');

var Rule = React.createClass({
  handleUpButton: function () {
    this.props.onRuleMove(this.props.id, 'up');
  },
  handleDownButton: function () {
    this.props.onRuleMove(this.props.id, 'down');

  },
  handleEditButton: function () {
    this.refs.edit.show();
  },
  handleDeleteButton: function () {
    this.refs.confirmDelete.show();
  },
  handleDeleteConfirmed: function () {
    this.props.onRuleDelete(this.props.id);
  },
  render: function () {
    return (
      <tr className="rule">
        <td className="name">{this.props.name}</td>
        <td className="directory">{this.props.directory}</td>
        <td className="url">{this.props.url}</td>
        <td className="index-page">{this.props.indexPage}</td>
        <td>
          <button className="btn-floating waves-effect waves-light custom-btn-icon" disabled={this.props.index == 0} onClick={this.handleUpButton} title="Move up" type="button"><i className="mdi-navigation-arrow-drop-up" /></button>
          <button className="btn-floating waves-effect waves-light custom-btn-icon" disabled={this.props.isLast} onClick={this.handleDownButton} title="Move down" type="button"><i className="mdi-navigation-arrow-drop-down" /></button>
          <EditRule conditions={this.props.conditions} directory={this.props.directory} id={this.props.id} indexPage={this.props.indexPage} name={this.props.name} onRuleChange={this.props.onRuleChange} url={this.props.url} />
          <button className="btn-floating waves-effect waves-light custom-btn-icon" title="Delete" type="button" onClick={this.handleDeleteButton}>
            <i className="mdi-action-delete"></i>
          </button>
          <Confirm ref="confirmDelete" title="Delete" message="Are you sure you want to delete this rule?" onConfirm={this.handleDeleteConfirmed} />
        </td>
      </tr>
    );
  }
});

module.exports = Rule;
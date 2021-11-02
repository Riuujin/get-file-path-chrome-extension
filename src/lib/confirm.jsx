var React = require('react');

var Confirm = React.createClass({
  propTypes: {
    title: React.PropTypes.node,
    message: React.PropTypes.node,
    onConfirm: React.PropTypes.func,
    onCancel: React.PropTypes.func
  },
  show: function () {
    $(React.findDOMNode(this.refs.confirmDialog)).openModal({
      dismissible: false
    });
    React.findDOMNode(this.refs.okBtn).focus();
  },
  dismiss: function () {
    $(React.findDOMNode(this.refs.confirmDialog)).closeModal();
  },
  render: function () {
    return (
      <div className="modal" ref="confirmDialog">
        <div className="modal-content">
          <h4>{this.props.title}</h4>
          <p>{this.props.message}</p>
        </div>
        <div className="modal-footer">
          <a className="modal-action modal-close waves-effect waves-green btn-flat" href="#!" onClick={this.props.onConfirm} ref="okBtn">{this.props.okBtnText || 'Ok'}</a>
          <a className="modal-action modal-close waves-effect waves-green btn-flat" href="#!" onClick={this.props.onCancel} ref="cancelBtn">{this.props.cancelBtnText || 'Cancel'}</a>
        </div>
      </div>
    )
  }
});

module.exports = Confirm;
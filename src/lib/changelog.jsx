var React = require('react'),
    marked = require('marked');

var Changelog = React.createClass({
  componentDidMount: function () {
    $.ajax({
        url: chrome.extension.getURL('CHANGELOG.md'),
      cache: true,
      success: function(data) {
        this.setState({changelog: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return {
      changelog: '',
    };
  },
  show: function () {
    $(React.findDOMNode(this.refs.changelogDialog)).openModal();
  },
  dismiss: function () {
    $(React.findDOMNode(this.refs.changelogDialog)).closeModal();
  },
  render: function () {
    var rawMarkup = marked(this.state.changelog, {sanitize: true});

    return (
      <div className="modal modal-fixed-footer" ref="changelogDialog">
        <div className="modal-content">
          <h4>Changelog</h4>
          <span className="changelog" dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>
        <div className="modal-footer">
          <a className="modal-action modal-close waves-effect waves-green btn-flat" href="#!">Ok</a>
        </div>
      </div>
    )
  }
});

module.exports = Changelog;
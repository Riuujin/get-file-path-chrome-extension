var React = require('react');

var Export = React.createClass({
    exportData : function(){
        var a = document.createElement('a');
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.exportData));
        a.download = this.props.fileName || 'export.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    render : function(){
        return (
                <div className="fixed-action-btn" style={{bottom: '25px',right: '155px'}}>
                    <a className="btn-floating btn-large waves-effect waves-light button-secondary-color" title="Export" onClick={this.exportData}><i className="mdi-file-file-download"></i></a>
                </div>
        )
    }
});

module.exports = Export;
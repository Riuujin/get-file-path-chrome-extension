var React = require('react'),
  Rule = require('./rule');

var RuleList = React.createClass({
  render: function () {
    var ruleNodes = this.props.rules.map(function (rule, i) {
      var isLast = i == this.props.rules.length - 1;
      return (
        <Rule id={rule.id} key={rule.id} isLast={isLast} conditions={rule.conditions} directory={rule.directory} indexPage={rule.indexPage} index={i} name={rule.name} onRuleChange={this.props.onRuleChange} onRuleDelete={this.props.onRuleDelete} onRuleMove={this.props.onRuleMove} url={rule.url} />
      );
    }.bind(this));

    return (
      <table className="bordered striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Directory</th>
            <th>Url</th>
            <th>Index page</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ruleNodes}
        </tbody>
      </table>
    );
  }
});

module.exports = RuleList;
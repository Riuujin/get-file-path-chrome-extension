global.jQuery = require('jquery');
global.$ = global.jQuery;

var React = require('react'),
  _ = require('lodash'),
  uuid = require('node-uuid'),
  helpers = require('./lib/helpers'),
  Import = require('./lib/import'),
  Export = require('./lib/export'),
  AddRule = require('./lib/addRule'),
  RuleList = require('./lib/ruleList'),
  Changelog = require('./lib/changelog');

var Settings = React.createClass({
  saveToStorage: function () {
    chrome.storage.local.set({
      rules: this.state.rules
    });
  },
  loadFromToStorage: function () {
    chrome.storage.local.get(null, function (items) {
      this.setState({
        rules: items.rules || [],
        spinner: false
      });
    }.bind(this));
  },
  componentDidMount: function () {
    this.loadFromToStorage();
  },
  getInitialState: function () {
    return {
      rules: [],
      spinner: true
    };
  },
  findRuleIndexById: function (id) {
    return _.findIndex(this.state.rules, function (rule) {
      return rule.id == id;
    });
  },
  createRule: function (rule) {
    var rules = this.state.rules;

    //Ensure unique id.
    do
    {
      rule.id = uuid.v1();
    }
    while (this.findRuleIndexById(rule.id) != -1 || _.isUndefined(rule.id) || _.isEmpty(rule.id))

    rules.push(rule);

    this.setState({
      rules: rules
    }, function () {
      this.saveToStorage();
    }.bind(this));
  },
  changeRule: function (rule) {
    var rules = this.state.rules;

    var index = this.findRuleIndexById(rule.id);

    rules[index] = rule;

    this.setState({
      rules: rules
    }, function () {
      this.saveToStorage();
    }.bind(this));
  },
  moveRule: function (ruleId, direction) {
    var rules = this.state.rules;

    if (direction == 'up') {
      var index = this.findRuleIndexById(ruleId);
      var rule = rules[index];

      if (index > 0) {
        rules[index] = rules[index - 1];
        rules[index - 1] = rule;
        this.setState({
          rules: rules
        }, function () {
          this.saveToStorage();
        }.bind(this));
      }
    } else if (direction == 'down') {
      var index = this.findRuleIndexById(ruleId);
      var rule = rules[index];

      if (index != rules.length - 1) {
        rules[index] = rules[index + 1];
        rules[index + 1] = rule;
        this.setState({
          rules: rules
        }, function () {
          this.saveToStorage();
        }.bind(this));
      }
    }
  },
  deleteRuleById: function (id) {
    var rules = _.filter(this.state.rules, function (rule) {
      return rule.id != id;
    });
    this.setState({
      rules: rules
    }, function () {
      this.saveToStorage();
    }.bind(this));
  },
  importRule: function (data) {
    var isChanged = false;
    var rules = this.state.rules;

    _.forEach(data.rules, function (rule) {
      //First ensure we have everything
      if (!_.isUndefined(rule.name) && !_.isEmpty(rule.name) && !_.isUndefined(rule.directory) && !_.isEmpty(rule.directory) && !_.isUndefined(rule.url) && !_.isEmpty(rule.url) && !_.isUndefined(rule.indexPage) && !_.isEmpty(rule.indexPage)) {
        isChanged = true;
        var isNewRule = true;

        //Now we can import
        if (!_.isUndefined(rule.id) && !_.isEmpty(rule.id)) {
          //Update existing rule.
          var index = this.findRuleIndexById(rule.id);

          if (index >= 0) {
            if (_.isUndefined(rule.conditions) || _.isEmpty(rule.conditions)) {
              rule.conditions = helpers.createConditions(rule.url);
            }

            rules[index] = rule;
            isNewRule = false;
          }
        }

        if (isNewRule) {
          while (this.findRuleIndexById(rule.id) != -1 || _.isUndefined(rule.id) || _.isEmpty(rule.id)) {
            rule.id = uuid.v1();
          }

          if (_.isUndefined(rule.conditions) || _.isEmpty(rule.conditions)) {
            rule.conditions = helpers.createConditions(rule.url);
          }

          rules.push(rule);
        }
      }
    }.bind(this));

    if (isChanged) {
      this.setState({
        rules: rules
      }, function () {
        this.saveToStorage();
      }.bind(this));
    }
  },
  openChangelog: function(){
    this.refs.changelog.show();
  },
  render: function () {
    var spinnerStyle = {
      display: this.state.spinner ? 'block' : 'none'
    }

    return (
      <div className="wrapper">
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <span className="brand-logo">Settings</span>
                <ul className="right hide-on-med-and-down">
                  <li><a href="#!" onClick={this.openChangelog}>Changelog</a></li>
                  <li><a href="https://github.com" target="_blank">GitHub</a></li>
                </ul>
            </div>
          </nav>
        </div>
        <div className="progress" style={spinnerStyle}>
          <div className="indeterminate"></div>
        </div>
        <RuleList onRuleChange={this.changeRule} onRuleDelete={this.deleteRuleById} onRuleMove={this.moveRule} rules={this.state.rules} />
        <AddRule dialogTitle="Add rule" onCreateRule={this.createRule} />
        <Export exportData={this.state} />
        <Import onImport={this.importRule} />
        <Changelog ref="changelog" />
      </div>
    );
  }
});

React.render(<Settings />, document.getElementById('content'));
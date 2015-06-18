var uuid = require('node-uuid'),
    _ = require('lodash');

module.exports = {
    patch_0_0_6: function () {
        //Ensure all rules have an unique id.
        function findRuleIndexById(rule, rules) {
            return _.findIndex(rules, function (currentRule) {
                return currentRule.id == id && currentRule != rule;
            });
        }
        chrome.storage.local.get(null, function (items) {
            if (typeof (items.rules) !== 'undefined') {
                var rules = items.rules;
                _.forEach(rules, function (rule) {
                    if (_.isUndefined(rule.id) || _.isEmpty(rule.id)) {
                        do {
                            rule.id = uuid.v1();
                        }
                        while (findRuleIndexById(rule, rules) != -1 || _.isUndefined(rule.id) || _.isEmpty(rule.id))
                    }
                });

                chrome.storage.local.set({
                    rules: rules
                });
            }
        });
    }
}
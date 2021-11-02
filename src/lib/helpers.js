module.exports = {
  createConditions: function(url) {
    //create conditions
    var conditions = [];

    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.endsWith('/')) {
        conditions.push(url + '*');
      } else {
        conditions.push(url + '/*');
      }
    } else {
      if (url.endsWith('/')) {
        conditions.push('http://' + url + '*');
        conditions.push('https://' + url + '*');
      } else {
        conditions.push('http://' + url + '/*');
        conditions.push('https://' + url + '/*');
      }
    }

    return conditions;
  }
}
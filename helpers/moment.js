var moment = require('moment');
module.exports = function (date, pattern){
  return moment(date).format(pattern);
}
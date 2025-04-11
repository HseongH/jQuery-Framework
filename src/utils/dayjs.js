var dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration');
var relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/ko');

var getDuration = function (dateTime) {
	dayjs.extend(duration);
	dayjs.extend(relativeTime);
	dayjs.locale('ko');

	return dayjs.duration(dayjs().diff(dateTime)).humanize() + ' 전';
};

module.exports = {
	getDuration: getDuration
};

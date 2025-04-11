require('bootstrap');

var $ = require('jquery');
var pageScript = {
	index: require('./js'),
	detail: require('./js/detail'),
	question: require('./js/question')
};
var page = location.pathname.slice(1).replace(/\.html/gi, '') || 'index';

$(function () {
	pageScript[page].init();
});

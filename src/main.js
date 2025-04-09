require('bootstrap');

var $ = require('jquery');
var pageScript = {
	index: require('./js'),
	detail: require('./js/detail'),
	question: require('./js/question')
};
var page = location.pathname.slice(1).replace(/\.html/gi, '') || 'index';

$.ajax({
	url: '/auth-user/me',
	type: 'GET',
	global: false,
	statusCode: {
		200: function () {
			$(function () {
				pageScript[page].init();
			});
		},
		401: function () {
			location.href = '/oauth2/authorization/middle-proxy';
		}
	}
});

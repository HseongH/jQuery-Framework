require('select2')();

var $ = require('jquery');
var _ = require('underscore');

var init = function () {
	$('#post_filter').select2();

	$.ajax({
		url: '/engine-search-api/engine/bbs/subject',
		type: 'GET',
		success: function (data) {
			console.log(data);
		}
	});
};

module.exports = {
	init: init
};

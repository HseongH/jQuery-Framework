var $ = require('jquery');
require('../partials/post-list');

var init = function () {
	var searchAfter = [];
	var getPostList = function () {
		$.ajax({
			url: '/bbs/board-list/only-post-list',
			type: 'GET',
			data: {
				'searchAfter[]': searchAfter
			},
			success: function (data) {
				searchAfter = data.response.searchAfter;
				$('#post_list').postList(data.response.bbsEntities);
			}
		});
	};

	getPostList();
	$('#next_btn').on('click', getPostList);
};

module.exports = {
	init: init
};

var $ = require('jquery');
var Quill = require('quill/dist/quill');
require('../partials/post');

var init = function () {
	var quill = new Quill('#editor', {
		theme: 'snow'
	});

	var urlParams = new URL(location.href).searchParams;
	var id = urlParams.get('id');
	var path;

	var getPosts = function () {
		$.ajax({
			url: '/bbs/find-path/find-id/' + id,
			type: 'GET',
			success: function (data) {
				path = data.response[0].path;
				$('#post_list').post(data.response);
			}
		});
	};

	getPosts();

	$('#reply_form').on('submit', function (event) {
		event.preventDefault();
		var reply = { contents: quill.getSemanticHTML(0, quill.getLength()), path: path };

		$.ajax({
			url: '/bbs/reply-message',
			type: 'POST',
			contentType: 'application/json;charset=utf-8',
			data: JSON.stringify(reply),
			success: function () {
				$(event.target).trigger('reset');
				$('#post_list').empty();
				getPosts();
			}
		});

		return false;
	});
};

module.exports = {
	init: init
};

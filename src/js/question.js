var $ = require('jquery');
var Quill = require('quill/dist/quill');

var init = function () {
	var quill = new Quill('#editor', {
		theme: 'snow',
		rows: 10
	});

	$('#post_form').on('submit', function (event) {
		var post = Object.fromEntries(new FormData(event.target));
		post.contents = quill.getSemanticHTML(0, quill.getLength());

		$.ajax({
			url: '/bbs/post-message',
			type: 'POST',
			contentType: 'application/json;charset=utf-8',
			data: JSON.stringify(post),
			success: function (result) {
				location.replace('detail.html?id=' + result.response);
			}
		});

		return false;
	});
};

module.exports = {
	init: init
};

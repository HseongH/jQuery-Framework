var $ = require('jquery');
var _ = require('underscore');
var getDuration = require('../utils/dayjs').getDuration;

var Post = function (target) {
	this.$target = target;
	this.template = _.template(
		'<li class="media border-bottom">' +
			'   <div class="media-body mt-3">' +
			'	   <div class="text-muted mb-3">' +
			'         <span><%- createdDate %></span>' +
			'         <% if (postType === "POST") { %>' +
			'         <span class="ml-2"><%- viewCount %></span>' +
			'         <% } %>' +
			'      </div>' +
			'      <% if (postType === "POST") { %>' +
			'      <h5 class="mt-0 mb-2"><%- subjectName %></h5>' +
			'      <% } %>' +
			'      <p><%= contents %></p>' +
			'   </div>' +
			'</li>'
	);
};

Post.prototype.drawPost = function (post) {
	this.$target.append(this.template(post));
};

$.fn.post = function (posts) {
	var $target = $(this);
	var post = new Post($target);

	posts.forEach(function (_post, _postIndex) {
		var createdDate = getDuration(_post.createdDate);
		post.drawPost(
			_.extend(_post, {
				createdDate: createdDate,
				viewCount: _post.viewCount || 0,
				lastPost: posts.length - 1 <= _postIndex
			})
		);
	});
};

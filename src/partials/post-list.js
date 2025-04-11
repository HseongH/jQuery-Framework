var $ = require('jquery');
var _ = require('underscore');
var getDuration = require('../utils/dayjs').getDuration;

var PostList = function (target) {
	this.$target = target;
	this.template = _.template(
		'<li class="list-group-item list-group-item-action">' +
			'   <div class="d-flex w-100 justify-content-between">' +
			'	   <h5 class="mb-1"><a href="detail.html?id=<%- id %>"><%- subjectName %></a></h5>' +
			'	   <small><%- createdDate %></small>' +
			'   </div>' +
			'   <p class="mb-1 text-muted"><%= contents %></p>' +
			'</li>'
	);
};

PostList.prototype.drawPosts = function (post) {
	this.$target.append(this.template(post));
};

$.fn.postList = function (posts) {
	var $target = $(this);
	var post = new PostList($target);

	posts.forEach(function (_post) {
		var createdDate = getDuration(_post.createdDate);
		post.drawPosts(_.extend(_post, { createdDate: createdDate }));
	});
};

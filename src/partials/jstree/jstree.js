$('#group_tree')
	.trigger('init.group_tree')
	.on('select_node.jstree', function (_, data) {
		var groupId = data.inst.get_json()[0].metadata.id;

		if (!groupId) return;

		$.ajax({
			url: '/auth-admin/realms/master/groups/' + groupId,
			type: 'GET',
			success: function (group) {
				var groupForm = $('#group_form');

				groupForm.trigger('reset');
				groupForm.find('.btn.active').removeClass('active');
				Object.keys(group.attributes).forEach(function (attribute) {
					groupForm.find("input[name='" + attribute + "']").trigger('click');
				});
			}
		});
	});

$('#group_form').on('submit', function (event) {
	event.preventDefault();

	var groupId = $('#group_tree').jstree('get_selected').attr('id');

	if (!groupId) return;

	var attributes = Object.fromEntries(new FormData(document.getElementById('group_form')));

	$.ajax({
		url: '/auth-admin/realms/master/groups/' + groupId,
		type: 'PUT',
		contentType: 'application/json',
		data: JSON.stringify({
			id: groupId,
			attributes: Object.keys(attributes).reduce(function (accessControl, key) {
				return $.extend(accessControl, { [key]: [attributes[key]] });
			}, {})
		})
	});
});

$('#group_btn_cancel').on('click', function () {
	var groupId = $('#group_tree').jstree('get_selected').attr('id');
	var groupForm = $('#group_form');

	if (!groupId) {
		groupForm.trigger('reset');
		groupForm.find('.btn.active').removeClass('active');

		return;
	}

	$.ajax({
		url: '/auth-admin/realms/master/groups/' + groupId,
		type: 'GET',
		success: function (group) {
			groupForm.trigger('reset');
			groupForm.find('.btn.active').removeClass('active');
			Object.keys(group.attributes).forEach(function (attribute) {
				groupForm.find("input[name='" + attribute + "']").trigger('click');
			});
		}
	});
});

+(function ($) {
	var convertJsTreeData = function (group) {
		if (group.subGroups.length > 0) {
			return {
				data: group.name,
				attr: {
					rel: 'folder',
					type: 'folder',
					id: group.id
				},
				state: 'open',
				metadata: { id: group.id },
				children: group.subGroups.map(function (subGroup) {
					return convertJsTreeData(subGroup);
				})
			};
		}

		return {
			data: group.name,
			attr: {
				rel: 'default',
				type: 'default',
				id: group.id
			},
			metadata: { id: group.id }
		};
	};

	$(document).on('init.group_tree', function (event) {
		$(event.target).jstree({
			plugins: ['themes', 'json_data', 'ui', 'types'],
			themes: { theme: ['lightblue4'] },
			json_data: {
				ajax: {
					url: '/auth-admin/realms/master/groups',
					data: function (groups) {
						return groups;
					},
					success: function (data) {
						return [
							{
								data: { title: 'Groups' },
								attr: {
									rel: 'drive',
									type: 'drive'
								},
								state: 'open',
								children: data.map(function (tempGroup) {
									return convertJsTreeData(tempGroup);
								})
							}
						];
					}
				}
			},
			types: {
				types: {
					default: {
						valid_children: 'none',
						icon: {
							image: '../reference/jquery-plugins/jstree-v.pre1.0/themes/attibutes.png'
						}
					},
					folder: {
						valid_children: ['default', 'folder'],
						icon: {
							image: '../reference/jquery-plugins/jstree-v.pre1.0/themes/toolbar_open.png'
						}
					},
					drive: {
						valid_children: ['default', 'folder'],
						icon: {
							image: '../reference/jquery-plugins/jstree-v.pre1.0/themes/home.png'
						},
						start_drag: false,
						move_node: false,
						delete_node: false,
						remove: false
					}
				}
			}
		});
	});
})(jQuery);

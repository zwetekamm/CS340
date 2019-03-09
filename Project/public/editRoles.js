function updateRole(id){
	$.ajax({
		url: '/roles/' + id,
		type: 'PUT',
		data: $('#update-role').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};

function deleteRole(id){
	$.ajax({
		url: '/roles/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

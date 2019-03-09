function updateResort(id){
	$.ajax({
		url: '/resorts/' + id,
		type: 'PUT',
		data: $('#update-resort').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};

function deleteResort(id){
	$.ajax({
		url: '/resorts/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};


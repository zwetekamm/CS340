function updateEmployee(id){
	$.ajax({
		url: '/employees/' + id,
		type: 'PUT',
		data: $('#update-employee').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};

function deleteEmployee(id){
	$.ajax({
		url: '/employees/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

function selectLift(id){
	$("#lift-selector").val(id);
}

function selectResort(id){
	$("#resort-selector").val(id);
}
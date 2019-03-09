function updateSchedule(id){
	$.ajax({
		url: '/schedule/' + id,
		type: 'PUT',
		data: $('#update-schedule').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};

function deleteSchedule(id){
	$.ajax({
		url: '/schedule/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

function selectEmployee(id) {
	$("#employee-selector").val(id);
}

function selectRole(id) {
	$("#role-selector").val(id);
}

function selectLift(id) {
	$("#lift-selector").val(id);
}


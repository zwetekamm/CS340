function updateLift(id){
	$ajax({
		url: '/lifts/' + id,
		type: 'PUT',
		data: $('#update-lift').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};

function deleteLift(id){
	$.ajax({
		url: '/lifts/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

function selectCapacity(id){
	$("#capacity-selector").val(id);
}

function selectHighSpeed(id){
	$("#highspeed-selector").val(id);
}

function selectResort(id){
	$("#resort-selector").val(id);
}
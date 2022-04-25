$("#bettHelligkeit").on("change", (e) => {
	helligkeit = e.currentTarget.value
	$.ajax({
		url: "/bettlicht",
		type: "POST",
		data: {helligkeit: helligkeit},
		success: function(res) {
			console.log(res)
		}
	})
})

$("#bettSwitch").on("change", (e) => {
	status = e.currentTarget.checked
	if(status == "true"){
		status = 1
	}else{
		status = 0
	}
	$.ajax({
		url: "/bettlicht",
		type: "POST",
		data: {switch: status},
		success: function(res){
			console.log(res)
		}
	})
})
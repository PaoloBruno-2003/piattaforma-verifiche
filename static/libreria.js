function sendRequest(url,method,parameters,callback){
	$.ajax({
		url: url,
		type: method,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "json",
        headers: {token: "Bearer " + localStorage.getItem("token")},
		data: parameters,
		timeout : 6000000,
		success: callback,
		error : function(jqXHR, test_status, str_error){
			//console.log("No connection to " + link);
			//console.log("Test_status: " + test_status);
			alert("Error: " + str_error);
		}
	});
}

function sendRequestNoCallback(url,method,parameters){
	let mycontentType;
	if(method.toUpperCase()=="GET")
		mycontentType="application/x-www-form-urlencoded; charset=UTF-8";
	else{
		mycontentType="application/json; charset=UTF-8";
		parameters=JSON.stringify(parameters);
	}
	return $.ajax({
		url: url,
		contentType: mycontentType,
		type: method,
		dataType: "text",
		data: parameters,
		headers: {token:"Bearer " + localStorage.getItem("token")},
		timeout: 5000
	});
}

function inviaRichiesta(url, method, parameters={}) {
	let contentType;
	if(method.toLowerCase() == "get"){
		contentType= "application/x-www-form-urlencoded; charset=UTF-8"
	}
	else{
		contentType= "application/json; charset=utf-8"
		parameters = JSON.stringify(parameters);
	}
		
    return $.ajax({
        url: url, //default: currentPage
        type: method,
        data: parameters,
        contentType: contentType,
        dataType: "json",
        timeout: 5000,
    });
}

function error(jqXHR) {
    if (jqXHR.status == 0)
        console.log("server timeout");
    else if (jqXHR.status == 200)
		console.log("Formato dei dati non corretto : " + jqXHR.responseText);
    else
		console.log("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}
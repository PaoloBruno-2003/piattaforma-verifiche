"use strict";




$(() => {
    let controlToken = sendRequestNoCallback("/api/ctrlToken", "GET", {});
    controlToken.fail(function (jqXHR) {
        $(".msg").html("Error del Token: " + jqXHR.status + " - " + jqXHR.responseText);
    });
    controlToken.done(function (serverData){
        serverData = JSON.parse(serverData);
        if(serverData.err_exp)
        {
            $("#btnLogin").on("click", function () {
                let loginReq = sendRequestNoCallback("/api/login", "POST", { username: $("input[name=username]").val(), pwd: $("input[name=password]").val() });
                loginReq.fail(function (jqXHR) {
                    $(".msg").html("Error login: " + jqXHR.status + " - " + jqXHR.responseText);
                });
                loginReq.done(function (serverData) {
                    serverData = JSON.parse(serverData);
                    console.log(serverData);
                    sessionStorage.setItem("name", $("input[name=username]").val());
                    localStorage.setItem("token", serverData.token);
                    window.location.href = "index.html";
                });
            });
        }
        else
            window.location.href = "index.html";
            
    });
    
    
});
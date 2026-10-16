"use strict";


$(() => {
    sessionStorage.setItem("test", -1);
    let homePage = sendRequestNoCallback("/api/homepage", "GET", {});
    homePage.done(function (serverData) {
        $("#navUser").html("Benvenuto <b>" + sessionStorage.getItem("name") + "</b>");
        console.log(serverData);
    });
    homePage.fail(function (jqXHR) {
        error(jqXHR);
        window.location.href = "login.html";
    });

    $("#btnLogout").on("click", function () {
        localStorage.setItem("token", "");
        window.location.href = "login.html";
    })

    $("#btnAssenze").on("click", function () {
        window.location.href = "assenze.html";
    })

    $("#showTest").on("click", function () {
        sessionStorage.setItem("type","test");
        let testToDo = sendRequestNoCallback("/api/testToDo", "GET", {});
        testToDo.done(function (serverData) {
            $("#ModalText").html("Verifiche da eseguire");
            let ul = $("#testList");
            ul.html("");
            console.log("SERVER LENGTH");
            console.log(JSON.parse(serverData.length));
            console.log(JSON.parse(serverData));
            if (JSON.parse(serverData.length) == 2)
                ul.html("<h4>Complimenti! non hai test da eseguire</h4>");
            else {
                JSON.parse(serverData).forEach(testToDo => {
                    console.log(testToDo);
                    let li = $("<li class='m-3'></li>")
                    let a = $("<a style='display: inline-block' id='" + testToDo.test + "'>" + testToDo.materia + ": N°" + testToDo.test + "</a>");
                    let btn = $("<button type='button' class='btn btn-danger mx-2 eseguiTest' id='" + testToDo.test + "'>Esegui Test</i> </button>");
                    li.append(a);
                    li.append(btn);
                    ul.append(li);

                });
            }
            $("#ModalVerifiche").modal("show");

            $(".eseguiTest").on("click", function () {
                sessionStorage.setItem("test", this.id);
                console.log(sessionStorage.getItem("test"));
                window.location.href = "test.html"
            });
        });
        testToDo.fail(function (jqXHR) {
            error(jqXHR);
            window.location.href = "login.html";
        });

    })

    $("#btnRegistro").on("click", function(){
        window.location.href = "registro.html";
    });

    $("#showCorrection").on("click", function () {
        sessionStorage.setItem("type","correction");
        let testDone = sendRequestNoCallback("/api/testDone", "GET", {});
        testDone.done(function (serverData) {
            $("#ModalText").html("Seleziona la correzione: ");
            let ul = $("#testList");
            ul.html("");
            console.log("SERVER LENGTH");
            console.log(JSON.parse(serverData.length));
            console.log(JSON.parse(serverData));
            if (JSON.parse(serverData.length) == 2)
                ul.html("<h4>Per visualizzare le correzioni esegui dei test!</h4>");
            else {
                JSON.parse(serverData).forEach(testDone => {
                    console.log(testDone);
                    let li = $("<li class='m-3'></li>")
                    let a = $("<a style='display: inline-block' id='" + testDone.test + "'>" + testDone.materia + ": N°" + testDone.test + "</a>");
                    let btn = $("<button type='button' class='btn btn-danger mx-2 eseguiTest' id='" + testDone.test + "'>Vedi correzione</i> </button>");
                    li.append(a);
                    li.append(btn);
                    ul.append(li);

                });
            }
            $("#ModalVerifiche").modal("show");

            $(".eseguiTest").on("click", function () {
                sessionStorage.setItem("test", this.id);
                console.log(sessionStorage.getItem("test"));
                window.location.href = "correction.html"
            });
        });
        testDone.fail(function (jqXHR) {
            error(jqXHR);
            window.location.href = "login.html";
        });

    })

});
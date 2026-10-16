"use strict";

let i = 0;
let j = 0;
let questions;
let divDomanda;
let labelAnswer

$(() => {

    if (sessionStorage.getItem("test") != null) {
        if (sessionStorage.getItem("test") != -1) {
            let questionsCall = sendRequestNoCallback("/api/elencoDomande", "GET", {});
            questionsCall.done(function (serverData) {
                // visualizzazione delle domande sulla pagina web
                questions = JSON.parse(serverData)[sessionStorage.getItem("test")];
                sessionStorage.setItem("test", null);
                console.log(questions);
                let start = $("#elencoDomande");
                $("#saveLog").hide();
                (questions.domande).forEach(question => {
                    j = 0;

                    divDomanda = $("<div style='border: 2px solid black; border-radius:15px' class='form-check m-3 p-2'></div>");

                    let TitoloDomanda = $("<h1 id='" + i + "'> " + parseInt(i + 1) + ") " + question.domanda + "</h1>");
                    divDomanda.append(TitoloDomanda);
                    let divRisposte = $("<div class='form-check' style='display: block'></div>");
                    divDomanda.append(divRisposte);
                    question.risposte.forEach(answer => {
                        if (question.correct == j)
                            labelAnswer = $("<label class='form-check-label p-2 m-1' style='border: 1px solid #1ce236; border-radius: 10px; background-color: #1ca52e; color: white;' for='" + i + "'>" + parseInt(j + 1) + ") " + answer + "</label>");
                        else
                            labelAnswer = $("<label class='form-check-label p-2 m-1' for='" + i + "'>" + parseInt(j + 1) + ") " + answer + "</label>");
                        j++;
                        divRisposte.append(labelAnswer);
                        divRisposte.append($("<br>"));
                    });
                    start.append(divDomanda);
                    i++;
                });

            });
            questionsCall.fail(function (jqXHR) {
                error(jqXHR);
                window.location.href = "login.html";
            });
        }
        else
            location.href = "index.html";
    }
    else
        location.href = "index.html";

    $("#btnMenu").on("click", function () {
        location.href = "index.html";
    });
});



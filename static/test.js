"use strict";

let i = 0;
let j = 0;
let questions;
let finalVote = 0;
let nRightAnswer = 0, nWrongAnswer = 0;

$(() => {

    
    if (sessionStorage.getItem("test") != null) {
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
                let divDomanda = $("<div style='border: 2px solid black; border-radius:15px' class='form-check m-3 p-2'></div>");
                let TitoloDomanda = $("<h1 id='" + i + "'> " + parseInt(i + 1) + ") " + question.domanda + "</h1>");
                divDomanda.append(TitoloDomanda);
                let divRisposte = $("<div class='form-check' style='display: block'></div>");
                divDomanda.append(divRisposte);
                question.risposte.forEach(answer => {
                    let answerInput = $("<input class='form-check-input' type='radio' value='" + j + "' id='" + j + "-" + i + "' name='" + i + "'>");
                    let labelAnswer = $("<label class='form-check-label' for='" + i + "'>" + parseInt(j + 1) + ") " + answer + "</label>");
                    j++;
                    divRisposte.append(answerInput);
                    divRisposte.append(labelAnswer);
                    divRisposte.append($("<br>"));
                });
                start.append(divDomanda);
                i++;
            });



            // Set the date we're counting down to
            let countDownDate = new Date().getTime() + (60 * 1000 * 30);

            // Update the count down every 1 second
            let x = setInterval(function () {

                // Get today's date and time
                let now = new Date().getTime();

                // Find the distance between now and the count down date
                let distance = countDownDate - now;


                // Time calculations for days, hours, minutes and seconds
                let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the element with id="demo"
                document.getElementById("demo").innerHTML = minutes + ":" + seconds;

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("demo").innerHTML = "EXPIRED";
                    calcolaVoto();
                }
            }, 1000);

            $("#btnInvia").on("click", function () {
                calcolaVoto();
            });

            /*
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                <label class="form-check-label" for="flexRadioDefault1">
                    Default radio
                </label>
            </div>*/

        });
        questionsCall.fail(function (jqXHR) {
            error(jqXHR);
            window.location.href = "login.html";
        });
    }
    else {
        location.href = "index.html";
    }   
});



function roundedVote(vote) {
    let half;
    if (vote != 10) {
        half = vote.toString().substring(2, 4);
        half = "0." + half;
        if (vote > 0) {
            half = vote.toString().substring(2, 4);
            vote = vote.toString().substring(0, 1);

        }
        else {
            half = vote.toString().substring(3, 5);
            vote = vote.toString().substring(0, 2);
        }
        half = "0." + half;
        console.log(half);
        console.log(vote);
        if (vote < 2)
            vote = 2
        else if (half > 0.25 && half < 0.75)
            vote = parseInt(vote) + 0.5;
        else if (half <= 0.99 && half >= 0.75)
            vote = parseInt(vote) + 1;
        else if (half > 0 && half <= 0.25)
            vote = vote;
        else
            console.log("unexpected case: Error 1205");
    }

    console.log(vote);
    return vote;
}

function calcolaVoto() {
    i = 0;
    finalVote = 0;
    nRightAnswer = 0;
    nWrongAnswer = 0;

    (questions.domande).forEach(question => {
        //console.log($("input[name='"+ i +"']:checked").val());
        //console.log(question.correct + " GIUSTA!");
        if ($("input[name='" + i + "']:checked").val() == question.correct) {
            finalVote += 10 / (questions.domande).length;
            //console.log("CORRETTA");
            nRightAnswer++;
        }
        else if ($("input[name='" + i + "']:checked").val() == undefined) {
            //console.log("NON HA RISPOSTO");
        }
        else {
            nWrongAnswer++;
            finalVote -= 2.5 / (questions.domande).length;
            //console.log("SBAGLIATA");
        }

        i++;
    });
    let voteRounder = roundedVote(finalVote);
    console.log(voteRounder);
    $("#ModalText").html("congratulazioni <b>" + sessionStorage.getItem("name") + "</b>, hai preso un bel <b>" + voteRounder + "</b> (sarebbe stato " + finalVote + " ma ho approssimato un po')!!!");
    $("#ModalBody").html("Partendo da <b>0</b>, hai ottenuto ben <b>" + 10 / (questions.domande).length + "</b> punti per ogni risposta giusta <b>(" + nRightAnswer + ")</b> e hai perso nientepopodimenoche <b>" + 2.5 / (questions.domande).length + "</b> punti per ogni risposta sbagliata <b>(" + nWrongAnswer + ")</b>.")
    $("#Modal").modal("show");
    console.log(finalVote);
    $("#closeModal").on("click", function () {
        let sendVote = sendRequestNoCallback("/api/inserisciVoto", "GET", { voto: voteRounder, idVerifica: questions.test, materia: questions.materia });
        sendVote.done(function () {
            location.href = "index.html";
            console.log("Successful");
        });
        sendVote.fail(function (jqXHR) {
            error(jqXHR);
            window.location.href = "login.html";
        });

    });

}
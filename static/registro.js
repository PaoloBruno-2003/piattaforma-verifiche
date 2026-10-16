"use strict";

let month = new Array(7);
month[0] = "Gennaio";
month[1] = "Febbraio";
month[2] = "Marzo";
month[3] = "Aprile";
month[4] = "Maggio";
month[5] = "Giugno";
month[6] = "Luglio";
month[7] = "Agosto";
month[8] = "Settembre";
month[9] = "Ottobre";
month[10] = "Novembre";
month[11] = "Dicembre";

let subjects = new Array();
let DataArray = new Array();
let Avg = new Array();
let contAvg = new Array();
let mat = [];
let i = 0;
let j = 0;

let arrayMedie = [];
let arrayCont = [];
let stringClass;



let Data;

$(() => {
    let getGrades = sendRequestNoCallback("/api/getGrades", "GET", {});
    getGrades.done(function (serverData) {
        serverData = JSON.parse(serverData);
        console.log(serverData);
        i = 0;
        serverData.forEach(vote => {
            Avg[vote.materia] = 0;
            contAvg[vote.materia] = 0;
            subjects[i] = vote.materia;
            DataArray[i] = vote.data;
            //let trHead = $("#trHead");
            //trHead.append($("<th class='text-center'>" + Data.getUTCDate() + " - " + month[Data.getMonth()] + "</th>"));
            i++;
        });

        serverData.forEach(vote => {
            Avg[vote.materia] += parseFloat(vote.voto);
            contAvg[vote.materia] ++;
        });

        console.log(Avg);
        console.log(contAvg);

        subjects = subjects.filter((item, index) => subjects.indexOf(item) === index);
        DataArray = DataArray.filter((item, index) => DataArray.indexOf(item) === index);
        console.log(subjects);
        console.log(DataArray);

        i = 0;
        j = 0;

        for (i = 0; i < subjects.length; i++) {
            for (j = 0; j < DataArray.length; j++) {
                mat[i] = [];
            }
        }

        serverData.forEach(vote => {
            for (i = 0; i < subjects.length; i++) {
                for (j = 0; j < DataArray.length; j++) {
                    if ((vote.data).toString() == (DataArray[j]).toString() && vote.materia == subjects[i]) {
                        if(mat[i][j] != null)
                        mat[i][j] += " - " + vote.voto;
                        else
                            mat[i][j] = vote.voto;
                    }
                }
            }
        });

        DataArray.forEach(Data => {
            Data = new Date(Data);
            let trHead = $("#trHead");
            trHead.append($("<th class='text-center'>" + Data.getUTCDate() + " - " + month[Data.getMonth()] + "</th>"));
        });

        let td, tr;

        for (i = 0; i < subjects.length; i++) {
            tr = $("<tr></tr>");
            for (j = -2; j < DataArray.length; j++) {
                if (j != -2 && j!= -1) {
                    if (mat[i][j] != null) {
                        if (parseInt(mat[i][j]) >= 6)
                            stringClass = "sufficiente";
                        else
                            stringClass = "insufficiente";

                        td = $("<td class='text-center " + stringClass + "'>" + mat[i][j] + "</td>");
                    }
                    else
                        td = $("<td class='text-center'></td>");
                }
                else if(j == -2)
                    td = $("<td class='text-center'>" + subjects[i] + "</td>");
                else
                td = $("<td class='text-center GradesAvg'>" + Avg[subjects[i]] / contAvg[subjects[i]] + "</td>");

                tr.append(td);

            }
            $("#tBody").append(tr);
        }
    });

    getGrades.fail(function (jqXHR) {
        error(jqXHR);
        window.location.href = "login.html";
    });

    $("#btnLogout").on("click", function () {
        localStorage.setItem("token", "");
        window.location.href = "login.html";
    })

    $("#btnHome").on("click", function () {
        window.location.href = "index.html";
    })
});
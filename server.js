"use strict"
const mongoFunctions = require("./mongoFunctions");
const tokenAdministration = require("./tokenAdministration");
const fs = require('fs');
const HTTPS = require('https');
const nodemailer = require("nodemailer");

const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { token, createToken, payload } = require("./tokenAdministration");
//const bcrypt = require("bcrypt");

// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate };

const TIMEOUT = 1000;
let port = 8888;

let i = 0;

var httpsServer = HTTPS.createServer(credentials, app);
httpsServer.listen(port, '127.0.0.1', function () {
    console.log("Server running on port %s...", port);
});

// middleware
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", function (req, res, next) {
    console.log(">_ " + req.method + ": " + req.originalUrl);
    if (Object.keys(req.query).length != 0)
        console.log("Parametri GET: " + JSON.stringify(req.query));
    if (Object.keys(req.body).length != 0)
        console.log("Parametri BODY: " + JSON.stringify(req.body));
    next();
});

app.use("/", express.static('./static'));

app.get("/api/ctrlToken", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        res.send(payload);
    });
});

app.get("/api/testToDo", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {   // Token OK
            tokenAdministration.createToken(payload);
            mongoFunctions.find("test", "voti", { user: payload.user }, (err, data) => {
                if (err.codErr == -1) {
                    i = 0;
                    let testDone = [];
                    data.forEach(voto => {
                        testDone[i] = parseInt(voto.idVerifica);
                        i++;
                    });
                    console.log(testDone);
                    mongoFunctions.find("test", "verifiche", { test: { $nin: testDone } }, (err, data) => {
                        if (err.codErr == -1)
                            res.send(data);
                        else {
                            error(req, res, { code: err.codErr, message: err.message });
                        }
                    });
                }
                else {
                    error(req, res, { code: err.codErr, message: err.message });
                }
            })

        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});


app.get("/api/testDone", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {   // Token OK
            tokenAdministration.createToken(payload);
            mongoFunctions.find("test", "voti", { user: payload.user }, (err, data) => {
                if (err.codErr == -1) {
                    i = 0;
                    let testDone = [];
                    data.forEach(voto => {
                        testDone[i] = parseInt(voto.idVerifica);
                        i++;
                    });
                    console.log(testDone);
                    mongoFunctions.find("test", "verifiche", { test: { $in: testDone } }, (err, data) => {
                        if (err.codErr == -1)
                            res.send(data);
                        else {
                            error(req, res, { code: err.codErr, message: err.message });
                        }
                    });
                }
                else {
                    error(req, res, { code: err.codErr, message: err.message });
                }
            })

        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.get("/api/getGrades", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {   // Token OK
            tokenAdministration.createToken(payload);
            mongoFunctions.find("test", "voti", { user: payload.user }, (err, data) => {
                if (err.codErr == -1) {
                    res.send(data);
                }
                else {
                    error(req, res, { code: err.codErr, message: err.message });
                }
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.get("/api/elencoDomande", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {   // Token OK
            tokenAdministration.createToken(payload);
            console.log(payload);
            mongoFunctions.find("test", "verifiche", {}, (err, data) => {
                if (err.codErr == -1) {
                    //console.log("ok");
                    //console.log(data);
                    res.send(data);
                }
                else {
                    error(req, res, { code: err.codErr, message: err.message });
                }
            })

        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.get("/api/inserisciVoto", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        console.log(payload.mail);
        if (!payload.err_exp) {   // Token OK
            tokenAdministration.createToken(payload);
            console.log("HEYYYY");
            console.log(payload.mail);
            let pwd = process.env.MAIL_PASSWORD;
            let transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: pwd
                }
            });
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
            let bodyHtml = "<html><body><br /><br /><h1>Verifica di: " + payload.user + "</h1>" +
                "<h3 style='font-weight: normal; font-size: 18pt; color:red'><table><tr><td width='250px'>Materia</td><td width='400px'>" + (req.query).materia + "</td></tr>" +
                "<tr><td width='250px'>Voto</td><td width='400px'>" + (req.query).voto + "</td></tr>" +
                "</table></h3>" +
                "<br><br><p style='font-size:8pt'><i>questa è una mail automatica, ci si prega di non rispondere, grazie dal team di [?]</i></p></body></html>";
            const message = {
                from: process.env.MAIL_USER,
                to: (payload.mail).toString(),
                subject: "Voto Verifica (" + (req.query).materia + ")",
                html: bodyHtml
            };
            transport.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err);
                    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
                    res.end("Errore di invio mail");
                }
                else {
                    console.log(info);
                    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
                    res.end(JSON.stringify(info));
                }
            });

            const oggi = new Date();
            const dataOggi = oggi.toISOString().slice(0, 10);
            console.log(dataOggi);

            mongoFunctions.insertOne("test", "voti", { user: payload.user, idVerifica: (req.query).idVerifica, voto: (req.query).voto, materia: (req.query).materia, data: dataOggi }, (err, data) => {
                if (err.codErr == -1) {
                    //console.log("ok");
                    //console.log(data);
                    res.send(data);
                }
                else {
                    error(req, res, { code: err.codErr, message: err.message });
                }
            })

        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.get("/api/homepage", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        console.log(payload);
        if (!payload.err_exp) {   // Token OK
            res.send("ok");
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.post("/api/logout", function (req, res) {
    tokenAdministration.createToken("");
    res.send("corrotto");
});

app.post("/api/login", function (req, res) {
    let query = { user: req.body.username };
    console.log(query);
    mongoFunctions.findLogin(req, "test", "users", query, function (err, data) {
        if (err.codErr == -1) {
            console.log("ok");
            console.log(data);
            tokenAdministration.createToken(data);
            res.send({ msg: "Login OK", token: tokenAdministration.token });
        }
        else {
            error(req, res, { code: err.codErr, message: err.message });
        }
    });
});

/* ************************************************************* */
function error(req, res, err) {
    res.status(err.code).send(err.message);
}

// default route finale
app.use('/', function (req, res, next) {
    res.status(404)
    fs.readFile("./static/error.html", function (err, content) {
        if (err)
            content = "<h1>Risorsa non trovata</h1>" +
                "<h2><a href='/'>Back to Home</a></h2>"
        let pageNotFound = content.toString();
        res.send(pageNotFound);
    });
});



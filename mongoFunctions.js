"use strict";

const mongo=require("mongodb");
const bcrypt=require("bcrypt");
const mongoClient=mongo.MongoClient;
const CONNECTION_STRING="mongodb://127.0.0.1:27017";
const CONNECION_OPTIONS={ useNewUrlParser:true };

let mongoFunctions = function () {}

function setConnection(nomeDb,col,callback){
    let errConn={codErr:-1,message:""};
    let mongoConnection=mongoClient.connect(CONNECTION_STRING);
    mongoConnection.catch((err)=>{
        console.log("Errore di connessione al server Mongo. "+err);
        errConn.codErr=503;
        errConn.message="Errore di connessione al server Mongo.";
        callback(errConn,null,null);
    });
    mongoConnection.then((client)=>{
        let db=client.db(nomeDb);
        callback(errConn,db.collection(col),client);
    });
}

mongoFunctions.prototype.findOne=function (nomeDb,collection,query,callback){
    setConnection(nomeDb,collection,function (errConn,coll,client) {
        if(errConn.codErr==-1){
            coll.findOne(query,function (errQ,data){
                client.close();
                let errQuery={codErr:-1,message:""};
                if(!errQ)
                    callback(errQuery,data);
                else{
                    errQuery.codErr=500;
                    errQuery.message="Errore durante l'esecuzione della query su mongo";
                    callback(errQuery,{});
                }
            });
        }else
            callback(errConn,{});
    });
}

mongoFunctions.prototype.find=function (nomeDb,collection,query,callback){
    setConnection(nomeDb,collection,function (errConn,coll,client) {
        if(errConn.codErr==-1){
            coll.find(query).toArray(function (errQ,data){
                client.close();
                if(!errQ)
                    callback({codErr:-1,message:""},data);
                else
                    callback({codErr:500,message:"Errore durante l'esecuzione della query"}, {});
            });
        }else
            callback(errConn,{});
    });
}

mongoFunctions.prototype.findLogin = function(req,nomedb,collection,query,callback){
    setConnection(nomedb,collection,function (errConn,coll,client) {
        console.log(errConn);
        if(errConn.codErr==-1){ // no error
            console.log("CONNECTED!!!!!!!");
            let loginUser=coll.findOne(query);

            loginUser.then(function (data){
                let errData;
                if(data==null)
                    errData={codErr:401,message:"Errore di login. Username inesistente"}
                else{
                    //if(bcrypt.compareSync(req["post"]["password"],data.pwd))
                    if(req.body.pwd == data.pwd)
                        errData={codErr:-1,message:""}     // login ok
                    else
                        errData={codErr:401,message:"Errore di login. Password errata"}
                }
                callback(errData,data);

            });
            loginUser.catch(function (err){
                callback({codErr:500,message:"Errore durante l'esecuzione della query"},{});

            });
            loginUser.finally(function (){
                client.close();
                console.log("client close");
            });
        }
        else
            callback(errConn,{});
    });
}

mongoFunctions.prototype.insertOne = function (nomeDb, collection, query, callback){
    setConnection(nomeDb, collection, function (errConn,collection,conn){
        if(errConn.codErr==-1){
            collection.insertOne(query, function(errQ,data) {
                let errQuery;
                if(!errQ){
                    errQuery={codErr:-1, message:""};
                }else
                    errQuery={codErr:500, message:"Errore durante l'esecuzione della query"};
                conn.close();
                callback(errQuery);
            });
        }
        else
            callback(errConn);
    });
}

module.exports = new mongoFunctions();
var express = require('express');
var app = express();

//const dbConfig = require("./db.config.js");
var mysql = require('mysql');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pzi"
    });

dbConn.connect();    

app.get("/podaci", function(request, response){
    return response.send({message:"ok"});
})
app.get("/podaci/:id", function(request, response){
    var id = request.params.id+1;
    return response.send({message: id+" ok"});
})
app.post("/podaci", function(request, response){
    var podaci = request.body.podatak;
    return response.send({message: podaci+" ok"});
})
app.get("/korisnik", function(request, response){
    dbConn.query('SELECT * FROM korisnik', function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'READ svi korisnici.' });
    //return response.send({message:"READ korisnik (svi)"});
    })
})

app.get("/korisnik/:id", function(request, response){
    var id = request.params.id;
    if (!id) {
        return response.status(400).send({ error: true, message: 'Please provide id' });
        }
    dbConn.query('SELECT * FROM korisnik WHERE id=?', id, function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'READ korisnik id='+id });
    //return response.send({message: "READ korisnik "+id});
    })
})
app.post("/korisnik", function(request, response){
    var ime = request.body.ime;
    var prezime = request.body.prezime; 
    var tel = request.body.tel;     
    dbConn.query('INSERT INTO korisnik VALUES(NULL,?,?,?)',[ime, prezime, tel], function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'INSERT korisnik ime='+ime });
    })
    //return response.send({message: "CREATE "+ime+" "+prezime});
})
app.put("/korisnik/:id", function(request, response){
    var id = request.params.id;
    var tel = request.body.tel;
    dbConn.query('UPDATE korisnik SET tel=? WHERE id=?',[tel, id], function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'UPDATE korisnik id='+id+' tel='+tel });
    })
    //return response.send({message: "UPDATE "+id+" nova adresa: "+adresa});
})
app.delete("/korisnik/:id", function(request, response){
    var id = request.params.id;
    dbConn.query('DELETE FROM korisnik WHERE id=?',id, function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'DELETE korisnik id='+id });
    })

    //    return response.send({message: "DELETE "+id});
})


// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});

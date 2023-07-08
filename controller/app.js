var express = require('express');
var app = express();
var rabbit = require('../model/rabbit.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = require("../config.js");
// const verifyToken = require("../auth/verifyToken");
const cors = require("cors");
app.use(cors());


app.use(bodyParser.json());// parse application/json
app.use(urlencodedParser); // parse application/x-www-form-urlencoded

app.get('/flight', (req, res) => {

    const departureDate = req.query.departureDate
    const returnDate = req.query.returnDate
    const destination = req.query.destination
    //, returnDate
    rabbit.getFlight(departureDate, returnDate, destination, function (err, result) {
        if (!err) {
            console.log(result)
            res.status(200).send(result);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(400).send(msg);
        }
    })
})

app.get('/hotel', (req, res) => {

    const checkInDate = req.query.checkInDate
    const checkOutDate = req.query.checkOutDate
    const destination = req.query.destination

    rabbit.getHotel(checkInDate, checkOutDate, destination, function(err,result){
        if (!err) {
            console.log(result)
            res.status(200).send(result);
        } else {
            let msg = { "error_msg": "Internal server error" }
            res.status(400).send(msg);
        }
    })

})

module.exports = app




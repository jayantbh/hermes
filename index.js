/**
 * Created by jayantbhawal on 27/3/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/app/index.html");
});


app.use(express.static(__dirname+"/app"));

console.log("Init!");
app.listen(process.env.PORT || "80");

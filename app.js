//jshint esversion: 6
//import nese
const express = require('express');
const request = require('request');
const http = require('http');
const ejs = require('ejs');
const bodyParser = require('body-parser');

//Body Parser and Express
app = express();
app.use(bodyParser.urlencoded({ extended: true}));

//use external files e.g. css stylesheets
app.use(express.static('public'));

//set view engine
app.set('view engine', 'ejs');

//Status for Test API green or red
let mainStatus = '';
let detailedStatus = '';
let statColor = '';

//Calling the automated test
automatedCall();

//To retrieve index.html
app.get("/", function(req, res){

    // res.sendFile(__dirname+"/index.html");
    res.render('index', 
    {
       mainStatus: mainStatus,
       detailedStatus: detailedStatus,
       statColor: statColor
    });
 
});

// ---**--- MAIN POST ---**---
app.post("/", function(req, res){
    
    //Retrieve infromation give from the user through the <form>
    let baseUri = req.body.base_url;
    let username = req.body.name;
    let apiKey = req.body.apiKey;
    let iccid = req.body.sim;
    let task = req.body.sel;
    let devProperty = req.body.property;
    let newDevValue = req.body.propValue;

    //Establish the encoded authorization string
    let auth = username+":"+apiKey;
    let coded_auth = Buffer.from(auth).toString('base64');
    let method = req.body.method;

    //url construction
    let url = baseUri+"/"+iccid;

    console.log(coded_auth);

    //If ctdUsages is selected then add it to the url
    if(task == "ctdUsages"){
        url += "/"+task;
    }

    //Request npm module "Options" parameter definition
    let options = {
        url: url,
        method: method,
        headers : {
            "Accept": "application/json",
            "Authorization": "Basic " + coded_auth
        },
        body: {[devProperty]:newDevValue},
        json: true
    };

    //Retreive API response -> send results to the browser screen
    request(options, function(error, response){
        let data = response.body;
        if(response.statusCode == 200){

            res.render('response', {data: data});
        }else{
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    res.write(key + " -> " + data[key]+" ");
                }
            }
            res.write("Opps! There was an error " + response.statusCode);
            res.send();
        }

    });

});

//Automated test call
function automatedCall(){
    request({
        url: 'https://restapi3.jasper.com/rws/api/v1/devices/89462036051001561445',
        method: 'GET',
        headers : {
            "Accept": "application/json",
            "Authorization": "Basic a29uc21qYXpTRUFEOmNhNWY4YmZhLTE2YWEtNDM1ZS1hMWQ0LWZkZGU4YzgxMjc4MQ=="
        }
    }, 
    function(error, response){
        let data = JSON.parse(response.body);
        if(response.statusCode == 200 && data.status == 'ACTIVATED'){
            console.log(data.status);
            mainStatus = 'Green';
            statColor = '#81CD61';
            detailedStatus = '89462036051001561445 is in ACTIVATED state!';
        }else if (response.statusCode == 200) {
            mainStatus = 'Orange';
            statColor = '#FFC107';
            detailedStatus =  '89462036051001561445 is not Activated it is in ' + data.status + ' state!';
        }else{
            mainStatus = 'Red';
            statColor = '#E5493A';
            detailedStatus = 'Call did not go through, error: ' + response.statusCode;
        }
        console.log(mainStatus);
    });
    
    setTimeout(automatedCall, 100000);
}

        // for (var key in data) {
        //     if (data.hasOwnProperty(key)) {
        //         res.write(key + " -> " + data[key]+" ");
        //     }
        // }




//Initialize the server on port:3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);


var express=require('express');
var router=express.Router();
var AWS=require('aws-sdk');
// var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var crypto = require('crypto');
"use strict";

// generate a hash from string
key = "";

/* AWS CONF. BOL */
AWS.config.update({region:"us-east-1",accessKeyId:'',secretAccessKey:''});
var docClient=new AWS.DynamoDB.DocumentClient();

/*
----------------------------
    Registration section
----------------------------
*/
router.post('/registration', function(req, res, next){
/* Paramaters */
  var username_from_header = req.get('userName').toString();
  var email_from_header = req.get('email').toString();
  var RAWpassword_from_header = req.get('password').toString();
 
//Read for current user.

var params = {
    TableName: "Authentication",
    Key:{
        "userName": username_from_header,
    }
};

docClient.get(params, function(err, data) {
    if (err) {
        res.json({"Error":{"Critical":"Unable to read item. Error JSON:"+err}});
    } else {
        response = "GetItem succeeded: " + JSON.stringify(data, null, 2);
        if (response === "GetItem succeeded: {}"){
          addUser();
          }
          else {
            res.json({"Warning":{"Response":"Unable to add user, because the username, and or, email address is already associated with an existing account. Recover your account with Password Recovery, and have the password sent to your e-mail."}});
          };
    }
});
function addUser(){
   // create hahs
   var hash = crypto.createHmac('sha512', key);
   hash.update(RAWpassword_from_header);
   var hashed_pass = hash.digest('hex').toString();

/* INTO DATABASE */
var paramsWrite = {
    TableName: "Authentication",
    Item:{
        "password_SHA512": hashed_pass,
        "email": email_from_header,
        "userName": username_from_header,
        "dateCreated": Date().toString(),
        "userEnabled": 1
    }
};
docClient.put(paramsWrite, function(err, data) {
    if (err) {
        res.json({"Error":{"Critical":"Unable to add item. Error JSON:"+err}});
    } else {
        res.json({"OK":{"Response":"Thanks for signing up!"}});
    }
});
};
});

/*
----------------------------
      Login section
----------------------------
*/
router.post('/login', function(req, res, next){
  var username_from_header = req.get('userName').toString();
  var password_from_header = req.get('password').toString();

//Generate password from header submission
  var hash = crypto.createHmac('sha512', key);
  hash.update(password_from_header);
  var hashed_pass = hash.digest('hex').toString();
  var SearchHashedPass = hashed_pass;

    var params = {
        TableName: "Authentication",
        Key:{
            "userName": username_from_header
        }
    };
    function SessionID_Generator() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
      }
function writeSessiontoDB(SessionID){
      var WriteSessionID = {
          TableName:"AuthenticationSessionKeys",
          Item:{
              "SessionId": SessionID,
              "userName": username_from_header,
              "createDate": Date().toString()

          }
      };
      docClient.put(WriteSessionID, function(err, data) {
          if (err) {
              console.log("Unable to add item. Error JSON:",err, 2);
          } else {
          }
      });
};

  docClient.get(params, function(err, data) {
    if (err) {
        res.json({"Error":{"Critical":"Unable to read item. "+err}});
    } else {
      for(hashed_pass in data){
        foundpassword_from_DB = data.Item.password_SHA512;
        if (SearchHashedPass === foundpassword_from_DB){
          var SessionID = SessionID_Generator()
          writeSessiontoDB(SessionID)
          res.send({"OK":{"SessionID":SessionID}});
      } else {
        res.json({"Warning":{"Response":"Login failed, credentials are incorrect."}});
        // Commit IP to the BLOCK DB after 10 attempts
      }
        }
};

});
});
module.exports = router;

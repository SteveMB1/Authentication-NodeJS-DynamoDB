var express=require('express');
var router=express.Router();
var AWS=require('aws-sdk');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var crypto = require('crypto');
"use strict";

/* AWS CONF. BOL */
AWS.config.update({region:"us-east-1",accessKeyId:'',secretAccessKey:''});
var docClient=new AWS.DynamoDB.DocumentClient();
var table="AuthenticationSessionKeys";

// module.exports = {
checkSessionID: function checkSessionID(sessionID_from_header){

var sessionID_search = sessionID_from_header
  //Read for current SessionID.
  var params = {
    TableName: table,
    Key:{
        "SessionId": sessionID_from_header
    }
  };

  docClient.get(params, function(err, data) {
    if (err) {
        console.log({"Error":{"Critical":"Unable to process item. "+err}});
    } else {
      for(sessionID_search in data){
        var result_from_db = data.Item.SessionId;
        if (result_from_db === sessionID_from_header){
          console.log("SessionID checks out to be OK - Returning to next statement in submitting function");
          return;
        } else {res.json({"Warning":{"Response":"Login failed, credentials are incorrect."}}); break;}
        // Commit IP to the BLOCK DB after 10 attempts
      // }
        }
  };
});
  } //End of checkSessionID function

// }; //end of module

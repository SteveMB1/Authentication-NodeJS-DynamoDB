const express=require('express');
const router=express.Router();
const AWS=require('aws-sdk');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
"use strict";
/* AWS CONF. BOL */
AWS.config.update({region:"",accessKeyId:'',secretAccessKey:''});
const docClient=new AWS.DynamoDB.DocumentClient();
const table="AuthenticationSessionKeys";

/* exports.checkSessionID = */ function checkSessionID(sessionID_from_header){
var sessionID_search = sessionID_from_header.toString()
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
        if (data.Item.SessionId === sessionID_from_header){
          console.log("SessionID checks out to be OK - Returning to next statement in submitting function"); return;
          //define type error
        };
      };
});
} //End of checkSessionID function
// }; //end of module
// module.exports = checkSessionID;

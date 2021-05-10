////////////////////////////////////////////////////////////////////////
// databaseSetup.js -- backend functions for setting up the database
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const util = require('./utils');
const { Pool, Client } = require('pg');

//We need to create an environment variable with this string in our heroku environment
const pool = new Pool(
  {
  connectionString: "postgres://kuskxdbbzhvwkz:68cbfc9d44fbc241c4f3e26a56327d009f5f6e4b75d04a7c0874e9b2536c1ade@ec2-3-222-30-53.compute-1.amazonaws.com:5432/d8sc0ku4m33dnj", //process.env.DATABASE_URL,
  ssl: 
    {
    rejectUnauthorized: false
    }
  });


////////////////////////////////////////////////////////////////////////
// 
// This will handle all database queries indirectly                
//
////////////////////////////////////////////////////////////////////////
exports.queryDB = async (queryString, callbackFunction) => {
  
    var queryError = false; 

    var client = await pool.connect();      //Gain access to the database

    //console.time("db Start");

    try {
        result = await client.query(queryString).catch(e => 
            {
            util.logERROR("queryDB(): " + e.message, e.code);
            util.logINFO("queryDB(): Notified caller of error");
        
            callbackFunction(null, e);
            queryError = true;
            }); 
    
            if(!queryError) 
                {
                callbackFunction(result, false);
                }
        
        client.release();          //Remove connection to database

        //console.timeEnd("db Start");
        }
    catch (err) 
        {
        util.logERROR("queryDB(): An unknown error occured " + e.message, e.code);
        util.logINFO("queryDB(): Notified caller of error");

        callbackFunction(null, err);
        }
    }








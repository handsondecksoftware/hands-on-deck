////////////////////////////////////////////////////////////////////////
// databaseSetup.js -- backend functions for setting up the database
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const { Pool, Client } = require('pg');
const { exit } = require('process');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');
const pool = new Pool(
  {
  connectionString: "postgres://kuskxdbbzhvwkz:68cbfc9d44fbc241c4f3e26a56327d009f5f6e4b75d04a7c0874e9b2536c1ade@ec2-3-222-30-53.compute-1.amazonaws.com:5432/d8sc0ku4m33dnj", //process.env.DATABASE_URL,  //This is undefined. We  need to insert the actual URL -- I couldnt find it
  ssl: 
    {
    rejectUnauthorized: false
    }
  });

//exports.db = client;


////////////////////////////////////////////////////////////////////////
// 
// This will handle all database queries indirectly                
//
////////////////////////////////////////////////////////////////////////
exports.queryDB = async (queryString, callbackFunction) => {
  
  pool.connect().then(client => 
    {
    return client.query(queryString).then((err, res) => 
        {
        client.release()
        callbackFunction(err, res);
        })
      .catch(err => 
        {
        client.release();
        
        console.log('An Unknown Error Occured');

        callbackFunction(err, null);
        });
    });


  return 
}








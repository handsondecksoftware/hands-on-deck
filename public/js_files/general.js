////////////////////////////////////////////////////////////////////////
// general.js -- general frontend behaviour functions for use by any page
//                  
//
// Ryan Stolys, 04/08/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// 
// Will create an array from 1 to n where n is specifed in the input
//
//////////////////////////////////////////////////////////////////////// 
function newArrayFrom1toN(n)
  {
  var newArray = [];

  for(var i = 0; i <= n; i++)
    {
    newArray.push(i);
    }

  return newArray;
  }


////////////////////////////////////////////////////////////////////////
// 
// Will create and send a post request then return the data in JSON format
//
// dataInJSON --  must be in JSON format with all relevant information 
//                for function call
//
// postName -- will be the identifier that will specify which express 
//              app handler will recieved the function call
//
// callbackFunction -- will be a function which will handle the response 
//                      from the post request 
//
//////////////////////////////////////////////////////////////////////// 
function handlePostMethod(dataInJSON, postName, callbackFunction)
  {
  //Specify default values 
  var headerName = 'Content-Type';
  var headerValue = 'application/json';

  //Convert JSON to string
  var data;
  if(dataInJSON == null)
    {
    data = null;
    }
  else 
    {
    data = JSON.stringify(dataInJSON);
    }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", postName, true);
  xhr.setRequestHeader(headerName, headerValue);
  xhr.onreadystatechange = function()
    {
    if(xhr.readyState == XMLHttpRequest.DONE) 
      {
      callbackFunction(JSON.parse(xhr.responseText));
      }
    }
  xhr.send(data);

  return;
  }
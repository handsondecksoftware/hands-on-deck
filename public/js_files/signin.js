////////////////////////////////////////////////////////////////////////
// signin.js -- signin page to handle sign in response
//                  
//
// Ryan Stolys, 04/08/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// 
// Will collect inputd and send via post request. Only successful response is returned
//
//////////////////////////////////////////////////////////////////////// 
function signIn()
    {
    var data = {
        email: document.getElementById('username').value,
        password: document.getElementById('password').value,
        isMobile: false,
    };

    handleAPIcall(data, "/api/signin", response =>
        {
        if(response.success)
            {
            //Set the jwt to the header
            // var authHeader = new Headers();
            // authHeader.set('Authorization', response.access_token);
            let authHeader = new Headers({'Content-Type': 'application/json'});  
            authHeader.append('Authorization','Bearer ')
            //alert(response.access_token);
            console.log("Checking header here")
            console.log(authHeader)
            // window.location.href = "/home";     //Go to home page
            }
        });

    return false;
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
function handleAPIcall(dataInJSON, postName, callbackFunction)
    {
    //Specify default values 
    var headerName = 'Content-Type';
    var headerValue = 'application/json';

    //Convert JSON to string
    var data;
    if(dataInJSON == null)
        {
        dataInJSON = {isMobile: false};
        }
    else 
        {
        dataInJSON["isMobile"] = false;
        }
    
    data = JSON.stringify(dataInJSON);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", postName, true);
    xhr.setRequestHeader(headerName, headerValue);
    xhr.setRequestHeader('Authorization','Bearer ')
    xhr.onreadystatechange = function()
        {
        if(xhr.readyState == XMLHttpRequest.DONE) 
            {
            console.log("inside done function")
            var response;
            try {response = JSON.parse(xhr.responseText);}
            catch (error) 
                {
                console.error(error.message);
                response = {success: false};
                }
            console.log(response)
            //Return response to callback function
            callbackFunction(response);
            }
        }

    xhr.send(data);

    return;
    }
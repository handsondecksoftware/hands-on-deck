////////////////////////////////////////////////////////////////////////
// settings.js -- frontend behaviour for the settings.js page
//                  
//
// Ryan Stolys, 18/01/21
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////// 
// Global Variables
//////////////////////////////////////////////////////////////////////// 
var institutionSettings = {};
var personalSettings = {};


////////////////////////////////////////////////////////////////////////
// 
// initialize page
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    getRef("saveInstitutionSettings").onclick = function(){saveInstitutionSettings()};
    getRef("savePersonalSettings").onclick = function(){savePersonalSettings()};

    getRef("changePassword").onclick = function(){togglePasswordBox()};
    getRef("closePasswordPopup").onclick = function(){togglePasswordBox()};
    getRef("confirmChangePassword").onclick = function(){changePassword()};


    initSlider("Settings");
    initLogout();

    //Load settings
    loadSettings();
    }

////////////////////////////////////////////////////////////////////////
// 
// Will load the institution and personal settings
//
//////////////////////////////////////////////////////////////////////// 
function loadSettings()
    {
    /*
    setLoaderVisibility(true);  //Set twice since we are doing two post calls
    setLoaderVisibility(true);
    handleAPIcall(null, "/getInstituionInfo", response =>
        {
        var iInfo;

        if(response.success)
            {
            iInfo = response.iInfo;
            }
        else 
            {
            printUserErrorMessage(response.errorcode);
            
            //Set some default values to use
            iInfo = 
                {
                id: -1, 
                name: "Could Not Load", 
                location: "Could Not Load", 
                numVolunteers: "Unkown",
                totalHours: "Unkown",
                }
            }

        getRef("instiution-name").value = iInfo.name;
        getRef("instiution-location").value = iInfo.location;

        setLoaderVisibility(false);
        });

    
    //Set vol_ID to 0 to get personal volunteer info
    handleAPIcall({volID: 0}, "/getVolunteerInfo", response =>
        {
        var vInfo;

        if(response.success)
            {
            vInfo = response.volunteerInfo;
            }
        else 
            {
            printUserErrorMessage(response.errorcode);
            
            //Set some default values to use
            vInfo = 
                {
                id: -1, 
                name: "Could Not Load", 
                email: "Could Not Load", 
                leaderboards: false,
                }
            }

        getRef("personal-name").value = vInfo.name;
        getRef("personal-email").value = vInfo.email;
        getRef("settingLeaderboards").value = vInfo.leaderboards;

        setLoaderVisibility(false);
        });
    */

    //Temp until backend function is implemented
    getRef("instiution-name").value = "Simon Fraser University (HARD CODE)";
    getRef("instiution-location").value = "Burnaby (HARD CODE)";
    getRef("personal-name").value = "Ryan Stolys (HARD CODE)";
    getRef("personal-email").value = "Ryan Stolys (HARD CODE)";
    getRef("settingLeaderboards").value = false;
    }


////////////////////////////////////////////////////////////////////////
// 
// Saves instituiton settings
//
//////////////////////////////////////////////////////////////////////// 
function saveInstitutionSettings()
    {
    //Load current settings 
    var name = getRef("instiution-name").value;
    var location = getRef("instiution-location").value;

    var confirmString = "Are you sure you want to make the following changes? \n\n";
    confirmString += "Name: " + name + "\nLocation: " + location;

    if(name.length > 0 && location.length > 0)
        {
        if(confirm(confirmString))
            {
            /*
            setLoaderVisibility(true);
            var iInfo = gen_iInfo();
            iInfo.name = name; iInfo.location: location; 
            handleAPIcall({iInfo: iInfo}, "/editVolunteer", response =>
                {
                if(response.success)
                    {
                    alert("Password Successfully Updated!");
                    togglePasswordBox();
                    }
                else 
                    {
                    if(response.errorcode == PERMISSION_ERROR)
                        {
                        alert("Your old password did not match the password we have saved in our system");
                        }
                    else 
                        {
                        printUserErrorMessage(response.errorcode);
                        }
                    }

                setLoaderVisibility(false);
                });
            */
            setLoaderVisibility(true);
            alert("Changing Settings");
            setLoaderVisibility(false);
            }
        }
    else 
        {
        alert("Oops! \n\nLooks like you tried to set your institution name or location to nothing. You can't do that");
        }
    }


////////////////////////////////////////////////////////////////////////
// 
// Saves personal settings
//
//////////////////////////////////////////////////////////////////////// 
function savePersonalSettings()
    {
    //Load current settings 
    var name = getRef("personal-name").value;
    var leaderboards = Number(getRef("settingLeaderboards").value) ? true : false;
    var email = getRef("personal-email").value;

    var confirmString = "Are you sure you want to make the following changes? \n\n";
    confirmString += "Name: " + name + "\nEmail: " + email + "\nAllow Leaderboards: " + (leaderboards ? "Yes" : "No");

    if(name.length <= 0)
        {
        alert("Oops! \n\nLooks like you tried to set your name to nothing. You can't do that");
        }
    else if(isNotEmailValid(email))
        {
        alert("Oops! \n\nLooks like you provided an invalid email address");
        }
    else 
        {
        if(confirm(confirmString))
            {
            /*
            setLoaderVisibility(true);
            var vInfo = gen_vInfo();
            vInfo.name = name; vInfo.email: email; vInfo.leaderboards = leaderboards; 
            handleAPIcall({volunteerInfo: vInfo}, "/editVolunteer", response =>
                {
                if(response.success)
                    {
                    alert("Password Successfully Updated!");
                    togglePasswordBox();
                    }
                else 
                    {
                    if(response.errorcode == PERMISSION_ERROR)
                        {
                        alert("Your old password did not match the password we have saved in our system");
                        }
                    else 
                        {
                        printUserErrorMessage(response.errorcode);
                        }
                    }

                setLoaderVisibility(false);
                });
            */
            setLoaderVisibility(true);
            alert("Changing Settings");
            setLoaderVisibility(false);
            }
        }
    }


////////////////////////////////////////////////////////////////////////
// 
// Will change the user password
//
//////////////////////////////////////////////////////////////////////// 
function changePassword()
    {
    //Gather password info
    var oldPassword = getRef("password-old").value;
    var newPassword = getRef("password-new").value;
    var newPassword2 = getRef("password-new2").value;

    if(newPassword !== newPassword2)
        {
        alert("Your new passwords do not match.");
        }
    else 
        {
        /*
        setLoaderVisibility(true);
        handleAPIcall({oldPassword: oldPassword, newPassword: newPassword}, "/changePassword", response =>
            {
            if(response.success)
                {
                alert("Password Successfully Updated!");
                togglePasswordBox();
                }
            else 
                {
                if(response.errorcode == PERMISSION_ERROR)
                    {
                    alert("Your old password did not match the password we have saved in our system");
                    }
                else 
                    {
                    printUserErrorMessage(response.errorcode);
                    }
                }

            setLoaderVisibility(false);
            });
        */

        setLoaderVisibility(true);
        alert("Changing Password");
        setLoaderVisibility(false);

        togglePasswordBox();
        }
    
    }

////////////////////////////////////////////////////////////////////////
// 
// Toggle change password popup box
//
//////////////////////////////////////////////////////////////////////// 
function togglePasswordBox()
    {
    if(getRef("changePasswordPopup").style.display == "none")
        {
        //Clear current contents
        getRef("password-old").value = "";
        getRef("password-new").value = "";
        getRef("password-new2").value = "";

        getRef("changePasswordPopup").style.display = "block";
        }
    else 
        {
        getRef("changePasswordPopup").style.display = "none";
        }
    }


////////////////////////////////////////////////////////////////////////
// 
// Will determine if email address provided is valid
//
//////////////////////////////////////////////////////////////////////// 
function isNotEmailValid(email)
    {
    var isNotValid = false;

    if(!email.includes("@"))
        {
        isNotValid = true;
        }
    
    if(!email.includes(".com") && !email.includes(".ca"))
        {
        isNotValid = true;        //This will work for most emails but can fail if we have international clients (probably fine)
        }

    return isNotValid;
    }
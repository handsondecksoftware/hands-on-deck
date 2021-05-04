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
//None


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
    setLoaderVisibility(true);  //Set twice since we are doing two post calls
    setLoaderVisibility(true);
    handleAPIcall(null, "/api/getInstitutionInfo", response =>
        {
        if(response.success)
            {
            getRef("instiution-name").value = response.iInfo.name;
            getRef("instiution-location").value = response.iInfo.location;
            }
        else 
            {
            printUserErrorMessage(response.errorcode);
            
            getRef("instiution-name").value = "Could Not Load";
            getRef("instiution-location").value = "Could Not Load";
            }

        setLoaderVisibility(false);
        });

    
    //Set vol_ID to 0 to get personal volunteer info
    handleAPIcall({vol_ID: 0}, "/api/getVolunteerInfo", response =>
        {
        if(response.success)
            {
            getRef("personal-name").value = response.volunteerInfo[0].name;
            getRef("personal-email").value = response.volunteerInfo[0].email;
            getRef("personal-username").value = response.volunteerInfo[0].username;
            getRef("settingLeaderboards").value = response.volunteerInfo[0].leaderboards;
            changeSliderLabel('settingLeaderboards');
            }
        else 
            {
            printUserErrorMessage(response.errorcode);
            
            getRef("personal-name").value = "Could Not Load";
            getRef("personal-email").value = "Could Not Load";
            getRef("settingLeaderboards").value = false;
            }

        setLoaderVisibility(false);
        });    
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

    if(confirm(confirmString))
        {
        setLoaderVisibility(true);

        var iInfo = gen_iInfo();
        iInfo.name = name; iInfo.location = location; 

        handleAPIcall({iInfo: iInfo}, "/api/editInstitutionInfo", response =>
            {
            if(response.success)
                {
                alert("Institution Settings Successfully Updated");
                }
            else 
                {
                printUserErrorMessage(response.errorcode);
                }

            setLoaderVisibility(false);
            });
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
    var username = getRef("personal-username").value;

    var confirmString = "Are you sure you want to make the following changes? \n\n";
    confirmString += "Name: " + name + "\nEmail: " + email + "\nUsername: " + username + "\nAllow Leaderboards: " + (leaderboards ? "Yes" : "No");

    if(confirm(confirmString))
        {
        setLoaderVisibility(true);

        var vData = gen_vData();
        vData.name = name; vData.email = email; vData.username = username; vData.leaderboards = leaderboards; 

        handleAPIcall({volunteerData: vData}, "/api/editVolunteer", response =>
            {
            if(response.success)
                {
                alert("Personal Settings Successfully Updated");
                }
            else 
                {
                printUserErrorMessage(response.errorcode);
                }

            setLoaderVisibility(false);
            });
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
        setLoaderVisibility(true);

        handleAPIcall({oldPassword: oldPassword, newPassword: newPassword}, "/api/changePassword", response =>
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
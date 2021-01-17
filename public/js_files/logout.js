////////////////////////////////////////////////////////////////////////
// logout.js -- frontend behaviour when user tries to logout
//                  
//
// Ryan Stolys, 18/07/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function initLogout()
    {
    //Setup open and close of popup box
    getRef('logoutButton').onclick = function(){generateLogoutBox()};
    }


////////////////////////////////////////////////////////////////////////
// 
// Generate logout body
//
//////////////////////////////////////////////////////////////////////// 
function generateLogoutBox()
    {
    var logoutRef = getRef("logout");
    logoutRef.style.display = "block";

    //Add top level logout popup
    var topBox = document.createElement("DIV");
    topBox.classList = "popup-greyOut";
    topBox.style.display = "block";
    topBox.innerHTML = "<div id=\"logoutPopup\" class=\"logout-popup\"></div>";
    logoutRef.appendChild(topBox);

    //Add content 
    var contentDiv = document.createElement("DIV");
    contentDiv.classList = "logout-content subTitle";
    contentDiv.innerHTML = "Are you sure you want to logout?";
    getRef("logoutPopup").appendChild(contentDiv);

    //Add footer buttons
    var footerDiv = document.createElement("DIV");
    footerDiv.classList = "logout-buttons";
    footerDiv.innerHTML = "<div class=\"popup-buttons-cancel\"><button class=\"button\" id=\"cancelLogoutChoice\">Cancel</button></div>";
    footerDiv.innerHTML += "<div class=\"popup-buttons-add\"><button class=\"button\" id=\"confirmLogoutChoice\">Logout</button></div>";
    getRef("logoutPopup").appendChild(footerDiv);

    //Connect functions
    getRef('cancelLogoutChoice').onclick = function(){closeLogoutBox()};
    getRef('confirmLogoutChoice').onclick = function(){logoutUser()};
    }


/*
<!-- Pop up box for logging out -->
<div id="logoutPopup" class="popup-greyOut" style="display:none">
    <div class="logout-popup">
        <div class="logout-content subTitle">
            Are you sure you want to logout?
        </div>
        <div class="logout-buttons">
            <div class="popup-buttons-cancel"><button class="button" id="cancelLogoutChoice">Cancel</button></div>
            <div class="popup-buttons-add"><button class="button" id="yesLogoutChoice">Yes</button></div>
        </div>
    </div>
</div>
*/




////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function closeLogoutBox()
    {
    getRef("logout").style.display = "none";
    getRef("logout").innerHTML = "";
    }


////////////////////////////////////////////////////////////////////////
// 
// Will check inputs and add oppourtuntiy if valid, or provide errors if not
//
// currently does nothing, just closes  the oppourtunity box
//
////////////////////////////////////////////////////////////////////////
function logoutUser()
    {
    closeLogoutBox();

    //Do stuff here to logout user officially

    //Move to signin page
    window.location.href = '/logout';
    }
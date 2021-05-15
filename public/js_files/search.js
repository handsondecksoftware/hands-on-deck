////////////////////////////////////////////////////////////
// server.js -- starts the server to allow for local devlopment 
//              and editting
//
// Ryan Stolys, Jayden Cole 15/05/21
//    - Base design and testing
//
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
////////////////////////////////////////////////////////////////////////
var inputID; 
var tableID;
var tableColumn;
var ignoreLastNum

const START_SPAN = '<span class=\"highlight\">'
const END_SPAN = "</span>"

////////////////////////////////////////////////////////////
//
// Will initialize the search bar
//
////////////////////////////////////////////////////////////
function initSearch(inputID_in, tableID_in, ignoreLastNum_in)
    {
    inputID = inputID_in;
    tableID = tableID_in;
    ignoreLastNum = ignoreLastNum_in;

    getRef(inputID).oninput = function(e){search(e)};
    }


////////////////////////////////////////////////////////////
//
// Will search and highlight the desired text
//
////////////////////////////////////////////////////////////
function search(e)
    {
    var tableRef = getRef(tableID);
    var input = e.currentTarget.value;

    var foundText = false;

    for(var r = 1; r < tableRef.rows.length; r++) 
        {
        foundText = false;
        for(var c = 0; c < tableRef.rows[r].cells.length - ignoreLastNum; c++)
            {
            removeHighlight(tableRef, r, c);

            if(input == "")
                {
                tableRef.rows[r].style.display = "table-row";
                }
            else if(tableRef.rows[r].cells[c].innerHTML.toLowerCase().includes(input.toLowerCase()))
                {
                //Show row
                tableRef.rows[r].style.display = "table-row";
    
                addHighlight(tableRef, input, r, c);
                foundText = true;
                }
            else 
                {
                if(!foundText)
                    tableRef.rows[r].style.display = "none";
                }
            }
        }
    return true;
    }


////////////////////////////////////////////////////////////
//
// Will remove the previous highlight
//
////////////////////////////////////////////////////////////
function removeHighlight(tableRef, r, c)
    {
    //Removing span elements if they are already there
    var innerText = tableRef.rows[r].cells[c].innerHTML;
    var startIndex = innerText.indexOf(START_SPAN);
    var endIndex = innerText.indexOf(END_SPAN);

    if(startIndex >= 0)
        tableRef.rows[r].cells[c].innerHTML = innerText.substring(0, startIndex) 
                                            + innerText.substring(startIndex + START_SPAN.length, endIndex) 
                                            + innerText.substring(endIndex + END_SPAN.length);
    }


////////////////////////////////////////////////////////////
//
// Will add the current highlight
//
////////////////////////////////////////////////////////////
function addHighlight(tableRef, input, r, c)
    {
    var columnText = tableRef.rows[r].cells[c].innerHTML;
    var index = columnText.toLowerCase().indexOf(input.toLowerCase());

    tableRef.rows[r].cells[c].innerHTML = columnText.substring(0,index) + START_SPAN
                                        + columnText.substring(index, index + input.length) + END_SPAN  
                                        + columnText.substring(index + input.length);
    }
/* Detect which navbar element is active */
$(document).ready(Nav_DetectActive());
$(document).resize(Nav_DetectActive());
$(window).resize(Nav_DetectActive());

$(document).scroll(
    function Nav_stayOnTop() {
        // to prevent crazy loop, the size of the window must be taken into account.
        if (window.innerWidth >= 768) {
            var headerEle = document.getElementsByClassName("header");
            var headerHeight = headerEle[0].getBoundingClientRect().height;

            if (window.scrollY > headerHeight) {
                var navEle = document.getElementsByClassName("nav");
                var navHeight = navEle[0].getBoundingClientRect().height + 18;

                $("header").attr("style", "margin-top: " + navHeight + "px; visibility: hidden;");
                $("nav").addClass("navbar-fixed-top");
            }
            else {
                if ($("nav").hasClass("navbar-fixed-top")) {
                    $("header").attr("style", "");
                    $("nav").removeClass("navbar-fixed-top");
                }
            }
        }
    }
);

// fix issue on dropdown

// Set the active class and screen reader text.
function Nav_DetectActive() {
    var thisPath = window.location.pathname;

    // Find the controller and action from the url parts (assuming the pattern is: scheme host controller action)
    thisPath = thisPath.replace(/#/i, "");
    var thisPaths = thisPath.split("/");
    var controllerName = "home";
    var actionName = "index";

    if (thisPaths.length >= 3) {
        actionName = thisPaths[thisPaths.length-1];        
    }
   
    if (actionName == undefined) {
        actionName = "index";
    }
    else if (actionName.length == 0) {
        actionName = "index";
    }

    this.Nav_SetActive(this.BuildNavId(controllerName, actionName));
}

function Nav_SetActive(elementId) {
    elementId = elementId.toLowerCase();
    
    var splitName = elementId.split("_");
    var parentElementId = this.BuildNavId(splitName[1], "index");

    // Remove the current active
    $("#navbar li.active a:has(span)").remove(".sr-only");
    $("#navbar li.active").removeClass("active");

    // Need to strip out leading # jQuery needs it but standard JS does not.
    if (elementId.charAt(0) == "#") {
        elementId.replace(/#/i, "");
    }

    // Larger screens with horizontal menu
    if (document.getElementById(parentElementId) != null) {
        if (window.innerWidth >= 768) {
            // Select the parent item on larger screens (Horizontal menu).
            if ($("#" + parentElementId).hasClass("dropdown")) {
                elementId = parentElementId;
            }
        }
        else {
            // smaller screens with vertical menu
            // set the item as active and open all its parent.
            if ($("#" + parentElementId).hasClass("dropdown")) {
                $("#" + parentElementId).addClass("open");
            }
        }
    }
    
    // See if the target element exists
    if (document.getElementById(elementId) == null) {       
        elementId = this.BuildNavId(splitName[1], "index");

        if (document.getElementById(elementId) == null ) {
            // fallback value
            elementId = this.BuildNavId("home", "index");
        }
    }

    if (document.getElementById(elementId) != null) {
        $("#" + elementId).addClass("active");
        $("#" + elementId + " li.active a").add("<span class='sr-only'> (current)</span>");
    }
}

function BuildNavId(controllerName, actionName) {
    var result = "nav_" + controllerName + "_" + actionName;
    result = result.toLowerCase();
    return result;
}
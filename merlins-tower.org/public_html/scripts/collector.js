const sessionId = crypto.randomUUID(); // ID for specific user session

// Static Data

document.addEventListener("DOMContentLoaded", function (event) {
    let staticData = {};
    staticData["userAgent"] = navigator.userAgent;
    staticData["userLanguage"] = navigator.language;
    staticData["acceptsCookies"] = navigator.cookieEnabled;
    
    document.cookie = "js_enabled=true; path=/"; 
    staticData["allowsJS"] = true;
    staticData["allowImage"] = allowImage();
    staticData["allowCSS"] = allowCSS();

    staticData["screenDimensions"] = window.screen.height + " x " + window.screen.width
    staticData["windowDimensions"] = window.innerHeight + " x " + window.innerWidth;

    staticData["networkConnection"] = navigator.connection; // doesn't work with firefox, safari

    console.log(staticData);

    // Store to localStorage in case fetch fails
    localStorage.setItem("staticData", JSON.stringify(staticData));

    fetch("/json/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: "static",
            data: staticData,
            session: sessionId
        })
    }).catch(err => console.warn("Failed to send staticData:", err));
});

function allowImage() {
    return (document.getElementById("flag").offsetHeight != 0);
}

function allowCSS() {
    return (window.getComputedStyle(document.body, null).getPropertyValue("background-color") != "#FFF");
}

// Performance Data

window.addEventListener('load', function() {
    setTimeout(function () { // allow the page to load completely before collecting
        const performanceEntry = performance.getEntriesByType("navigation")[0];
        if (!performanceEntry) return;
        

        const performanceData = {
            type: "performance",
            timing: performanceEntry,  // whole timing object object
            loadStart: performanceEntry.fetchStart, 
            loadEnd: performanceEntry.loadEventEnd,
            totalLoadTime: performanceEntry.loadEventEnd - performanceEntry.fetchStart,
            session: sessionId
        };

        console.log(performanceData);

        // Store locally in case fetch fails
        localStorage.setItem("performanceData", JSON.stringify(performanceData));

        fetch("/json/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(performanceData)
        }).catch(err => console.warn("Failed to send performanceData:", err));
    }, 0);
});

// Activity Data (continuously collected)

// Set up dictionary to log activity data
document.addEventListener("DOMContentLoaded", function (event) {

});

/*
    Logs when user has been idle for at least two seconds
    Based on equiman's code from 
    https://stackoverflow.com/questions/667555/how-to-detect-idle-time-in-javascript
*/
window.addEventListener('load', function() {
    let activityData = {};
    let enteredPage = new Date();
    let currentPage = this.window.location.href;
    let time;
    let end;
    let  startms; // start in milliseconds
    let endms; // end in milliseconds
    let idle = false;
    let idleTimes = {};

    activityData["timeEnteredPage"] = enteredPage;
    activityData["currentPage"] = currentPage;

    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;

    function logIdle() {
        idle = true;
    }

    function resetTimer() {
        if(idle == true) {
            endms = Date.now();
            end = new Date();

            let idleTime = (endms-startms)/1000;
            idleTimes[end] = idleTime;
            idle = false;
            console.log(activityData);
        }
        startms = Date.now();
        clearTimeout(time);
        time = setTimeout(logIdle, 2000)
    }
    activityData["idleTimes"] = idleTimes;
});

// // Get time user left current page
// window.addEventListener('beforeunload', function(e) {
    
// });
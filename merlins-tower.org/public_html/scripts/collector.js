const sessionId = crypto.randomUUID(); // ID for specific user session

// === Static Data ===

document.addEventListener("DOMContentLoaded", function (event) {
    let staticData = {};
    staticData["userAgent"] = navigator.userAgent;
    staticData["userLanguage"] = navigator.language;
    staticData["acceptsCookies"] = navigator.cookieEnabled;
    
    document.cookie = "js_enabled=true; path=/"; 
    staticData["allowsJS"] = true;
    staticData["allowImage"] = allowImage();
    staticData["allowCSS"] = allowCSS();

    staticData["screenDimensions"] = window.screen.height + " x " + window.screen.width;
    staticData["windowDimensions"] = window.innerHeight + " x " + window.innerWidth;

    staticData["networkConnection"] = navigator.connection; // doesn't work with firefox, safari

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

// === Performance Data ===

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

        // Store locally in case fetch fails
        localStorage.setItem("performanceData", JSON.stringify(performanceData));

        fetch("/json/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(performanceData)
        }).catch(err => console.warn("Failed to send performanceData:", err));
    }, 0);
});

// === Activity Data (continuously collected) ===

let activityLog = [];

window.onerror = function (msg, url, lineNo, columnNo, error) {
    const errorData = {
        type: "error",
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        stack: error ? error.stack : null,
        timestamp: Date.now(),
        session: sessionId
    };
    activityLog.push(errorData);
};

document.addEventListener("mousemove", (event) => {
    const activity = {
        type: "mousemove",
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
    };
    activityLog.push(activity);
});

document.addEventListener('click', function(event) {
    const activity = {
        type: "click",
        x: event.clientX,
        y: event.clientY,
        button: event.button,
        timestamp: Date.now(),
    };
    activityLog.push(activity);
});

document.addEventListener("scroll", () => {
    const activity = {
        type: "scroll",
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        timestamp: Date.now(),
    };
    activityLog.push(activity);
});

document.addEventListener("keydown", (event) => {
    const activity = {
        type: "keydown",
        key: event.key,
        timestamp: Date.now(),
    };
    activityLog.push(activity);
});

document.addEventListener("keyup", (event) => {
    const activity = {
        type: "keyup",
        key: event.key,
        timestamp: Date.now(),
    };
    activityLog.push(activity);
});


/*
    Logs when user has been idle for at least two seconds
    Based on equiman's code from 
    https://stackoverflow.com/questions/667555/how-to-detect-idle-time-in-javascript
*/
window.addEventListener('load', function() {
    let enteredPage = new Date();
    let currentPage = this.window.location.href;
    let time;
    let end;
    let startms; // start in milliseconds
    let endms; // end in milliseconds
    let idle = false;
    let activity;

    activity = {"timeEnteredPage": enteredPage};
    activityLog.push(activity);

    activity = {"currentPage": currentPage};
    activityLog.push(activity);

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
            idle = false;
            activity = {"idleDuration": idleTime, "endOfBreak": end};
            activityLog.push(activity);
        }
        startms = Date.now();
        clearTimeout(time);
        time = setTimeout(logIdle, 2000)
    }
});

setInterval(() => {
    if (activityLog.length > 0) {
        const payload = {
            type: "activity",
            log: activityLog.slice(), // make shallow copy
            timestamp: Date.now(),
            session: sessionId
        };

        fetch("/json/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.warn("Failed to send activityLog:", err);
            localStorage.setItem("unsentActivity", JSON.stringify(payload));
        });

        // Clear the sent logs
        activityLog = [];
    }
}, 5000); // Every 5 seconds

// Get time user left current page
window.addEventListener('beforeunload', function(e) {
    let activity = {};
    activity["timeLeftPage"] = new Date();
    activityLog.push(activity);

    const payload = {
        type: "activity",
        log: activityLog,
        timestamp: Date.now(),
        session: sessionId
    };

    fetch("/json/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
    });
});
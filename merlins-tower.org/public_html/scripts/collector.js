const sessionId = crypto.randomUUID(); // ID for specific user session

// Static Data

document.addEventListener("DOMContentLoaded", function (event) {
    let staticData = {};
    staticData["userAgent"] = navigator.userAgent;
    staticData["userLanguage"] = navigator.language;
    staticData["acceptsCookies"] = navigator.cookieEnabled;
    
    document.cookie = "js_enabled=true; path=/"; 
    staticData["allowsJS"] = true;
    staticData["allowImage"] = noImage();
    staticData["allowCSS"] = noCSS();

    staticData["screenDimensions"] = window.screen.height + " x " + window.screen.width
    staticData["windowDimensions"] = window.innerHeight + " x " + window.innerWidth;

    staticData["networkConnection"] = navigator.connection; // doesn't work with firefox, safari
    staticData["session"] = sessionId;

    console.log(staticData);

    // Store to localStorage in case fetch fails
    localStorage.setItem("staticData", JSON.stringify(staticData));

    fetch("/json/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staticData)
    }).catch(err => console.warn("Failed to send staticData:", err));
});

function noImage() {
    return (document.getElementById("flag").offsetHeight != 0);
}

function noCSS() {
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
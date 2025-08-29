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

    console.log(staticData);
});

function noImage() {
    return (document.getElementById("flag").offsetHeight != 0);
}

function noCSS() {
    return (window.getComputedStyle(document.body, null).getPropertyValue("background-color") != "#FFF");
}

window.addEventListener('load', function() {
    const performanceEntry = performance.getEntriesByType("navigation")[0];
    if (!performanceEntry) return;

    const performanceData = {
        type: "performance",
        timing: performanceEntry,  // whole timing object object
        loadStart: performanceEntry.fetchStart, 
        loadEnd: performanceEntry.loadEventEnd,
        totalLoadTime: performanceEntry.loadEventEnd - performanceEntry.fetchStart
    };

    console.log(performanceData);
});
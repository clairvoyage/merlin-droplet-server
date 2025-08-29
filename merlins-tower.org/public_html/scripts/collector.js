document.addEventListener("DOMContentLoaded", function (event) {
    let staticData = {};
    staticData["userAgent"] = navigator.userAgent;
    staticData["userLanguage"] = navigator.language;
    staticData["acceptsCookies"] = navigator.cookieEnabled;
    
    document.cookie = "js_enabled=true; path=/"; 
    staticData["allowsJS"] = true;

    console.log(staticData);
    sendData(staticData);

    
});

async function sendData(staticData) {
    await fetch("../cgi-bin/php-general-echo.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(staticData)
    });
}
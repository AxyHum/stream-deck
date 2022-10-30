document.addEventListener('websocketCreate', function () {
    console.log("Websocket created!");
    showHideSettings(actionInfo.payload.settings);

    websocket.addEventListener('message', function (event) {
        console.log("Got message event!");

        // Received message from Stream Deck
        var jsonObj = JSON.parse(event.data);

        if (jsonObj.event === 'sendToPropertyInspector') {
            var payload = jsonObj.payload;
            showHideSettings(payload);
        }
        else if (jsonObj.event === 'didReceiveSettings') {
            var payload = jsonObj.payload;
            showHideSettings(payload.settings);
        }
    });
});

function showHideSettings(payload) {
    console.log("Show Hide Settings Called");
    setParseResponseSettings("none");
    setFilesSettings("none");
    setCustomImagesSettings("none");
    setResponseTextSettings("none");
    setResponseAsImageSettings("none");
    setTextAreaSettings("");
    setSaveResponseSettings("none");
    if (payload['loadFromFiles']) {
        setFilesSettings("");
        setTextAreaSettings("none");
    }
    if (payload['saveResponseToFile']) {
        setSaveResponseSettings("");
    }

    if (payload['parseResponse']) {
        setParseResponseSettings("");
    }

    if (payload['showCustomImages']) {
        setCustomImagesSettings("");
    }

    if (payload['responseShown'].length > 0) {
        setResponseTextSettings("");
    }

    if (payload['treatResponseAsImage']) {
        setResponseAsImageSettings("");
    }
}

function setFilesSettings(displayValue) {
    var dvFileAreas = document.getElementById('dvFileAreas');
    dvFileAreas.style.display = displayValue;
}

function setParseResponseSettings(displayValue) {
    var dvParseResponseSettings = document.getElementById('dvParseResponseSettings');
    dvParseResponseSettings.style.display = displayValue;
}


function setTextAreaSettings(displayValue) {
    var dvTextAreas = document.getElementById('dvTextAreas');
    dvTextAreas.style.display = displayValue;
}

function setSaveResponseSettings(displayValue) {
    var dvSaveResponseSettings = document.getElementById('dvSaveResponseSettings');
    dvSaveResponseSettings.style.display = displayValue;
}

function setCustomImagesSettings(displayValue) {
    var dvCustomImagesSettings = document.getElementById('dvCustomImagesSettings');
    dvCustomImagesSettings.style.display = displayValue;
}

function setResponseTextSettings(displayValue) {
    var dvResponseTextSettings = document.getElementById('dvResponseTextSettings');
    dvResponseTextSettings.style.display = displayValue;
}

function setResponseAsImageSettings(displayValue) {
    var dvResponseAsImageSettings = document.getElementById('dvResponseAsImageSettings');
    dvResponseAsImageSettings.style.display = displayValue;
}

function exportSettings() {
    console.log("Export settings...");
    var payload = {};
    payload.property_inspector = 'exportSettings';
    sendPayloadToPlugin(payload);
}

function importSettings() {
    console.log("Import settings...");
    var payload = {};
    payload.property_inspector = 'importSettings';
    sendPayloadToPlugin(payload);
}

function openDiscord() {
    if (websocket && (websocket.readyState === 1)) {
        const json = {
            'event': 'openUrl',
            'payload': {
                'url': 'http://discord.barraider.com'
            }
        };
        websocket.send(JSON.stringify(json));
    }
}

function openFormat() {
    if (websocket && (websocket.readyState === 1)) {
        const json = {
            'event': 'openUrl',
            'payload': {
                'url': 'https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings'
            }
        };
        websocket.send(JSON.stringify(json));
    }
}

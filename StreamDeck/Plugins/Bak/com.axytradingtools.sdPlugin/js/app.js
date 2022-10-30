/* global Utils, $SD */

/* DEBUG */

const app_debug = true;
const dbg = app_debug ? console.log.bind(window.console, "[app.js]") : () => { };

/* END DEBUG */

const MDevices = {};
const MGames = {};

let MWallpaperTimeout = 20000;
let wallpapers = [
    "wallpapers/Stream_Deck_Lifestyle_01.jpg",
    "wallpapers/Stream_Deck_Lifestyle_shot_03.jpg",
    "wallpapers/Stream_Deck_Mini_Lifestyle_01.jpg"
]

let SETTINGS = {
    maxlevels: 20,
    fixeddecimalplaces: 2
}
wallpapers = wallpapers.filter(e => !e.includes("Game:"));

$SD.on("connected", jsn => {
    console.log(".... CONNECTED", jsn);
    $SD.on("com.elgato.reactiondeck.tile.willAppear", jsonObj => action.onWillAppear(jsonObj));
    $SD.on("com.elgato.reactiondeck.tile.willDisappear", jsonObj => action.onWillDisappear(jsonObj));
    $SD.on("com.elgato.reactiondeck.tile.keyDown", jsonObj => action.onKeyDown(jsonObj));
});






/** ACTIONS */

const action = {
    onWillAppear: function (jsn) {
        getESDeviceWithId(jsn.device, jsn).addKey(jsn);
        if (MGames.hasOwnProperty(jsn.device)) {
            MGames[jsn.device].willAppear(jsn);
        }
    },

    onWillDisappear: function (jsn) {
        getESDeviceWithId(jsn.device, jsn).removeKey(jsn);
        getGameWithId(jsn.device).willDisappear(jsn);
    },

    onKeyDown: function (jsn) {
        MGames[jsn.device].keyDown(jsn);
    }
};









// function connected(jsn) {
//     // Subscribe to the willAppear and other events
//     $SD.on('com.axytools.http.willAppear', (jsonObj) => http.onWillAppear(jsonObj));
//     $SD.on('com.axytools.http.keyUp', (jsonObj) => http.onKeyUp(jsonObj));
//     // $SD.on('com.axytools.http.sendToPlugin', (jsonObj) => http.onSendToPlugin(jsonObj));
//     // $SD.on('com.axytools.http.didReceiveSettings', (jsonObj) => http.onDidReceiveSettings(jsonObj));
//     // $SD.on('com.axytools.http.propertyInspectorDidAppear', (jsonObj) => {
//     //     console.log('%c%s', 'color: white; background: black; font-size: 13px;', '[app.js]propertyInspectorDidAppear:');
//     // });
//     // $SD.on('com.axytools.http.propertyInspectorDidDisappear', (jsonObj) => {
//     //     console.log('%c%s', 'color: white; background: red; font-size: 13px;', '[app.js]propertyInspectorDidDisappear:');
//     // });
// };

// // http button

// const http = {
//     settings: {},
//     onDidReceiveSettings: function (jsn) {
//         console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[app.js]onDidReceiveSettings:');

//         this.settings = Utils.getProp(jsn, 'payload.settings', {});
//         this.doSomeThing(this.settings, 'onDidReceiveSettings', 'orange');

//         /**
//          * In this example we put a HTML-input element with id='mynameinput'
//          * into the Property Inspector's DOM. If you enter some data into that
//          * input-field it get's saved to Stream Deck persistently and the plugin
//          * will receive the updated 'didReceiveSettings' event.
//          * Here we look for this setting and use it to change the title of
//          * the key.
//          */

//         this.setTitle(jsn);
//     },

//     /** 
//      * The 'willAppear' event is the first event a key will receive, right before it gets
//      * shown on your Stream Deck and/or in Stream Deck software.
//      * This event is a good place to setup your plugin and look at current settings (if any),
//      * which are embedded in the events payload.
//      */

//     onWillAppear: function (jsn) {
//         console.log("You can cache your settings in 'onWillAppear'", jsn.payload.settings);
//         /**
//          * The willAppear event carries your saved settings (if any). You can use these settings
//          * to setup your plugin or save the settings for later use. 
//          * If you want to request settings at a later time, you can do so using the
//          * 'getSettings' event, which will tell Stream Deck to send your data 
//          * (in the 'didReceiveSettings above)
//          * 
//          * $SD.api.getSettings(jsn.context);
//         */
//         this.settings = jsn.payload.settings;

//         // Nothing in the settings pre-fill, just something for demonstration purposes
//         if (!this.settings || Object.keys(this.settings).length === 0) {
//             this.settings.mynameinput = 'AxyHum';
//         }
//         this.setTitle(jsn);
//     },

//     onKeyUp: function (jsn) {

//         console.log(jsn)
//         // let i = 0
//         // var interval = setInterval(() => {
//         //     if (i === 50) {
//         //         clearInterval(interval)
//         //     }
//         //     const url = 'https://dev.axytools.com/api/lot',
//         //         method = 'GET';
//         //     console.log('sendHttp', url, ' ', method);
//         //     fetch(url)
//         //         .then((response) => response.json())
//         //         .then((response) => { console.log(response); $SD.api.setTitle(jsn.context, response.lot) })
//         //         .catch(err => {
//         //             $SD.api.showAlert('rip');
//         //             logErr(err);
//         //         });
//         //     i += 1
//         // }, 200);
//     },

//     onSendToPlugin: function (jsn) {
//         /**
//          * This is a message sent directly from the Property Inspector 
//          * (e.g. some value, which is not saved to settings) 
//          * You can send this event from Property Inspector (see there for an example)
//          */

//         const sdpi_collection = Utils.getProp(jsn, 'payload.sdpi_collection', {});
//         if (sdpi_collection.value && sdpi_collection.value !== undefined) {
//             this.doSomeThing({ [sdpi_collection.key]: sdpi_collection.value }, 'onSendToPlugin', 'fuchsia');
//         }
//     },

//     /**
//      * This snippet shows how you could save settings persistantly to Stream Deck software.
//      * It is not used in this example plugin.
//      */

//     saveSettings: function (jsn, sdpi_collection) {
//         console.log('saveSettings:', jsn);
//         if (sdpi_collection.hasOwnProperty('key') && sdpi_collection.key != '') {
//             if (sdpi_collection.value && sdpi_collection.value !== undefined) {
//                 this.settings[sdpi_collection.key] = sdpi_collection.value;
//                 console.log('setSettings....', this.settings);
//                 $SD.api.setSettings(jsn.context, this.settings);
//             }
//         }
//     },

//     /**
//      * Here's a quick demo-wrapper to show how you could change a key's title based on what you
//      * stored in settings.
//      * If you enter something into Property Inspector's name field (in this demo),
//      * it will get the title of your key.
//      * 
//      * @param {JSON} jsn // The JSON object passed from Stream Deck to the plugin, which contains the plugin's context
//      * 
//      */

//     setTitle: function (jsn) {
//         if (this.settings && this.settings.hasOwnProperty('mynameinput')) {
//             console.log("watch the key on your StreamDeck - it got a new title...", this.settings.mynameinput);
//             $SD.api.setTitle(jsn.context, this.settings.mynameinput);
//         }
//     },

//     /**
//      * Finally here's a method which gets called from various events above.
//      * This is just an idea on how you can act on receiving some interesting message
//      * from Stream Deck.
//      */

//     doSomeThing: function (inJsonData, caller, tagColor) {
//         console.log('%c%s', `color: white; background: ${tagColor || 'grey'}; font-size: 15px;`, `[app.js]doSomeThing from: ${caller}`);
//         // console.log(inJsonData);
//     },


// };


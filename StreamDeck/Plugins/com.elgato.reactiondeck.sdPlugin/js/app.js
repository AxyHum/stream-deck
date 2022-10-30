/* global Utils, $SD */

/* DEBUG */

const app_debug = true;
const dbg = app_debug ? console.log.bind(window.console, "[app.js]") : () => { };

/* END DEBUG */

const MDevices = {};
const MGames = {};

let MWallpaperTimeout = 20000;
wallpapers = wallpapers.filter(e => !e.includes("Game:"));

$SD.on("connected", jsn => {
    console.log(".... CONNECTED", jsn);
    $SD.on("com.elgato.reactiondeck.tile.willAppear", jsonObj => action.onWillAppear(jsonObj));
    $SD.on("com.elgato.reactiondeck.tile.willDisappear", jsonObj => action.onWillDisappear(jsonObj));
    $SD.on("com.elgato.reactiondeck.tile.keyDown", jsonObj => action.onKeyDown(jsonObj));
});

$SD.on("viewWillAppear", jsonObj => {
    console.log(jsonObj)
    console.log("%c%s", "color: white; background: red; font-size: 20px;", "[viewWillApear]:");
});

$SD.on("deviceDidConnect", jsonObj => {
    console.log('deviceDidConnect')
    dbg("deviceDidConnect", jsonObj.device, jsonObj.deviceInfo.size, jsonObj);
    getESDeviceWithId(jsonObj.device, jsonObj);
    getGameWithId(jsonObj.device);
});

const AddDevice = (inDeviceId, inDeviceInfo) => {
    MDevices[inDeviceId] = new ESDDevice({
        device: inDeviceId,
        deviceInfo: { name: inDeviceInfo.name, size: inDeviceInfo.size, type: inDeviceInfo.type }
    });
    dbg('device info :', MDevices[inDeviceId])
};

const getESDeviceWithId = (inDeviceId, jsonObj = {}) => {
    if (!MDevices.hasOwnProperty(inDeviceId)) {
        if (jsonObj && jsonObj.hasOwnProperty("deviceInfo")) {
            AddDevice(inDeviceId, jsonObj.deviceInfo);
        } else {
            const dvc = $SD.applicationInfo.devices.find(d => d.id == inDeviceId);
            AddDevice(inDeviceId, dvc);
        }
    }
    return MDevices[inDeviceId];
};

const getRandomWallPaper = () => {
    return Utils.randomElementFromArray(wallpapers);
}

const setRandomWallPaperForDevice = (esDevice) => {
    if (esDevice) {
        esDevice.setWallpaper(getRandomWallPaper());
    }
}

const getGameWithId = inDeviceId => {
    if (!MGames.hasOwnProperty(inDeviceId)) {
        dbg('getGameWithId', inDeviceId);
        let wallpaperTimer = null;
        const dvc = $SD.applicationInfo.devices.find(d => d.id == inDeviceId);
        const esDevice = getESDeviceWithId(inDeviceId);
        const flashGame = new FlashGame(dvc, null, false);
        // setRandomWallPaperForDevice(esDevice);
        MGames[inDeviceId] = flashGame;

        flashGame.on("initialized", result => {
            setRandomWallPaperForDevice(esDevice);
        });

        flashGame.on("gameover", result => {
            const delayedReset = 0;
            if (delayedReset > 0) {
                esDevice.notify("Game Over");
                createScoreTiles(esDevice, result.time);
                setTimeout(() => {
                    flashGame.reset();
                    setRandomWallPaperForDevice(esDevice);
                    flashGame.showInfo();
                }, delayedReset);
            } else {
                flashGame.reset();
                setRandomWallPaperForDevice(esDevice);
                flashGame.showInfo();
                // flashGame.unlock();
            }

        });
        flashGame.on("locked", () => {
            flashGame.dbg("locked... Timer:", wallpaperTimer, "WallpaperTimeout:", MWallpaperTimeout);

            if (wallpaperTimer) {
                clearInterval(wallpaperTimer);
                wallpaperTimer = null;
            }
            wallpaperTimer = setInterval(() => {
                setRandomWallPaperForDevice(esDevice);
            }, MWallpaperTimeout);
        });
        flashGame.on("unlocked", () => {
            if (wallpaperTimer) {
                clearInterval(wallpaperTimer);
                wallpaperTimer = null;
            }
        });
    }
    return MGames[inDeviceId];
};

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
        console.log(jsn)
    },

    onKeyDown: function (jsn) {
        MGames[jsn.device].keyDown(jsn);
    }
};

const createScoreTiles = (targetDevice, score) => {
    const tmpBuf = targetDevice.getTileBuffer();
    const total = targetDevice.keys.length;
    const arr = Array.from(`${score}`);
    const arrLen = arr.length;

    for (let i = 0; i < total; i++) {
        Utils.drawStringToCanvas(`${arr[arrLen - (total - i)]}`, 96, tmpBuf);
        targetDevice.setTileAtIndex(i, tmpBuf.toDataURL("image/png"));
    }
    targetDevice.drawTiles(total - arrLen);
};

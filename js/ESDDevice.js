class ESDDevice {
    constructor(inJson) {
        this.device = inJson;
        const col = this.device.deviceInfo.size.columns || 5;
        const row = this.device.deviceInfo.size.rows || 3;
        this.buffer = new ESDBuffer(row, col);
        this.keys = [];
        this.utils = Utils;

        this.setWallpaper = imgNameOrPath => {
            let image = new Image();
            image.onload = () => {
                this.scaleAndDrawImage(image, this.buffer.getContext("2d"));
                this.updateWallpaper();
            };
            image.src = imgNameOrPath.includes("/") ? imgNameOrPath : `images/${imgNameOrPath.length ? imgNameOrPath : "streamdeck.jpg"}`;
        };
    }

    addKey(jsn) {
        this.keys.push({
            context: jsn.context,
            coordinates: jsn.payload.coordinates,
            index: this.buffer.getIndexFromCoordinates(jsn.payload.coordinates)
        });
    }

    removeKey(jsn) {
        const i = this.keys.findIndex(k => {
            return jsn.context == k.context;
        });

        if (i > -1) {
            this.keys.splice(i, 1);
        }
    }

    getTiles() {
        return this.buffer.getTiles();
    }
    setTiles(arrOfTiles) {
        this.buffer.setTiles(arrOfTiles);
    }

    setTileAtIndex(idx, newTileAsDataUrl, redraw = false) {
        if (this.isValidIndex(idx)) {
            this.buffer.setTileAtIndex(newTileAsDataUrl, idx);
            if (redraw) {
                this.drawTileAtIndex(idx);
            }
        }
    }

    setTileAtCoordinates(coordinates, newTileAsDataUrl, redraw = false) {
        const idx = this.buffer.getIndexFromCoordinates(coordinates);
        this.setTileAtIndex(idx, newTileAsDataUrl, redraw);
    }

    setAllTilesToDataUrl(newTileAsDataUrl, redraw) {
        const arrOfTiles = [];
        const l = this.keys.length;
        for (var i = 0; i < l; i++) {
            arrOfTiles.push(newTileAsDataUrl);
        }
        this.buffer.setTiles(arrOfTiles);
        if (redraw === true) {
            this.drawTiles();
        }
    }

    drawTiles(fromTile = 0) {
        const l = this.keys.length;
        let startIdx = this.isValidIndex(fromTile) ? fromTile : 0;
        for (var i = startIdx; i < l; i++) {
            if (this.keys[i]) {
                const img = this.buffer.getTileFromCoordinates(this.keys[i].coordinates);
                const ctx = this.keys[i].context;
                $SD.api.setImage(ctx, img);
            }
        }
    }

    drawTileAtIndex(idx) {
        if (this.isValidIndex(idx)) {
            const img = this.buffer.getTileFromCoordinates(this.keys[idx].coordinates);
            const ctx = this.keys[idx].context;
            $SD.api.setImage(ctx, img);
        }
    }

    drawTileAtCoordinates(coordinates) {
        const idx = this.buffer.getIndexFromCoordinates(coordinates);
        this.drawTileAtIndex(idx);
    }

    getMeta() {
        return this.buffer.getMeta();
    }
    setMeta(arrOfTiles) {
        this.buffer.setMeta(arrOfTiles);
    }

    getTileBuffer() {
        return this.buffer.getTileBuffer();
    }

    scaleAndDrawImage(img, ctx, cover) {
        const canvas = ctx.canvas;
        const ratio = cover === true ? Math.max(canvas.width / img.width, canvas.height / img.height) : Math.max(canvas.width / img.width, canvas.height / img.height);
        const centerX = (canvas.width - img.width * ratio) / 2;
        const centerY = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log("centerX/Y", centerX, centerY, "ratio:", ratio);
        ctx.drawImage(img, 0, 0, img.width, img.height, centerX, centerY, img.width * ratio, img.height * ratio);
    }

    updateWallpaper() {
        const l = this.keys.length;
        for (var i = 0; i < l; i++) {
            if (this.keys[i]) {
                const img = this.buffer.getTileDataFromCoordinates(this.keys[i].coordinates);
                const ctx = this.keys[i].context;
                console.log(img)
                $SD.api.setImage(ctx, img);
            }
        }
    }

    clearBuffer() {
        const l = this.keys.length;
        for (var i = 0; i < l; i++) {
            const ctx = this.keys[i].context;
            $SD.api.setImage(ctx, null);
        }
    }

    isValidIndex(idx) {
        return idx >= 0 && idx < this.keys.length && this.keys[idx];
    }

    countdown(time = 2, callback) {
        const h = this.buffer.getHeight();
        const canvas = this.buffer.getCanvas();
        this.utils.drawStringToCanvas("GET READY", h / 4, canvas);
        this.updateWallpaper();

        let sec = time;

        var id = window.setInterval(() => {
            sec--;
            let tt = Date.now();
            this.utils.drawStringToCanvas(sec, h / 2, canvas);
            this.updateWallpaper();
            if (sec < 1) {
                clearInterval(id);
                // this.clearBuffer();
                if (callback) callback();
            }
        }, 500);
    }

    notify(msg, timeout = 2000) {
        return new Promise(resolve => {
            const h = this.buffer.getHeight();
            const canvas = this.buffer.getCanvas();
            this.utils.drawStringToCanvas(msg, h / 4, canvas);
            this.updateWallpaper();
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }
}

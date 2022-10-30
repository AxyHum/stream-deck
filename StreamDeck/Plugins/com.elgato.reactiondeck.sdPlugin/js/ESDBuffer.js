function ESDBuffer(rows, cols, inCanvas) {
    const debug = false;

    const MDefaultWidth = 144,
        MDefaultHeight = 144,
        mRows = rows || 3,
        mCols = cols || 5,
        // spacing = cols > 5 ? 40 : 40,
        spacing = 44,
        canvas = inCanvas && inCanvas instanceof HTMLCanvasElement ? inCanvas : document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        width = mCols * MDefaultWidth + (mCols - 1) * spacing,
        height = mRows * MDefaultHeight + (mRows - 1) * spacing,
        tileBuffer = document.createElement("canvas"),
        utils = Utils;
    let tiles = [];
    this.meta = [];
    this.dbg = debug ? console.log.bind(window.console, `[ESDBuffer] ${mCols}/${mRows}`) : () => { };

    canvas.width = width;
    canvas.height = height;

    this.dbg("BufferSize: w:", width, "h:", height, "s:", spacing);

    tileBuffer.width = MDefaultWidth;
    tileBuffer.height = MDefaultHeight;

    this.createNumberedTiles = () => {
        const total = mCols * mRows;
        tiles.splice(0, tiles.length);
        for (let i = 0; i < total; i++) {
            utils.drawStringToCanvas(`${i}`, 96, tileBuffer);
            tiles.push(tileBuffer.toDataURL("image/png"));
        }
    };

    this.getCanvas = function() {
        return canvas;
    };

    this.getContext = function() {
        return ctx;
    };

    this.getHeight = function() {
        return height;
    };

    this.getLength = function() {
        return mRows * mCols;
    };

    this.getSize = function() {
        return { width, height };
    };

    this.getIndexFromCoordinates = function(coordinates) {
        return Number(coordinates.row) * mCols + Number(coordinates.column);
    };

    this.getTiles = function() {
        return tiles;
    };

    this.setTiles = function(arrOfTiles) {
        tiles.splice(0, tiles.length);
        tiles = arrOfTiles;
    };

    this.setTileAtIndex = function(tileAsDataUrl, idx) {
        tiles[idx] = tileAsDataUrl;
    };

    this.getTileFromIndex = function(idx) {
        if (idx > 0 && idx < mRows * mCols) {
            return tiles[idx];
        }
    };

    this.getTileFromCoordinates = function(coordinates) {
        return tiles[this.getIndexFromCoordinates(coordinates)];
    };

    // imageData = octx.getImageData(x * options.width + x * xoffs, y * options.height + y * yoffs, options.width, options.height);
    this.getTileDataFromCoordinates = function(coordinates) {
        // const imageData = ctx.getImageData(coordinates.column * MDefaultWidth, coordinates.row * MDefaultHeight, MDefaultWidth, MDefaultHeight);
        const imageData = ctx.getImageData(coordinates.column * MDefaultWidth + coordinates.column * spacing,
            coordinates.row * MDefaultHeight + coordinates.row * spacing, MDefaultWidth, MDefaultHeight);
        var destCtx = tileBuffer.getContext("2d");
        destCtx.putImageData(imageData, 0, 0);
        return tileBuffer.toDataURL("image/png");
    };

    this.setMeta = function(arrOfMeta) {
        this.meta = arrOfMeta;
    };

    this.getMeta = function() {
        return this.meta;
    };

    this.getMetaFromCoordinates = function(coordinates) {
        const idx = this.getIndexFromCoordinates(coordinates);
        console.log("META", idx, this.meta.length);
        if (idx < this.meta.length) {
            return this.meta[idx];
        }
    };

    this.getTileBuffer = function() {
        return tileBuffer;
    }

    // this.createNumberedTiles();
    // console.log("ESDBuffer: rows/cols:", mRows, mCols);
}

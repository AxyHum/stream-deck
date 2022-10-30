function ESDGrid(rows, cols) {
    const mRows = rows || 3,
        mCols = cols || 5,
        mCoordinates = {
            row: 0,
            col: 0
        };

    this.getRows = function () {
        return mRows;
    };

    this.getColumns = function () {
        return mCols;
    };

    this.getCurrentCoordinate = function () {
        return mCoordinates;
    };

    this.isValid = function (coordinates) {
        return typeof coordinates == "object" && (coordinates.col < mCols && coordinates.row < mRows);
    };

    this.getCoordinatesFromIndex = function (idx, bAsString) {
        if (idx > 0 && idx < mRows * mCols) {
            if (bAsString) {
                return [Math.floor(idx / mCols), idx % mCols].join(","); //for compatibility with SD C++
            }
            return { column: idx % mCols, row: Math.floor(idx / mCols) };
        }
        return [0, 0].join(",");
    };

    this.getKeyForIndex = function (idx) {
        if (idx > 0 && idx < mRows * mCols) {
            //console.log(idx + "  row: " + Math.floor(idx / mRows) + "  col: " + idx % mRows);
            //return Math.floor(idx / mRows) * mRows + idx % mRows;
            return (idx % mCols) * mRows + Math.floor(idx / mCols);
        }
        return 0;
    };

    this.getIndexFromCoordinates = function (coords) {
        var coordinates = { row: 0, column: 0 };

        if (typeof coords === "String") {
            var tmp = coords.split(",");
            coordinates.row = tmp[0];
            coordinates.column = tmp[1];
        } else if (Array.isArray(coords)) {
            coordinates.row = coords[0];
            coordinates.column = coords[1];
        } else if (typeof coords == "object" && coords.hasOwnProperty("row") && coords.hasOwnProperty("column")) {
            coordinates = coords;
        }

        return Number(coordinates.row) * mCols + Number(coordinates.column);
    };

    this.step = function () {
        mCoordinates.col++;
        if (mCoordinates.col >= mCols) {
            mCoordinates.row++;
            mCoordinates.col = 0;
        }
    };
}
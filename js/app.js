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

const mCols = 5;
const mRows = 3;
var xx = null  // Empty
var oo = 0
var nn = 'NEXT' // Next Page
config = {  // Notez que xx = BACK|CLOSE|NEXT|PREV|EMPTY  BUTTON
    stopLoss: [xx, 5, 8, 10, xx, 12, 15, 20, 25, 30, 35, 40, 45, 50, 100],
    riskRatio: [xx, xx, xx, xx, xx, 1, 1.5, 2, 2.5, 3, xx, xx, xx, xx, xx],
    orders: [xx, xx, xx, xx, xx],
    modify: {
        stopLoss: [
            [xx, 5, 8, 10, xx, 12, 15, 18, 20, 25, 30, 35, 40, xx, nn],
            [xx, 45, 50, 55, xx, 60, 65, 70, 75, 80, 90, 95, 100]
        ],
    }
}
var SL = 0;
const uuid = 'f4d5b460-5842-11ed-9b6a-0242ac120002';
const url = 'https://axytools.local/api/' + uuid;
var symbolActive = 0
var symbols = []
var openPosition = {}

$SD.on("connected", jsn => {
    console.log(".... CONNECTED", jsn);
    action.init(jsn)
    instance = 0

    $SD.on("com.axytradingtools.tile.willAppear", jsonObj => action.onWillAppear(jsonObj));
    $SD.on("com.axytradingtools.tile.keyDown", jsonObj => action.onKeyDown(jsonObj));
    $SD.on("com.axytradingtools.tile.willDisappear", jsonObj => action.onWillDisappear(jsonObj));
});

$SD.on("deviceDidConnect", jsonObj => {
    dbg("deviceDidConnect", jsonObj.device, jsonObj.deviceInfo.size, jsonObj);
    getESDeviceWithId(jsonObj.device, jsonObj);
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
    return MyDevice = MDevices[inDeviceId];
};

const getBase64Image = function (image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    var dataUrl = canvas.toDataURL("image/png");
    return dataUrl

}


/** ACTIONS */

const action = {

    init: async function () {
        const fetchResponse = await fetch(url);
        const response = await fetchResponse.json();
        SL = response.SL
        instance = "home"
    },
    onWillAppear: function (jsn) {
        getESDeviceWithId(jsn.device, jsn).addKey(jsn);
        if (MGames.hasOwnProperty(jsn.device)) {
            MGames[jsn.device].willAppear(jsn);
        }

        $SD.api.setImage(jsn.context, null);
        $SD.api.setTitle(jsn.context, '');

        if (jsn.payload.settings.symbol)
            symbols.push(jsn.payload.settings.symbol)

        index = indexFromCoordinates(jsn.payload.coordinates)

        keys = MyDevice.keys
        totalKeys = MyDevice.keys.length;
        if (index == 4) {
            keys.sort(function (a, b) {
                return ((a.index < b.index) ? -1 : ((a.index > b.index) ? 1 : 0));
            })
            home()
        }
    },
    // =========== ON KEY DOWN ========== //
    onKeyDown: async function (jsn) {
        index = indexFromCoordinates(jsn.payload.coordinates)
        lotIndex = indexFromCoordinates({ column: 2, row: 2 })

        switch (instance) {
            case "stoploss.index":  // StopLoss Behavior
            case "stoploss.select":
                new stopLoss().onKeyDown(jsn)
                break;

            case "riskratio.index":
                new riskRatio().onKeyDown(jsn)
                break;

            case "confirmPosition.index":
                new confirmPosition().onKeyDown(jsn)
                break;
            case "selectSymbol.index":
                new selectSymbol().onKeyDown(jsn)
                break
            case "orders.index":
            case "orders.order":
            case "orders.order.modify":
            case "orders.order.modify.customStopLoss":
                new orders().onKeyDown(jsn)
                break

            case "home":            // Home behavior
                switch (true) {
                    case (index < 5):   // Symbols
                        if (symbolActive.context !== jsn.context) {
                            console.log(symbolActive)
                            setImage(symbolActive.context, 'symbols/' + symbolActive.symbol + '_0')
                            setImage(jsn.context, 'symbols/' + jsn.payload.settings.symbol + '_1')
                            symbolActive = { context: jsn.context, symbol: jsn.payload.settings.symbol }
                            dbg('Change button')
                        } else {
                            new stopLoss().select("SELL")
                        }
                        break;
                    case (index == 8):
                        new news().index()
                        break
                    case (index == 9): // Orders List
                        new orders().index()
                        break
                    case (index == 10): // Sell
                        openPosition.symbol = symbolActive.symbol
                        openPosition.type = "SELL"
                        openPosition.stopLoss = SL
                        new riskRatio().index()
                        break;
                    case (index == 11): // Minus Lot
                        fetch(url + '/sub')
                        $SD.api.setTitle(MyDevice.keys[lotIndex].context, SL -= 1)
                        break;
                    case (index == 13): // Add Lot
                        fetch(url + '/add')
                        $SD.api.setTitle(MyDevice.keys[lotIndex].context, SL += 1)
                        break;
                    case (index == 14): // Buy
                        openPosition.symbol = symbolActive.symbol
                        openPosition.type = "BUY"
                        openPosition.stopLoss = SL
                        new riskRatio().index()
                        break;
                }
                break;
        }

    },
    // onKeyDown: function (jsn) {
    //     index = indexFromCoordinates(jsn.payload.coordinates)
    //     console.log(keys[index].coordinates)
    // },

    onWillDisappear: function (jsn) {
        getESDeviceWithId(jsn.device, jsn).removeKey(jsn);
    }

};

// =============== FUNCTIONS ===============

const home = () => {         // Draw Home Dashboard
    clear()
    dbg("Display Home");
    console.log(keys);
    instance = "home"
    for (let i = 0; i < totalKeys; i++) {
        switch (i) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:   // Symbols
                if (symbolActive.symbol == keys[i].settings.symbol)
                    setImage(keys[i].context, 'symbols/' + keys[i].settings.symbol + '_1')
                else
                    setImage(keys[i].context, 'symbols/' + keys[i].settings.symbol + '_0')

                break;
            case 5:  // Settings
                setImage(keys[i].context, 'SETTINGS')
                break;
            case 6:  // History
                setImage(keys[i].context, 'HISTORY_TEST_2')
                break;
            case 8:  // News
                setImage(keys[i].context, 'NEWS')
                break;
            case 9:  // Orders Folder
                setImage(keys[i].context, 'ORDERS')
                break;
            case 10: // Sell Button
                setImage(keys[i].context, 'SELL');
                break;
            case 11: // Minus Lot
                setImage(keys[i].context, 'LOT_MINUS')
                break;
            case 12: // Lots
                setImage(keys[i].context, 'LOTS')
                if (SL > 0) {
                    $SD.api.setTitle(keys[i].context, SL)
                } else {
                    setTimeout(() => {
                        $SD.api.setTitle(keys[i].context, SL)
                    }, 600);
                }
                break;
            case 13: // Add Lot
                setImage(keys[i].context, 'LOT_PLUS')
                break;
            case 14: // Buy Button
                setImage(keys[i].context, 'BUY')
                break;
        }
    }
}

function news() {
    this.index = () => {
        clear()
        setImage(keys[5].context, 'USA.jpg')
        $SD.api.setTitle(keys[5].context, '16h25\nNom de la\nNews')
    }
}

function orders() {
    this.index = async (page = 0) => {
        clear()
        instance = "orders.index"

        orderIndexPage = page

        for (let i = 0; i < 5; i++) { // Deux fonction d'affichage sont spérarer afin de permettre le chargement dynamique des ordres
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break;
                case 1:
                case 2:
                case 3:
                    setImage(keys[i].context, 'POSITIONS_' + i);
                    break;
                case 4:
                    setImage(keys[i].context, 'REFRESH');
                    break;
            }
        }

        const orders = await this.getOrders()
        Orders = config.orders.slice()

        setImage(keys[14].context, 'NEXT_DISABLED')
        var key = 5
        for (let i = 8 * page; i < orders.length; key++) {
            if (key == 12) {
                Orders.push(null)
                continue
            }
            if (key == 14 && i.length > 7) {
                setImage(keys[key].context, 'GREEN_NEXT')
                continue
            }
            setImage(keys[key].context, 'orders/ORDER_' + (orders[i].type.includes('BUY') ? 'BUY' : 'SELL') + '_' + (orders[i].symbol).replace('+', ''))
            const tp = (Math.abs(orders[i].openPrice - orders[i].takeProfit) * 10000).toFixed(1)
            const sl = (Math.abs(orders[i].openPrice - orders[i].stopLoss) * 10000).toFixed(1)
            $SD.api.setTitle(keys[key].context, '\nSL ' + sl + '\nTP ' + tp)
            $SD.api.setState(keys[key].context, (orders[i].type.includes('BUY') ? 1 : 0))
            i++
            Orders.push(1)
        }
    }

    this.onKeyDown = async jsn => {
        index = indexFromCoordinates(jsn.payload.coordinates)

        switch (instance) {
            case "orders.index":
                switch (index) {
                    case 0:     // Back Button ==> HOME or BACK page order
                        if (orderIndexPage > 0)
                            return new orders().index(orderIndexPage - 1)
                        home()
                        break
                    case 4:     // Refresh Button ==> ORDERS LIST
                        new orders().index()
                    case 14:
                        if ((Orders.length - 5) > 8)
                            new orders().index(orderIndexPage + 1)
                        break
                    default:
                        console.log(Orders)
                        if (Orders[index] != null) {
                            return this.showOrder(index + (8 * orderIndexPage) - 5)
                        }
                }
                break
            case "orders.order.modify":
                switch (index) {
                    case 0:
                        if (order.stopLossPage > 0)                   // If Page > 0 Return Page Back
                            return new orders().modifyOrder(order.actualStopLossType, order.stopLossPage - 1)
                        new orders().showOrder(order.index)     // Back Button ==> HOME
                        break
                    case 4:     // Refresh Button ==> ORDERS LIST
                        new orders().index(orderIndexPage)
                        break
                    case 13:
                        new orders().customStopLoss()
                        break
                    case 14:    // StopLoss Next Page "==>"
                        new orders().modifyOrder(order.actualStopLossType, order.stopLossPage + 1)
                        break
                    default:
                        let stopLoss = config.modify.stopLoss[order.stopLossPage][index]
                        if (order.stopLossPips == stopLoss) {
                            console.log('Modify Confirm !')
                            return new orders().modifyConfirm()
                        }
                        else if (stopLoss != null) {
                            if (order.stopIndexSelected) {
                                setImage(keys[order.stopIndexSelected].context, (order.actualStopLossType == 'profit' ? 'profit/PROFIT_' : 'stopLoss/SELL_') + config.modify.stopLoss[order.stopLossPage][order.stopIndexSelected] + '.jpg');
                            }
                            order.stopLossPips = stopLoss
                            order.stopIndexSelected = index
                            setImage(keys[index].context, (order.actualStopLossType == 'profit' ? 'profit/PROFIT_RED_' : 'stopLoss/BUY_') + stopLoss + '.jpg');
                        }
                        break
                }

                break
            case "orders.order.modify.customStopLoss":
                switch (index) {
                    case 0:
                        new orders().modifyOrder(order.actualStopLossType)
                        break
                    case 4:     // Return Button => Show Order
                        new orders().showOrder(order.index)
                        break
                    case 6:
                        $SD.api.setTitle(MyDevice.keys[lotIndex].context, order.stopLossPips = (parseFloat(order.stopLossPips) - 0.1).toFixed(1))
                        break
                    case 8:
                        $SD.api.setTitle(MyDevice.keys[lotIndex].context, order.stopLossPips = (parseFloat(order.stopLossPips) + 0.1).toFixed(1))
                        break
                    case 11:
                        $SD.api.setTitle(MyDevice.keys[lotIndex].context, order.stopLossPips = (parseFloat(order.stopLossPips) - 1).toFixed(1))
                        break
                    case 13:
                        $SD.api.setTitle(MyDevice.keys[lotIndex].context, order.stopLossPips = (parseFloat(order.stopLossPips) + 1).toFixed(1))
                        break
                    case 14: // Valid => Edit Position StopLoss / Profit 
                        new orders().modifyConfirm()
                    // return new orders().showOrder(order.index)
                }
                break
            case "orders.order":
                switch (index) {
                    case 0:     // Back Button ==> ORDERS LIST
                        new orders().index()
                        // clearInterval(autofetch)
                        break
                    case 4:     // Close button ==> HOME
                        home()
                        // clearInterval(autofetch)
                        break
                    case 6:
                        // clearInterval(autofetch)
                        this.modifyOrder('stoploss')
                        break
                    case 8:
                        // clearInterval(autofetch)
                        this.modifyOrder('profit')
                        break
                    case 10:
                        showOrderState = showOrderState ? 0 : 1
                        if (showOrderState) { // Change State 
                            setImage(keys[6].context, 'STOP')
                            $SD.api.setState(keys[6].context, 0)
                            $SD.api.setTitle(keys[6].context, '\n' + order.stopLoss)

                            setImage(keys[7].context, 'PRICE')
                            $SD.api.setState(keys[7].context, 1)
                            $SD.api.setTitle(keys[7].context, '\n' + order.currentPrice)

                            setImage(keys[8].context, 'PROFIT_1')
                            $SD.api.setState(keys[8].context, 1)
                            $SD.api.setTitle(keys[8].context, '\n' + order.takeProfit)

                            setImage(keys[10].context, 'PRICEMODE')
                        } else {
                            const sl = (Math.abs(order.openPrice - order.stopLoss) * 10000).toFixed(0)
                            setImage(keys[6].context, '/stopLoss/SELL_' + sl + '.jpg')
                            $SD.api.setTitle(keys[6].context, '')

                            const price = (Math.abs(order.openPrice - order.currentPrice) * 10000 * (order.profit > 0 ? 1 : -1)).toFixed(1)
                            setImage(keys[7].context, 'price/PRICE_' + price + '.jpg')
                            $SD.api.setTitle(keys[7].context, '')

                            const tp = (Math.abs(order.openPrice - order.takeProfit) * 10000).toFixed(0)
                            setImage(keys[8].context, '/profit/PROFIT_' + tp + '.jpg')
                            $SD.api.setTitle(keys[8].context, '')

                            setImage(keys[10].context, 'PIPSMODE')
                        }
                        break
                    case 12:
                        // clearInterval(autofetch)
                        new orders().closeOrder()
                        break
                    case 14: // Refresh Order
                        setImage(keys[14].context, 'REFRESH_0')                 // Set white image during fetch data

                        const orderIndex = order.index                          // Temp index value
                        order = (await new orders().getOrders())[orderIndex]    // Fetch data
                        order.index = orderIndex                                // Set order.index
                        setImage(keys[14].context, 'REFRESH')                   // Set default image after fetch (green)

                        // UPDATE ALL DATA :

                        setImage(keys[2].context, 'PROFIT_' + (order.profit > 0 ? 1 : 0))
                        $SD.api.setTitle(keys[2].context, '\n' + (order.profit).toFixed(1) + '€')
                        $SD.api.setState(keys[2].context, (order.profit > 0 ? 1 : 0))

                        if (showOrderState) { // PIPS/PRICE MODE 
                            setImage(keys[6].context, 'STOP')
                            $SD.api.setState(keys[6].context, 0)
                            $SD.api.setTitle(keys[6].context, '\n' + order.stopLoss)

                            setImage(keys[7].context, 'PRICE')
                            $SD.api.setState(keys[7].context, 1)
                            $SD.api.setTitle(keys[7].context, '\n' + order.currentPrice)

                            setImage(keys[8].context, 'PROFIT_1')
                            $SD.api.setState(keys[8].context, 1)
                            $SD.api.setTitle(keys[8].context, '\n' + order.takeProfit)

                            setImage(keys[10].context, 'PRICEMODE')
                        } else {
                            const sl = (Math.abs(order.openPrice - order.stopLoss) * 10000).toFixed(0)
                            setImage(keys[6].context, '/stopLoss/SELL_' + sl + '.jpg')
                            $SD.api.setTitle(keys[6].context, '')

                            const price = (Math.abs(order.openPrice - order.currentPrice) * 10000 * (order.profit > 0 ? 1 : -1)).toFixed(1)
                            setImage(keys[7].context, 'price/PRICE_' + price.replace('.0', '') + '.jpg')
                            $SD.api.setTitle(keys[7].context, '')

                            const tp = (Math.abs(order.openPrice - order.takeProfit) * 10000).toFixed(0)
                            setImage(keys[8].context, '/profit/PROFIT_' + tp + '.jpg')
                            $SD.api.setTitle(keys[8].context, '')

                            setImage(keys[10].context, 'PIPSMODE')
                        }
                        break

                }
        }
    }

    this.showOrder = async index => {
        clear()
        instance = "orders.order"

        if (typeof showOrderState === 'undefined')
            showOrderState = 0

        for (let i = 0; i < totalKeys; i++) {
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break;
                case 4:
                    setImage(keys[i].context, 'CLOSE');
                    break;
            }
        }
        order = (await this.getOrders())[index]
        if (order === undefined) {
            return this.index()
        }
        order.index = index
        console.log(order)


        // Symbol
        setImage(keys[1].context, 'symbols/' + (order.symbol).replace('+', '') + '_1')

        // Profit 
        setImage(keys[2].context, 'PROFIT_' + (order.profit > 0 ? 1 : 0))
        $SD.api.setTitle(keys[2].context, '\n' + (order.profit).toFixed(1) + '€')
        $SD.api.setState(keys[2].context, (order.profit > 0 ? 1 : 0))

        // Type (Buy/Sell)
        setImage(keys[3].context, order.type.includes('BUY') ? 'BUY' : 'SELL')

        // Stop Loss
        const sl = (Math.abs(order.openPrice - order.stopLoss) * 10000).toFixed(0)
        setImage(keys[6].context, '/stopLoss/SELL_' + sl + '.jpg')

        // Current Price
        const price = (Math.abs(order.openPrice - order.currentPrice) * 10000 * (order.profit > 0 ? 1 : -1)).toFixed(1)
        setImage(keys[7].context, 'price/PRICE_' + price.replace('.0', '') + '.jpg')

        // Take Profit
        const tp = (Math.abs(order.openPrice - order.takeProfit) * 10000).toFixed(0)
        setImage(keys[8].context, '/profit/PROFIT_' + tp + '.jpg')

        // Pips / Price Switch
        setImage(keys[10].context, 'PIPSMODE')

        // BE Button
        setImage(keys[11].context, 'BE')

        // Close Order
        setImage(keys[12].context, 'ORDER_CLOSE')

        // Refresh Button
        setImage(keys[14].context, 'REFRESH')

        // autofetch = setInterval(async function () {
        //     order = (await new orders().getOrders())[index]

        //     // Profit 
        //     setImage(keys[2].context, 'PROFIT_' + (order.profit > 0 ? 1 : 0))
        //     $SD.api.setTitle(keys[2].context, '\n' + (order.profit).toFixed(1) + '€')
        //     $SD.api.setState(keys[2].context, (order.profit > 0 ? 1 : 0))

        //     if (showOrderState) { // Change State 
        //         setImage(keys[6].context, 'STOP')
        //         $SD.api.setState(keys[6].context, 0)
        //         $SD.api.setTitle(keys[6].context, '\n' + order.stopLoss)

        //         setImage(keys[7].context, 'PRICE')
        //         $SD.api.setState(keys[7].context, 1)
        //         $SD.api.setTitle(keys[7].context, '\n' + order.currentPrice)

        //         setImage(keys[8].context, 'PROFIT_1')
        //         $SD.api.setState(keys[8].context, 1)
        //         $SD.api.setTitle(keys[8].context, '\n' + order.takeProfit)

        //         setImage(keys[10].context, 'PRICEMODE')
        //     } else {
        //         const sl = (Math.abs(order.openPrice - order.stopLoss) * 10000).toFixed(0)
        //         setImage(keys[6].context, '/stopLoss/SELL_' + sl + '.jpg')
        //         $SD.api.setTitle(keys[6].context, '')

        //         const price = (Math.abs(order.openPrice - order.currentPrice) * 10000 * (order.profit > 0 ? 1 : -1)).toFixed(1)
        //         setImage(keys[7].context, 'price/PRICE_' + price.replace('.0', '') + '.jpg')
        //         $SD.api.setTitle(keys[7].context, '')

        //         const tp = (Math.abs(order.openPrice - order.takeProfit) * 10000).toFixed(0)
        //         setImage(keys[8].context, '/profit/PROFIT_' + tp + '.jpg')
        //         $SD.api.setTitle(keys[8].context, '')

        //         setImage(keys[10].context, 'PIPSMODE')
        //     }
        // }, 1200);
    }

    this.modifyOrder = (type, page = undefined) => {
        instance = "orders.order.modify"

        if (config.modify.stopLoss[page | 0] == null) {
            return
        }
        clear()
        order.stopLossPage = page | 0     // Global Define actualPage
        order.actualStopLossType = type // Global Define type (dans le but de rappeler les fonctions next page avec le bon "type")

        for (let i = 0; i < totalKeys; i++) {
            if (i == 0) {
                setImage(keys[i].context, 'BACK');
            } else if (i == 4) {
                setImage(keys[i].context, 'CLOSE');
            } else if (i < 13) {

                // $SD.api.setImage(keys[i].context, stopLossImages[type + '_' + i]);
                setImage(keys[i].context, type + (type == 'profit' ? '/PROFIT_' : '/SELL_') + config.modify.stopLoss[order.stopLossPage][i] + '.jpg');
            }
            else {
                // setImage(keys[11].context, 'LOT_MINUS')
                // setImage(keys[12].context, 'LOTS')
                // setImage(keys[13].context, 'LOT_PLUS')
                // setImage(keys[14].context, 'VALIDE')
                // return setImage(keys[9].context, 'RED_NEXT')
                setImage(keys[13].context, (type == 'profit' ? 'GREEN' : 'RED') + '_CUSTOM')
                if (config.modify.stopLoss[order.stopLossPage + 1] != null)
                    setImage(keys[14].context, (type == 'profit' ? 'GREEN' : 'RED') + '_NEXT')
                else
                    setImage(keys[14].context, 'NEXT_DISABLED')
                return
            }
        }
    }

    this.customStopLoss = () => {
        instance = "orders.order.modify.customStopLoss"
        clear()

        for (let i = 0; i < totalKeys; i++) {
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break
                case 4:
                    setImage(keys[i].context, 'CLOSE');
                    break
                case 6:
                    setImage(keys[i].context, 'LOT_MINUS_0.1.png')
                    break
                case 8:
                    setImage(keys[i].context, 'LOT_PLUS_0.1.png')
                    break
                case 11: // Minus Lot
                    setImage(keys[i].context, 'LOT_MINUS_1.0.png')
                    break;
                case 12: // Lots
                    setImage(keys[i].context, 'LOTS')
                    order.stopLossPips = (Math.abs(order.openPrice - (order.actualStopLossType == 'stoploss' ? order.stopLoss : order.takeProfit)) * 10000).toFixed(1)
                    $SD.api.setTitle(keys[i].context, order.stopLossPips)
                    break;
                case 13: // Add Lot 1.0
                    setImage(keys[i].context, 'LOT_PLUS_1.0.png')
                    break;
                case 14: // Valid Button
                    setImage(keys[i].context, 'VALIDE')
                    break;

            }
        }
    }

    this.closeOrder = async () => {
        console.log('sendHttp', url + '/close', 'POST');

        const closeArray = {
            id: order.id,
        }

        const fetchResponse = await fetch(url + '/close', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(closeArray)
        });
        const response = await fetchResponse.json();
        console.log(response)
        return new orders().index()
    }

    this.modifyConfirm = async () => {
        console.log('sendHttp', url + '/modify', 'POST');

        const modifyArray = {
            id: order.id,
            stopLoss: order.actualStopLossType == 'stoploss' ? order.stopLossPips : (Math.abs(order.openPrice - order.stopLoss) * 10000),
            takeProfit: order.actualStopLossType == 'stoploss' ? (Math.abs(order.openPrice - order.takeProfit) * 10000).toFixed(2) : order.stopLossPips
        }

        const fetchResponse = await fetch(url + '/modify', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifyArray)
        });
        const response = await fetchResponse.json();
        console.log(response)
        return new orders().showOrder(order.index)
    }

    this.getOrders = async () => {
        const fetchResponse = await fetch(url + '/orders')
        return await fetchResponse.json()
    }
}

function stopLoss() {       // STOP LOSS INSTANCE
    this.select = () => {       // Draw Buy/Sell Selector
        clear()
        instance = "stoploss.select"
        for (let i = 0; i < totalKeys; i++) {
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break;
                case 4:
                    setImage(keys[i].context, 'CLOSE');
                    break;
                case 6:
                    setImage(keys[i].context, 'BUY');
                    break;
                case 8:
                    setImage(keys[i].context, 'SELL');
                    break;
            }
        }
    }
    this.index = (type, edit) => {      // Draw SL List (Buy / Sell)
        clear()
        instance = "stoploss.index"

        if (edit)
            Edit = true
        else {
            Edit = false
            openPosition.symbol = symbolActive.symbol
            openPosition.type = type
        }


        for (let i = 0; i < totalKeys; i++) {
            if (i == 0) {
                setImage(keys[i].context, 'BACK');
            } else if (i == 4) {
                setImage(keys[i].context, 'CLOSE');
            } else {
                // $SD.api.setImage(keys[i].context, stopLossImages[type + '_' + i]);
                setImage(keys[i].context, 'stopLoss/' + type + '_' + config.stopLoss[i] + '.jpg');
            }
        }
    }
    this.onKeyDown = (jsn) => {
        index = indexFromCoordinates(jsn.payload.coordinates)
        if (index == 4) {   // Close button ==> HOME
            return home()

        }
        switch (instance) {
            case "stoploss.select":
                switch (index) {
                    case 0:      // Back Button --> HOME
                        home()
                        break;
                    case 8:      // --> SELL SL LIST
                        this.index("SELL")
                        break;
                    case 6:      // --> BUY SL LIST
                        this.index("BUY")
                        break;
                }
                break;

            case "stoploss.index":
                switch (index) {
                    case 0:      // Back Button --> STOPLOSS SELECT
                        this.select()
                        break;
                    default:
                        openPosition.stopLoss = config.stopLoss[index]
                        if (config.stopLoss[index] !== null)
                            if (Edit)
                                new confirmPosition().index()
                            else
                                new riskRatio().index()
                        break;
                }
                break;
        }
    }
}
function confirmPosition() {
    this.index = () => {
        clear()
        instance = "confirmPosition.index"

        console.log(openPosition)

        for (let i = 0; i < totalKeys; i++) {
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break;
                case 1:
                case 2:
                case 3:
                    setImage(keys[i].context, 'CONFIRM_' + i);
                    break;
                case 4:
                    setImage(keys[i].context, 'CLOSE');
                    break;
                case 6:
                    setImage(keys[i].context, 'symbols/' + openPosition.symbol + '_1');
                    setImage(keys[i + 1].context, openPosition.type);
                    setImage(keys[i + 2].context, 'stopLoss/' + "SELL_" + openPosition.stopLoss + '.jpg');
                    setImage(keys[i + 5].context, 'riskRatio/' + openPosition.riskRatio + '.png');
                    setImage(keys[i + 6].context, 'VALIDE');
                    setImage(keys[i + 7].context, 'profit/' + "PROFIT_" + (openPosition.takeProfit = openPosition.stopLoss * openPosition.riskRatio) + '.jpg');
                    return
            }
        }
    }
    this.onKeyDown = jsn => {
        index = indexFromCoordinates(jsn.payload.coordinates)
        if (index == 4) {       // Close button ==> HOME
            return home()

        }
        switch (index) {
            case 0:  // Back Button --> RISK RATIO LIST
                new riskRatio().index()
                break;
            case 6:
                new selectSymbol().index()
                break
            case 7:
                if (openPosition.type == "BUY") {
                    setImage(jsn.context, "SELL");
                    openPosition.type = "SELL"
                } else {
                    setImage(jsn.context, "BUY");
                    openPosition.type = "BUY"
                }
                break
            case 8:
                new stopLoss().index(openPosition.type, true)
                break
            case 11:
                new riskRatio().index(true)
                break
            case 12:
                this.openPosition()
                home()
                break
        }
    }

    this.openPosition = async () => {
        console.log('sendHttp', url + '/open', 'GET');
        const fetchResponse = await fetch(url + '/open', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(openPosition)
        });
        const response = await fetchResponse.json();
        console.log(response)

    }
}
function riskRatio() {      // RISK RATIO (RR) INSTANCE
    this.index = edit => {         // Draw RR List
        clear()
        instance = "riskratio.index"

        if (edit)
            Edit = true
        else
            Edit = false


        for (let i = 0; i < totalKeys; i++) {
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break;
                case 4:
                    setImage(keys[i].context, 'CLOSE');
                    break;
                default:
                    setImage(keys[i].context, 'riskRatio/' + config.riskRatio[i] + '.png');
                    break;
            }
        }
    }

    this.onKeyDown = jsn => {
        index = indexFromCoordinates(jsn.payload.coordinates)
        if (index == 4) {       // Close button ==> HOME
            return home()

        }
        switch (index) {
            case 0:  // Back Button --> STOPLOSS LIST
                if (Edit)
                    new confirmPosition().index()
                else
                    new stopLoss().index(openPosition.type)
                break;
            default:
                console.log(config.riskRatio[index])
                if (config.riskRatio[index] !== null) {
                    openPosition.riskRatio = config.riskRatio[index]
                    new confirmPosition().index()
                }
                break;
        }
    }
}
function selectSymbol() {
    this.index = () => {
        clear()
        instance = "selectSymbol.index"

        for (let i = 0; i < totalKeys; i++) {
            switch (i) {
                case 0:
                    setImage(keys[i].context, 'BACK');
                    break;
                case 4:
                    setImage(keys[i].context, 'CLOSE');
                    break;
                default:
                    setImage(keys[i].context, 'symbols/' + symbols[i - 5] + '_1');
                    break;
            }
        }
    }
    this.onKeyDown = jsn => {
        index = indexFromCoordinates(jsn.payload.coordinates)

        switch (index) {
            case 0:  // Back Button --> STOPLOSS LIST
                new confirmPosition().index()
                break;
            case 4: // Close button ==> HOME
                return home()

            default:
                console.log(symbols[index - 5])
                if (symbols[index - 5] != null) {
                    openPosition.symbol = symbols[index - 5]
                    new confirmPosition().index()
                }
                break;
        }
    }
}

const setImage = (context, url) => {
    if (!url.includes('.'))
        ext = '.png'
    else {
        ext = ''
    }
    let image = new Image();
    image.src = 'images/' + url + ext;
    image.onload = () => {
        img = getBase64Image(image)
        $SD.api.setImage(context, img)
    }
}

const clear = () => {
    for (let i = 0; i < totalKeys; i++) {
        $SD.api.setImage(keys[i].context, null);
        $SD.api.setTitle(keys[i].context, '');
    }
}

const indexFromCoordinates = coordinates => {
    return Number(coordinates.row) * mCols + Number(coordinates.column);
};
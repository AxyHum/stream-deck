const FIXEDDECIMALPLACES = SETTINGS.fixeddecimalplaces || 2;
const MAXLEVELS = SETTINGS.maxlevels || 20;

class ELGEventEmitter {
    constructor(id, debug = false) {
        const eventList = new Map();

        this.on = (name, fn) => {
            if (!eventList.has(name)) eventList.set(name, this.pubSub());
            return eventList.get(name).sub(fn);
        };

        this.has = name => eventList.has(name);
        this.emit = (name, data) => eventList.has(name) && eventList.get(name).pub(data);
        this.dbg = debug ? console.log.bind(window.console, id || "") : () => { };
    }

    pubSub() {
        const subscribers = new Set();

        const sub = fn => {
            subscribers.add(fn);
            return () => {
                subscribers.delete(fn);
            };
        };

        const pub = data => subscribers.forEach(fn => fn(data));
        return Object.freeze({ pub, sub });
    }
}

class FlashGame extends ELGEventEmitter {
    constructor(inDeviceInfo, inCallback, inDebug = false) {
        super(`[FlashGame] ${inDeviceInfo.id} :`, inDebug);
        this.dbg("FLASHGAME", inDeviceInfo);
        this.id = inDeviceInfo.id;
        this.currentKeyIndex = -1;
        const mCols = inDeviceInfo.size.columns || 5;
        const mRows = inDeviceInfo.size.rows || 3;
        this.totalKeysNeeded = mRows * mCols;
        this.callback = inCallback;
        this.keys = [];
        this.level = 0;
        this.timerKeyIndex = 0;
        this.timerKeyContext = null;
        this.timer = 0;
        this.gameTime = 0;
        this.isGamePlaying = false;
        this.timerListener = null;
        this.sd = $SD;
        // Elgato Gaming Logo
        this.hiliteKey = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAUUElEQVR4Xu2dddBWRRTGD3ZhNwbm2IGOrSgWBmJhAXYHdnd3K2KjIhZi4CgqdrdiIYqBhYrYnfPbmeu8fvPG3d2z9+693z0z73x/fDd2zz539+w5zznbQUT+kUoqDThqoEMFIEfNVbcZDVQAqoDgpYEKQF7qq26uAFRhwEsDFYC81FfdXAGowoCXBioAeamvurkCUIUBLw1UAPJSX3VzBaAKA14aqADkpb7q5gpAFQa8NFAByEt91c3tHkCTTDKJdO7cWRZaaCGZaaaZZJpppvnv17FjR5lyyinlt99+k19++UV+/vln8/fLL7+UTz75RD7++GPz99dff223SGpXAJprrrmka9eusvzyyxvALLzwwjLffPMJIPKRzz77TF599VXze+WVV+Tll1+W999/3+eRhbm31ADq1KmTdOvWTdZcc00DnAUWWCCzgfnoo49kxIgR8uCDD8pDDz0k48ePz+zdWb6odACaccYZZcstt5TevXvL6quvLh060MV85e+//5bHHntMBg8eLLfffrt88803+TZI8e2lABBL0GabbSZ9+vSR7t27y2STTaaoIt1H/f777zJ8+HAZMGCA+fvPP8UmhBYaQFNNNZXsuuuucvDBB8s888yjO9IZPG3UqFFy0UUXyXXXXWcM9CJKIQHEMrXPPvtIv379ZOaZZy6i3v/XZpa0s88+Wy688MLCAalQAGJpYrY56qijzFa7bDJu3Dg56aST5KqrrpI//vijEN0rDICwbZju2X6XXd577z3Ze++9zQ4udokeQDj5LrjgAunZs2fsulRv36BBg+Sggw6Sr776Sv3ZWg+MGkC77LKLmXUwlturfP3117LffvvJTTfdFKUKogTQtNNOa7a52267bW5KI2Txww8/GKN2iimmMCDm5+u1du0QBvYhhxwif/75p+sjgtwXHYAIM9x8883Bvcbff/+9vPTSS/LOO+/89xs9erTwxQOcv/76q67CiY/hMuA377zzypJLLildunSRpZde2sTNQgrOyF69ekW1pEUFoD322MMsWSEcgcwkTz75pDzyyCPy8MMPG/A0AokLCCaeeGIDovXXX9/8VlllFZl00kldHtX0HgK4m2++ubz44ovqz3Z5YDQAOvnkk+WYY45x6UPDewAIcagbbrhB7rjjDvnpp59Un9/sYSzDDHTfvn1NLG6iiSZSezfR/z333NM4IPOW3AHEl3v55ZcLBrOWfPrpp8Ypxy7m888/13qs83NgAey+++6y1157qTo+L7nkEjnwwANztYtyBRA2wy233CI9evRwHpzaG8eMGSNnnnmm+TKJOcUm9HfHHXeUQw891NBINGTo0KGyzTbb5OZ4zA1AKPP+++83EXNfgdR1xBFHGONb067xbVej+9nVHXbYYabNGoY3y/PWW2+dC4hyARBbYTq98cYbe40R7v7zzz/fuP+ztG+8Gl1zM07S8847zzAJfOXOO++UrbbaKnMQZQ4g+DnXXnut7LDDDl46Y0uLTfH22297PSeGm9m1sfuEIekjLN0skVlK5gAi6oxDzFVYoo4//ng5/fTTBaJWWQTXxQknnCBHHnmkV5fQDTNyVpIpgA444ACz5LgKts52220nTzzxhOsjor+PZYgZ2id8s/322xvXRRaSGYBwrLHsuIYCcADihcVTXHZZdtll5a677pK5557bqavsQFddddVMnI2ZAIh0GbIVXBVy2223GYcc6TXtRWabbTbDnwYILkJWCCGW7777zuX21PcEBxBG87Bhw2SjjTZK3ajaC3GW7b///qWyd9IqArsIJ6urYTxkyBAza4eU4ADCaXbWWWc59YHwxnHHHed0b1lu4gO8/vrrTcKAixBfvOKKK1xuTXVPUAAttthiJtnOJah46aWXyr777puqE2W/CP3dc889st5661l3FdYB40B4J4QEBRBR77XWWsu63YQ32G2VaZturYQ2N8ABf/TRR2W55ZazfhRORg1nZb0XBwMQALjxxhutO0s254Ybbpi5R9W6oTncMOuss8rTTz/txJXaYosthLiZtgQBEFQGcp7mmGMOq/bi51lmmWWCbdVRIhkdeGz79++faxTbSjE1F5Oe/dRTTwm7NBuBR0RCgvZONgiAcBbiNLQRqJrkr/OFaQt+FdrE8xOBiYhHHNuiaLL22mubvHtbob/nnnuu7W1Nr1cHENwXaBW2rEKi04Q5NIWv9NRTT5WddtqpIaGL1BlyzV5//XXNVwd/1pVXXmmycm1kwoQJMv/886v6htQBRAoOfhsbwdheZ5111PLEJ598cjMDHn300QKHuZUQXyOZD5cBtX+KINNNN528+eabQgUSGyGGyDKuJaoAmmWWWeTDDz+0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";
        this.settings = {
            maxLevels: MAXLEVELS
        };

        this.isLocked = false;

        this.indexFromCoordinates = coordinates => {
            return Number(coordinates.row) * mCols + Number(coordinates.column);
        };

        this.coordinatesFromIndex = idx => {
            if (idx > 0 && idx < mRows * mCols) {
                return { column: idx % mCols, row: Math.floor(idx / mCols) };
            }
            return { column: 0, row: 0 };
        };

        this.setTimerKeyContext = (ctx) => {
            this.timerKeyIndex = this.indexFromCoordinates({ row: 0, column: mCols - 1 });
            this.timerKeyContext = ctx || this.keys[this.timerKeyIndex].context;
            console.log(this.timerKeyContext)
        }

        this.initKeys = () => {
            this.keys = new Array(mRows * mCols).fill(0);
        }

        // this.initKeys();


    }

    reset(hideKey) {
        this.dbg("reset");
        this.isLocked = false;
        this.level = 0;
        this.currentKeyIndex = -1;
        this.unhighlightKeys();
        this.timer = Date.now();
    }

    setSettings() {
        const keys = Object.keys(this);
        console.log("keys", keys);
        Object.entries(obj).forEach(o => {
            const k = o[0];
            if (keys.includes(k)) {
                console.log("Keys include", k);
                this[k] = o[1];
            }
        });
    }

    getSettings() {
        const keys = Object.entries(this);
        keys.forEach(e => console.log(e[0], "=", e[1]));
    }

    setImage(context, img) {
        this.sd.api.setImage(context, img);
    }

    setTitle(context, s) {
        this.sd.api.setTitle(context, s);
    }

    highlightRandomKey() {
        let newKeyIndex = Math.floor(Math.random() * this.keys.length);
        while (this.currentKeyIndex === newKeyIndex || this.timerKeyIndex === newKeyIndex) {
            newKeyIndex = Math.floor(Math.random() * this.keys.length);
        }
        this.unhighlightKey(this.currentKeyIndex);
        this.currentKeyIndex = newKeyIndex;
        console.log(this.hiliteKey)
        this.setImage(this.keys[this.currentKeyIndex].context, this.hiliteKey);
    }

    unhighlightKey(idx) {
        if (this.isValidIndex(idx)) {
            this.setImage(this.keys[idx].context, null);
        }
    }

    unhighlightKeys(anyKeyButThisIndex) {
        this.dbg("unhighlightKeys");
        const totalKeys = this.keys.length;
        for (let i = 0; i < totalKeys; i++) {

            if (i !== this.currentKeyIndex) {
                this.setImage(this.keys[i].context, null);
            }
            if (i != this.timerKeyIndex) {
                this.setTitle(this.keys[i].context, '');
            }

        }
    }

    nextLevel() {
        this.level++;
        this.dbg(`nextLevel: ${this.level}`);

        if (this.level <= this.settings.maxLevels) {
            this.highlightRandomKey();
        } else {
            this.stopGame();
        }
    }

    setLevels(numLevels) {
        this.settings.maxLevels = numLevels;
    }

    resetTimer() {
        this.timer = Date.now();
        this.setTitle(this.timerKeyContext, `0.0`);
    }

    updateTimer() {
        if (this.isGamePlaying === true) {
            this.gameTime = Date.now();
            const s = (this.gameTime - this.timer) / 1000.0;
            this.setTitle(this.timerKeyContext, `${s.toFixed(FIXEDDECIMALPLACES)}`);
        }
    }


    showInfo() {
        this.setTitle(this.keys[0].context, "press any\nkey to\nstart game".lox());
    }

    hideInfo() {
        this.setTitle(this.keys[0].context, "");
    }

    startGame() {
        this.dbg("startGame");
        // this.prepareGame();
        // setTimeout(() => {
        //     this.reset();
        //     this.isGamePlaying = true;
        //     this.timerListener = this.sd.on("timerUpdate", () => {
        //         this.updateTimer();
        //     })
        //     this.nextLevel();
        // }, 500);
        //this.reset();
        this.resetTimer();
        this.isGamePlaying = true;
        this.timerListener = this.sd.on("timerUpdate", () => {
            this.updateTimer();
        })
        // this.nextLevel();
    }

    prepareGame() {
        this.unlock();
        this.reset();
        this.hideInfo();
        this.resetTimer();
        this.nextLevel();
    }

    stopGame() {
        this.dbg("stopGame");
        this.updateTimer();
        this.isGamePlaying = false;
        if (this.timerListener) {
            this.timerListener();
        }

        const result = { time: this.gameTime - this.timer };
        this.reset(true);

        this.emit("gameover", result);
        console.log('gameover')
        this.lock();

        if (this.callback) {
            this.callback(this.id, result);
        }
    }

    willAppear(jsn) {

        this.keys[this.getIndex(jsn)] = jsn;
        // this.dbg("willAppear", this.keys.length, this.totalKeysNeeded, this.keys.includes(undefined));

        if (this.keys.length === this.totalKeysNeeded) {
            if (!this.keys.includes(undefined)) {
                // this.dbg("willAppear::resetting...");
                this.reset();
                this.setTimerKeyContext();
                this.emit("initialized");
                this.emit("locked");
                this.showInfo();
            }
        }

    }

    willDisappear(jsn) {
        if (jsn && jsn.payload) {
            const idx = this.getIndex(jsn);
            // this.dbg("willDisappear", idx, this.keys.length);
            this.keys[this.getIndex(jsn)] = undefined;
        }
    }

    keyDown(jsn) {
        // this.dbg(`keyDown:locked: ${this.isLocked}`);
        // if (this.isLocked) return;
        this.dbg(`keyDown:locked:${this.isLocked}  playing:${this.isGamePlaying}  currentKeyIndex:${this.currentKeyIndex}  level:${this.level} `);
        if (this.isLocked && !this.currentKeyIndex == -1) return;

        const idx = this.getIndex(jsn);
        if (idx === this.currentKeyIndex) {
            if (!this.isGamePlaying) {
                this.startGame();
            }
            this.nextLevel();
            return;
            // } else if (0 === this.level) {
            //     this.startGame();
        }
        if (this.isLocked && !this.currentKeyIndex == -1) {
            return;
        } else if (0 === this.level) {
            // this.startGame();
            this.prepareGame();
        }
    }

    // keyDown(jsn) {
    //     this.dbg(`keyDown:locked: ${this.isLocked}`);
    //     if (this.isLocked) return;
    //     const idx = this.getIndex(jsn);
    //     if (idx === this.currentKeyIndex) {
    //         if (!this.isGamePlaying) {
    //             this.startGame();
    //         }
    //         this.nextLevel();
    //         // } else if (0 === this.level) {
    //         //     this.startGame();
    //     }
    // }

    keyUp(jsn) {
        // this.dbg(`keyUp:locked: ${this.isLocked} playing: ${this.isGamePlaying} currentKeyIndex: ${this.currentKeyIndex} level: ${this.level} `);
        // if (this.isLocked && !this.currentKeyIndex == -1) return;
        // if (0 === this.level) {
        //     // this.startGame();
        //     this.prepareGame();
        // }
    }

    inWallPaperMode() {
        return this.isLocked && this.currentKeyIndex == -1;
    }

    getIndex(jsn) {
        if (jsn.payload) {
            return this.indexFromCoordinates(jsn.payload.coordinates);
        }
        return { row: 0, column: 0 };
    }

    isValidIndex(idx) {
        return idx >= 0 && idx < this.keys.length && this.keys[idx];
    }

    lock() {
        this.isLocked = true;
        this.emit("locked");
    }

    unlock() {
        this.isLocked = false;
        this.emit("unlocked");
    }
}


class Test {
    constructor() {
        this.oneTest = 0;
        this.twoTest = 0;
    }

    log() {
        console.log(
            {
                oneTest: this.oneTest,
                twoTest: this.twoTest
            },
            Object.keys(this)
        );
    }

    set(obj) {
        const keys = Object.keys(this);
        console.log("keys", keys);
        Object.entries(obj).forEach(o => {
            const k = o[0];
            if (keys.includes(k)) {
                console.log("Keys include", k);
                this[k] = o[1];
            }
        });
    }

    test() {
        const o = {
            twoTest: "Hello"
        };
        this.set(o);
        console.log(this);
        console.log(Object.entries(this));
    }
}

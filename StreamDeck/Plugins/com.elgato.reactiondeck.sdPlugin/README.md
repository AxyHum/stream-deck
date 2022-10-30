# streamdeck-reactiondeck

Reaction Game for **Elgato Stream Deck** V 4.4. or newer.

It shows a series of images on random keys and you must try to hit that image as quickly as possible.

Your time to finish all levels is shown in the top right key of your Stream Deck.

After the game is over, a series of wallpaper is shown.
Hit any key to show the first item of the game. Hitting the key with the item will start the game.

### Settings

You can tweak a couple of things in settings.js 

```json
let SETTINGS = {
    maxlevels: 4,
    fixeddecimalplaces: 2
}
```

`maxlevels` sets the number of levels (rounds) the game plays

`fixeddecimalplaces` sets the number of decimal places shown in the timer at the top right button of your StreamDeck
/**
 *  Data:
 *  Interior ID: 275201
 *  Interior Name: vw_casino_main
 *  Inside Position: 1100.000, 220.000, -50.000
 *  Outside Position: 24.13, 47.54, 81.11
 */

require('./casino/luckywheel.js');
require('./casino/penthouse.js');
require('./casino/walls.js');
require('./casino/roulette.js')
require('./casino/seating.js');

const casinoIPL = "vw_casino_main";

mp.events.add("playerReady", () => {
    mp.gui.chat.push("Client Casino script Ready");
});

//  Casino Entrance
const casinoEntranceColshape = mp.colshapes.newSphere(935.20, 46.42, 80, 2);
mp.markers.new(1, new mp.Vector3(935.20, 46.42, 80), 2, {
    color: [255, 242, 0, 100]
});
mp.labels.new(`Casino Entrance`, new mp.Vector3(935.20, 46.42, 81.5), {
    font: 2
});

//  Casino Exit
const casinoExitColshape = mp.colshapes.newSphere(1089.79, 207.75, -50, 2);
mp.markers.new(1, new mp.Vector3(1089.79, 207.75, -50), 2, {
    color: [255, 242, 0, 100]
});
mp.labels.new(`Casino Exit`, new mp.Vector3(1089.79, 207.75, -48.5), {
    font: 2
});

//  Events
mp.events.add("playerEnterColshape", (shape) => {
    if(shape === casinoEntranceColshape){
        mp.events.call("client:casino:enter");
    } else if(shape === casinoExitColshape){
        mp.events.callRemote("casino:exit");
        mp.events.call("client:casino:exit");
    }
});

mp.events.add("client:casino:enter", async () => {
    mp.game.streaming.requestIpl(casinoIPL);

    for(let i = 0; mp.game.streaming.isIplActive(casinoIPL) === 0 && i < 15; i++){
        if(i === 14) return mp.game.graphics.notify('~r~Casino IPL failed to load, try again.');
        await mp.game.waitAsync(100);
    }

    mp.events.callRemote("casino:enter");
});

mp.events.add("client:casino:exit", () => {
    mp.game.streaming.removeIpl(casinoIPL);
})
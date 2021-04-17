mp.events.add("playerReady", (player) => {
    player.outputChatBox("Server casino script ready");
    player.position = new mp.Vector3(924.13, 47.54, 81.11);
});

mp.events.add("casino:enter", (player) => {
    player.position = new mp.Vector3(1091.05, 211.31, -49);
});

mp.events.add("casino:exit", (player) => {
    player.position = new mp.Vector3(932.08, 44.32, 81.5);
})

mp.events.add("penthouse:enter", (player) => {
    player.position = new mp.Vector3(978.33, 57.98, 116.16);
});

mp.events.add("penthouse:exit", (player) => {
    player.position = new mp.Vector3(932.08, 44.32, 81.5);
});


//  Debug commands and events below
mp.events.addCommand("casino", (player) => {
    // player.position = new mp.Vector3(1089.90, 208.60, -49);
    player.position = new mp.Vector3(1109.3212890625, 224.29421997070312, -49.84075164794922)
})

mp.events.addCommand('penthouse', (player) => {
    player.position = new mp.Vector3(976.636, 70.295, 116.164)
    player.call('casino:loadPenthouse');
})

mp.events.addCommand("outside", (player) => {
    player.position = new mp.Vector3(924.13, 47.54, 81.11);
})

mp.events.addCommand('pos', (player) => {
    console.log(`Pos: ${player.position}`)
})

mp.events.addCommand('load', (player, _, feature, value) => {
    player.call("penthouse:updatePenthouseFeature", [feature, value]);
});

mp.events.addCommand('unload', (player, _, feature) => {
    player.call("casino:unloadPenthouse");
});
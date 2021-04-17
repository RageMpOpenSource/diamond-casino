require('./casino');

//  Debug commands and events below
mp.events.addCommand('goto', (player, _, x, y, z) => {
    player.position = new mp.Vector3(parseInt(x), parseInt(y), parseInt(z));
})

mp.events.addCommand('ipl', (player, _, ipl) => {
    player.call('loadipl', [ipl])
});

mp.events.addCommand("model", (player, _, model) => {
    player.model = mp.joaat(model)
})

mp.events.addCommand("ped", (player) => {
    player.call("createpd");
})

mp.events.addCommand("c", (player, _, num) => {
    player.call("clothes", [num])
})

mp.events.addCommand('r2', (player) => {
    player.call('loadPeds');
})

mp.events.addCommand('r3', (player) => {
    player.call('destroyRouletteTables');
})

mp.events.addCommand('r', (player) => {
    player.position = new mp.Vector3(1148.934326171875,260.6101379394531,-50.84080505371094)
})

mp.events.addCommand('text', (player, _, num) => {
    player.call('text', [num])
})
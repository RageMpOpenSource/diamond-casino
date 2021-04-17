require('./casino');

mp.events.add('loadipl', (ipl) => {
    mp.game.streaming.requestIpl(ipl);
    mp.gui.chat.push(`IPL Requested: ${ipl}`)
})
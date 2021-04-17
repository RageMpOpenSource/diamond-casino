let enabled = false;
let renderTarget;

const SCREEN_DIAMONDS = "CASINO_DIA_PL";
const SCREEN_SKULLS = "CASINO_HLW_PL";
const SCREEN_SNOW = "CASINO_SNWFLK_PL";
const SCREEN_WIN = "CASINO_WIN_PL";

const targetName = "casinoscreen_01";
const targetModel = mp.game.joaat('vw_vwint01_video_overlay');
const textureDict = "Prop_Screen_Vinewood";
const textureName = "BG_Wall_Colour_4x4";

mp.events.add("casino:loadVideoWall", async () => {
    mp.game.graphics.requestStreamedTextureDict(textureDict, false);

    for(let i = 0; mp.game.graphics.hasStreamedTextureDictLoaded(textureDict) === 0 && i < 15; i++){
        if(i === 14) return mp.game.graphics.notify('~r~Error loading Casino video walls.');
        await mp.game.waitAsync(100);
    }

    mp.game.ui.registerNamedRendertarget(targetName, false);
    mp.game.ui.linkNamedRendertarget(targetModel);

    //  SET_TV_CHANNEL_PLAYLIST
    mp.game.invoke("0xF7B38B8305F1FE8B", 0, SCREEN_DIAMONDS, true)

    mp.game.graphics.setTvAudioFrontend(true);
    mp.game.graphics.setTvVolume(-100);
    mp.game.graphics.setTvChannel(0);

    renderTarget = mp.game.ui.getNamedRendertargetRenderId(targetName);

    enabled = true;
});

mp.events.add("casino:unloadVideoWall", () => {
    mp.game.ui.releaseNamedRendertarget(renderTarget);
    mp.game.ui.isNamedRendertargetRegistered(targetName);
    mp.game.graphics.setStreamedTextureDictAsNoLongerNeeded(textureDict);
    mp.game.graphics.setTvChannel(-1);
    enabled = false;
});

mp.events.add('render', function () {
    if (enabled) {
        mp.game.ui.setTextRenderId(renderTarget);
        
        mp.game.invoke("0x61BB1D9B3A95D802", 4) //  SET_SCRIPT_GFX_DRAW_ORDER
        mp.game.invoke("0xC6372ECD45D73BCD", true); //  SET_SCRIPT_GFX_DRAW_BEHIND_PAUSEMENU
        //  _DRAW_INTERACTIVE_SPRITE
        mp.game.invoke('0x2BC54A8188768488', textureDict, textureName, 0.25, 0.5, 0.5, 1.0, 0.0, 255, 255, 255, 255);
        mp.game.graphics.drawTvChannel(0.5, 0.5, 1.0, 1.0, 0.0, 255, 255, 255, 255);
        mp.game.ui.setTextRenderId(1);
    }
});

mp.events.add("client:casino:enter", () => {
    mp.events.call("casino:loadVideoWall");
});

mp.events.add("client:casino:exit", () => {
    mp.events.call("casino:unloadVideoWall");
})
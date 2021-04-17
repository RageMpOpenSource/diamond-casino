/**
 * Notes:
 *  - Pressing F3/loading libs first go won't do the animation, pressing it again will. Only occurs
 *      on first loading into the game
 *  - Need to unload the lucky wheel
 *  - Need to limit when the player can do the lucky wheel animation/Distance check when pressed
 */


/**
 * Animations
 * - Enter_to_ArmRaisedIDLE
 * - ArmRaisedIDLE
 * - ArmRaisedIDLE_to_SpinReadyIDLE
 * - SpinReadyIDLE
 * - SpinStart_ArmRaisedIDLE_to_BaseIDLE
 * - spinreadyidle_to_spinningidle_low
 * - spinreadyidle_to_spinningidle_med
 * - spinreadyidle_to_spinningidle_high
 * - SpinningIDLE_Low
 * - SpinningIDLE_Med
 * - SpinningIDLE_High
 * - Win
 * - Win_Big
 * - Win_Huge
 * - Exit_to_Standing
 * - SpinReadyIDLE_to_ArmRaisedIDLE
 * 
 * Lucky Wheel anims
 * - spinningwheel_low_effort_01 [Up to 20]
 * - spinningwheel_med_effort_01 [Up to 20]
 * - spinningwheel_high_effort_01 [Up to 20]
 */

let animationLib = null;
const luckyWheelHash = mp.game.joaat("vw_prop_vw_luckywheel_02a")
let luckyWheelObject;

async function spinLuckyWheel(){
    mp.gui.chat.push("Start lucky wheel");
    //  Load the animation lib
    await loadLuckyWheelAnimLib();

    if(mp.game.streaming.hasAnimDictLoaded(animationLib)){
        let playerWheelPosition = new mp.Vector3(1109.55, 228.88, -49.64)
        // mp.gui.chat.push("Moving to position");
        mp.players.local.taskGoStraightToCoord(playerWheelPosition.x, playerWheelPosition.y, playerWheelPosition.z,  1.0,  -1,  312.2,  0.0);
        //  Wait until they're in position to play animation

        let inPosition = false;
        while(!inPosition){
            await mp.game.waitAsync(500);
            let coords = mp.players.local.position;
            let wheelDistance = mp.game.system.vdist(coords.x, coords.y, coords.z, playerWheelPosition.x, playerWheelPosition.y, playerWheelPosition.z);
            // mp.gui.chat.push(`Dist: ${wheelDistance}`)
            if(wheelDistance <= 0.015){
                inPosition = true;
                // mp.gui.chat.push("Player in position");
            }
        }

        mp.players.local.taskPlayAnim(animationLib, "enter_right_to_baseidle", 8.0, -8.0, -1, 0, 0, false, false, false)
        
        while(!mp.players.local.isPlayingAnim(animationLib, "enter_right_to_baseidle", 3)){
            mp.gui.chat.push("playing 1")
            await mp.game.waitAsync(100);
        }

        mp.players.local.taskPlayAnim(animationLib, "enter_to_armraisedidle", 8.0, -8.0, -1, 0, 0, false, false, false);

        while(!mp.players.local.isPlayingAnim(animationLib, "enter_to_armraisedidle", 3)){
            mp.gui.chat.push("playing 2")
            await mp.game.waitAsync(100);
        }

        mp.players.local.taskPlayAnim(animationLib, 'ArmRaisedIDLE_to_SpinReadyIDLE', 8.0, -8.0, -1, 0, 0, false, false, false);

        // await mp.game.waitAsync(1000);

        mp.players.local.taskPlayAnim(animationLib, 'armraisedidle_to_spinningidle_high', 8.0, -8.0, -1, 0, 0, false, false, false);
        mp.game.audio.playSoundFromCoord(-1, "Spin_Start", 1109.55, 228.88, -49.64, "dlc_vw_casino_lucky_wheel_sounds", true, 0, false);

        while(!mp.players.local.isPlayingAnim(animationLib, "armraisedidle_to_spinningidle_high", 3)){
            mp.gui.chat.push("playing 3")
            await mp.game.waitAsync(100);
        }

        //  This below destroys the entire animation sequence
        // await mp.game.waitAsync(1000);

        // mp.players.local.taskPlayAnim(animationLib, 'SpinningIDLE_High', 8.0, -8.0, -1, 0, 0, false, false, false);

        // while(!mp.players.local.isPlayingAnim(animationLib, 'SpinningIDLE_High', 3)){
        //     mp.gui.chat.push("playing 4")
        //     await mp.game.waitAsync(100);
        // }

        //  This needs to come after
        //mp.players.local.taskPlayAnim(animationLib, 'SpinningIDLE_High', 8.0, -8.0, -1, 0, 0, false, false, false);
        // mp.players.local.taskPlayAnim(animationLib, 'Win_Big', 8.0, -8.0, -1, 0, 0, false, false, false);

        //  Testing
        luckyWheelObject.setRotation(0.0, 0.0, 0.0, 2, true);
        //  This is the animation for the ending of the wheel maybe
        luckyWheelObject.playAnim("spinningwheel_high_effort_20", animationLib, 1000.0, false, true, false, 0.0, 2);
        luckyWheelObject.forceAiAndAnimationUpdate();

        //  This isn't working, breaking the while loop manually
        while(mp.game.audio.hasSoundFinished(-1)){
            await mp.game.waitAsync(10000);
            break;
            mp.gui.chat.push("Waiting on Sound" + mp.game.audio.hasSoundFinished(-1) + " " + -1)
        }
        // mp.gui.chat.push("Sound Done")

        mp.game.audio.playSoundFromCoord(-1, "Win", 1109.55, 228.88, -49.64, "dlc_vw_casino_lucky_wheel_sounds", true, 0, false);

        mp.game.entity.createModelHide(1111.052, 229.849, -50.641, 5, mp.game.joaat("vw_prop_vw_jackpot_on"), false);
        mp.game.entity.createModelHide(1111.052, 229.849, -50.641, 2, mp.game.joaat("vw_prop_vw_luckylight_on"), false);

        mp.gui.chat.push("Done")
    }
}

//  Functions
async function loadLuckyWheelAnimLib(){
    if(mp.players.local.model === mp.game.joaat("mp_m_freemode_01")){
        animationLib = "anim_casino_a@amb@casino@games@lucky7wheel@male"
    } else if(mp.players.local.model === mp.game.joaat("mp_f_freemode_01")) {
        animationLib = "anim_casino_a@amb@casino@games@lucky7wheel@female"
    } else {
        return mp.gui.chat.push("You must be using a freemode character model");
    }

    mp.game.streaming.requestAnimDict(animationLib);

    for(let i = 0; mp.game.streaming.hasAnimDictLoaded(animationLib) === 0 && i < 15; i++){
        if(i === 14) return mp.game.graphics.notify('~r~Error loading Lucky Wheel spin animation.');
        mp.gui.chat.push("loading wheel spin");
        await mp.game.waitAsync(100);
    }

    mp.gui.chat.push("Anim loaded.")
}

async function loadLuckyWheel(){
    //  Load Wheel
    mp.game.streaming.requestModel(luckyWheelHash);

    while(!mp.game.streaming.hasModelLoaded(luckyWheelHash)){
        await mp.game.waitAsync(100);
    }

    luckyWheelObject = mp.objects.new(luckyWheelHash, new mp.Vector3(1111.052, 229.8579, -49.133));
    
    //  Unload model from memory
    mp.game.streaming.setModelAsNoLongerNeeded(luckyWheelHash);
}

mp.events.add("client:casino:enter", () => {
    loadLuckyWheel();

    //  F3
    mp.keys.bind(0x72, true, luckyWheelBind);
});

mp.events.add("client:casino:exit", () => {
    //  Unload lucky wheel
    if(mp.objects.exists(luckyWheelObject)) luckyWheelObject.destroy();
    //  Unload anim dict
    mp.game.streaming.removeAnimDict(animationLib);
    //  Unbind key
    mp.keys.unbind(0x72, true, luckyWheelBind);
})

function luckyWheelBind(){
    spinLuckyWheel();
}
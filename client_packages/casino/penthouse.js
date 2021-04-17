/**
 *  Vector3: 976.636, 70.295, 115.164
 *  IPL: vw_casino_penthouse
 *  Notes:
 *      This is missing the dealer you would have inside your penthouse
 * 
 * 
 *  Settings:
 *      Arcade: Types of arcade machines in the bar area
 *          - Set_Pent_Arcade_Modern
 *          - Set_Pent_Arcade_Retro
 *      Party: Wall Lights + Balloons inside the bar area
 *          - set_pent_bar_party_0  - Pink/Redish
 *          - set_pent_bar_party_1  - Black and yellow
 *          - set_pent_bar_party_2  - Blue and White
 *          - set_pent_bar_party_after - Trashed bar areat
 *      Light: Lights around the bar
 *          - set_pent_bar_light_0 - Yellow
 *          - set_pent_bar_light_01 - Pink/Redish
 *          - set_pent_bar_light_02 - Blue and White
 *      Blockers: Stops you from entering certain areas
 *          - Set_Pent_CINE_BLOCKER (Cinema Room)
 *          - Set_Pent_SPA_BLOCKER (Spa Behind the bar)
 *          - Set_Pent_BAR_BLOCKER (Bar, but it doesn't block the door from the Spa area)
 *          - Set_Pent_OFFICE_BLOCKER (Office outside lounge area)
 *          - Set_Pent_LOUNGE_BLOCKER (Blocks lounge door from penthouse area)
 *          - Set_Pent_GUEST_BLOCKER (Guest room attached to penthouse)
 *      Clutter: Adds random items on tables
 *          - Set_Pent_Bar_Clutter (Random items on bar and tables)
 *          - Set_Pent_Clutter_01 (Adds clutter throughout the penthouse, 1, 2, 3 all just adds different types of clutter so loading all 3 makes the whole place messy)
 *          - Set_Pent_Clutter_02
 *          - Set_Pent_Clutter_03
 *      Dealer: Adds a divider into the lounge area, I assume something else needs to be loaded here
 *          - Set_Pent_NoDealer (Divider is closed)
 *          - Set_Pent_Dealer   (Divider is open)
 *      Spa Bar Open:
 *          Adds a door to the spa area from the bar side. None of these loaded means no door
 *          - Set_Pent_Spa_Bar_Open (Doors open)
 *          - Set_Pent_Spa_Bar_Closed (Doors closed)
 *      Media Bar:
 *          Adds a door inside the media room from the bar side
 *          - Set_Pent_Media_Bar_Closed (Doors closed)
 *          - Set_Pent_Media_Bar_Open   (Doors open)
 *      Pattern:
 *          Patterns on the carpet
 *          - Set_Pent_Pattern_01 (Pop)
 *          - Set_Pent_Pattern_02 
 *          - Set_Pent_Pattern_03
 *          - Set_Pent_Pattern_04
 *          - Set_Pent_Pattern_05
 *          - Set_Pent_Pattern_06
 *          - Set_Pent_Pattern_07
 *          - Set_Pent_Pattern_08
 *          - Set_Pent_Pattern_09
 *      Tint Shell: The whole interior, color is controlled by _SET_INTERIOR_PROP_COLOR
 *          - Set_Pent_Tint_Shell
 *              - 0 : Crazy random colors
 *              - 1 : Pink (Timeless)
 *              - 2 : Hot pink and Blue (Vibrant)
 *              - 3 : Dark blue (Sharp)
 */

let interiorId = 0;

//  Penthouse options, used to load your penthouse
const penthouseCustomisation = {
    "tint_color": 3,
    "interior": "Set_Pent_Tint_Shell",
    "pattern": "Set_Pent_Pattern_01",
    "spa": "Set_Pent_Spa_Bar_Open",
    "media_bar": "Set_Pent_Media_Bar_Open",
    "dealer": "Set_Pent_Dealer",
    "arcade": "Set_Pent_Arcade_Retro",
    "bar_clutter": "",
    "clutter_variation": "",
    "light": "set_pent_bar_light_02",
    "party": "set_pent_bar_party_2"
}

const penthouseIPL = "vw_casino_penthouse";

//  Penthouse Entrance
const penthouseEntranceColshape = mp.colshapes.newSphere(929.76, 38.89, 80, 2);
mp.markers.new(1, new mp.Vector3(929.76, 38.89, 80), 2, {
    color: [255, 242, 0, 100]
});
mp.labels.new(`Penthouse Entrance`, new mp.Vector3(929.76, 38.89, 81.5), {
    font: 2
});

//  Penthouse Exit
const penthouseExitColshape = mp.colshapes.newSphere(980.19, 57.01, 115, 1.5);
mp.markers.new(1, new mp.Vector3(980.19, 57.01, 115), 1.5, {
    color: [255, 242, 0, 100]
});
mp.labels.new(`Penthouse Exit`, new mp.Vector3(980.19, 57.01, 117), {
    font: 2
});

//  Events
mp.events.add("playerEnterColshape", (shape) => {
    if(shape === penthouseEntranceColshape){
        mp.events.call("client:penthouse:enter");
    } else if(shape === penthouseExitColshape){
        mp.events.callRemote("penthouse:exit");
        mp.events.call("client:penthouse:exit");
    }
});

mp.events.add("client:penthouse:enter", async () => {
    mp.game.streaming.requestIpl(penthouseIPL);

    for(let i = 0; mp.game.streaming.isIplActive(penthouseIPL) === 0 && i < 15; i++){
        if(i === 14) return mp.game.graphics.notify('~r~Penthouse IPL failed to load, try again.');
        await mp.game.waitAsync(100);
    }

    interiorId = mp.game.interior.getInteriorAtCoords(976.636, 70.295, 115.164);

    reloadPenthouse();

    mp.events.callRemote("penthouse:enter");
});

mp.events.add("client:penthouse:exit", () => {
    for(const [item, value] of Object.entries(penthouseCustomisation)){
        mp.game.interior.disableInteriorProp(interiorId, value);
    }

    mp.game.streaming.removeIpl(penthouseIPL);
})

//  When we load a feature, we need to unload the current one
mp.events.add("penthouse:updatePenthouseFeature", (feature, value) => {
    if(penthouseCustomisation.hasOwnProperty(feature)){
        if(feature !== "tint_color"){
            mp.game.interior.disableInteriorProp(interiorId, penthouseCustomisation[feature]);
        }

        penthouseCustomisation[feature] = value;

        reloadPenthouse();
    }
});

//  Updates all features of a penthouse
//  NOTE: Needed especially when changing tint color, some furniture needs the updated tint_color
function reloadPenthouse(){
    for(const [item, value] of Object.entries(penthouseCustomisation)){
        mp.game.interior.enableInteriorProp(interiorId, value);
        mp.game.invoke("0xC1F1920BAF281317", interiorId, value, parseInt(penthouseCustomisation["tint_color"])); // _SET_INTERIOR_PROP_COLOR
    }
    
    mp.game.interior.refreshInterior(interiorId);
}
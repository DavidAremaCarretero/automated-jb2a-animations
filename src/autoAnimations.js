import { JB2APATREONDB } from "./animation-functions/databases/jb2a-patreon-database.js";
import { JB2AFREEDB } from "./animation-functions/databases/jb2a-free-database.js";
import { trafficCop } from "./router/traffic-cop.js";

import Dnd5Handler from "./system-handlers/dnd5-handler.js";
import MidiHandler from "./system-handlers/midi-handler.js";
import Pf1Handler from "./system-handlers/pf1-handler.js";
import Dnd35Handler from "./system-handlers/dnd35-handler.js";
import Tormenta20Handler from './system-handlers/tormenta20-handler.js';
import DemonLordHandler from './system-handlers/demonlord-handler.js';
import SwadeHandler from './system-handlers/swade-handler.js';
import GeneralAnimHandler from "./system-handlers/generalAnim-handler.js";
import SW5eHandler from "./system-handlers/sw5e-handler.js";
import WFRP4eHandler from "./system-handlers/wfrp4e-handler.js";
import PF2Handler from "./system-handlers/pf2-handler.js";

import thunderwaveAuto from "./animation-functions/thunderwave.js";
import ctaCall from "./animation-functions/CTAcall.js";
import huntersMark from "./animation-functions/custom-sequences/hunters-mark.js";
import bardicInspiration from "./animation-functions/custom-sequences/bardic-inspiration.js";
import AAItemSettings from "./item-sheet-handlers/animateTab.js";

import { AAITEMCHECK, AAITEMCHECKFREE } from "./animation-functions/item-arrays.js";
import { rangedAnimations } from "./animation-functions/rangedAnimation.js";
import { meleeAnimation } from "./animation-functions/meleeAnimation.js";
import { onTokenAnimation } from "./animation-functions/onTokenAnimation.js";
import { explodeOnToken } from "./animation-functions/explodeOnToken.js";
import { teleportation } from "./animation-functions/teleportation.js";
import { templateAnimation } from "./animation-functions/templateAnimation.js";
import { shieldSpell } from "./animation-functions/custom-sequences/shield.js";
import { sneakAttack } from "./animation-functions/custom-sequences/sneak-Attack.js";
import { bless } from "./animation-functions/custom-sequences/bless.js";
import { setupSocket } from "./socketset.js";

import ImagePicker from "./ImagePicker.js";

// just swap which of these two lines is commented to turn on/off all logging
//const log = console.log.bind(window.console);
const log = () => { };

Hooks.once('setup', function () {
    setupSocket();
});

Hooks.on('init', () => {
    game.settings.register("autoanimations", "disableAutoRec", {
        name: game.i18n.format("AUTOANIM.settingDisableAutoRec"),
        hint: game.i18n.format("AUTOANIM.settingDisableAutoRecHint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
    })
    game.settings.register("autoanimations", "globaldelay", {
        name: game.i18n.format("AUTOANIM.globaldelay_name"),
        hint: game.i18n.format("AUTOANIM.globaldelay_hint"),
        scope: "world",
        config: true,
        default: 100,
        type: Number
    })
    game.settings.register("autoanimations", "videoLoop", {
        name: game.i18n.format("AUTOANIM.animPreview"),
        hint: game.i18n.format("AUTOANIM.animPreviewHint"),
        scope: "world",
        type: String,
        choices: {
            "0": "No Video Preview",
            "1": "Manually Play Video Preview",
            "2": "Autoplay Video Preview"
        },
        default: "0",
        config: true
    })
    game.settings.register("autoanimations", "hideFromPlayers", {
        name: game.i18n.format("AUTOANIM.animtab_name"),
        hint: game.i18n.format("AUTOANIM.animtab_hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });
    game.settings.register("autoanimations", "rangeSwitch", {
        name: game.i18n.format("AUTOANIM.settingRangeSwitch"),
        hint: game.i18n.format("AUTOANIM.settingRangeSwitchhint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
    })
    switch (game.system.id) {
        case "demonlord": {
            if (!(game.data.version === "0.7.9" || game.data.version === "0.7.10")) {
                game.settings.register("autoanimations", "playtrigger", {
                    name: game.i18n.format("AUTOANIM.demonlordtrigger_name"),
                    hint: game.i18n.format("AUTOANIM.demonlordtrigger_hint"),
                    scope: "world",
                    type: String,
                    choices: {
                        "rollattack": game.i18n.format("AUTOANIM.demonlordtrigger_rollattack"),
                        "hits": game.i18n.format("AUTOANIM.demonlordtrigger_hits"),
                        "misses": game.i18n.format("AUTOANIM.demonlordtrigger_misses"),
                        "rolldamage": game.i18n.format("AUTOANIM.demonlordtrigger_rolldamage"),
                        "applydamage": game.i18n.format("AUTOANIM.demonlordtrigger_applydamage"),
                    },
                    default: "rollattack",
                    config: true
                })
            }
            break
        }
        case "sfrpg": {
            game.settings.register("autoanimations", "playonDamage", {
                name: game.i18n.format("AUTOANIM.midiondmg_name"),
                hint: game.i18n.format("AUTOANIM.midiondmg_hint"),
                scope: 'world',
                type: Boolean,
                default: false,
                config: true,
                onChange: () => { window.location.reload() }
            });
        }
        case "dnd5e":
        case "sw5e":
        case "pf2e":
            if (game.modules.get("midi-qol")?.active) {
                game.settings.register("autoanimations", "playonhit", {
                    name: game.i18n.format("AUTOANIM.midionhit_name"),
                    hint: game.i18n.format("AUTOANIM.midionhit_hint"),
                    scope: 'world',
                    type: Boolean,
                    default: false,
                    config: true,
                });
                game.settings.register("autoanimations", "playonmiss", {
                    name: game.i18n.format("AUTOANIM.midionmiss_name"),
                    hint: game.i18n.format("AUTOANIM.midionmiss_hint"),
                    scope: `world`,
                    type: Boolean,
                    default: false,
                    config: true,
                });
                game.settings.register("autoanimations", "playonDamage", {
                    name: game.i18n.format("AUTOANIM.midiondmg_name"),
                    hint: game.i18n.format("AUTOANIM.midiondmg_hint"),
                    scope: 'world',
                    type: Boolean,
                    default: false,
                    config: true,
                    onChange: () => { window.location.reload() }
                });
                if (game.data.version === "0.7.9" || game.data.version === "0.7.10") {
                    game.settings.register("autoanimations", "EnableCritical", {
                        name: game.i18n.format("AUTOANIM.crithit_name"),
                        hint: game.i18n.format("AUTOANIM.crithit_hint"),
                        scope: 'world',
                        type: Boolean,
                        default: false,
                        config: true,
                        onchange: () => { window.location.reload() }
                    });
                    game.settings.register("autoanimations", "CriticalAnimation", {
                        name: game.i18n.format("AUTOANIM.crithitAnim_name"),
                        scope: 'world',
                        type: ImagePicker.Image,
                        default: "modules/JB2A_DnD5e/Library/Generic/UI/Critical_02_Red_200x200.webm",
                        config: true,
                        onchange: () => { window.location.reload() }
                    });
                    game.settings.register("autoanimations", "EnableCriticalMiss", {
                        name: game.i18n.format("AUTOANIM.critmiss_name"),
                        hint: game.i18n.format("AUTOANIM.critmiss_hint"),
                        scope: 'world',
                        type: Boolean,
                        default: false,
                        config: true,
                        onchange: () => { window.location.reload() }
                    });
                    game.settings.register("autoanimations", "CriticalMissAnimation", {
                        name: game.i18n.format("AUTOANIM.critmissAnim_name"),
                        scope: 'world',
                        type: ImagePicker.Image,
                        default: "modules/JB2A_DnD5e/Library/Generic/UI/Miss_02_White_200x200.webm",
                        config: true,
                        onchange: () => { window.location.reload() }
                    });
                } else {
                    game.settings.register("autoanimations", "EnableCritical", {
                        name: game.i18n.format("AUTOANIM.crithit_name"),
                        hint: game.i18n.format("AUTOANIM.crithit_hint"),
                        scope: 'world',
                        type: Boolean,
                        default: false,
                        config: true,
                        onchange: () => { window.location.reload() }
                    });
                    game.settings.register("autoanimations", "CriticalAnimation", {
                        name: game.i18n.format("AUTOANIM.crithitAnim_name"),
                        //name: "Choose A File",
                        scope: 'world',
                        config: true,
                        type: String,
                        filePicker: "imagevideo"
                    });
                    game.settings.register("autoanimations", "EnableCriticalMiss", {
                        name: game.i18n.format("AUTOANIM.critmiss_name"),
                        hint: game.i18n.format("AUTOANIM.critmiss_hint"),
                        scope: 'world',
                        type: Boolean,
                        default: false,
                        config: true,
                        onchange: () => { window.location.reload() }
                    });
                    game.settings.register("autoanimations", "CriticalMissAnimation", {
                        name: game.i18n.format("AUTOANIM.critmissAnim_name"),
                        scope: 'world',
                        config: true,
                        type: String,
                        filePicker: "imagevideo"
                    });
                }
            } else {
                game.settings.register("autoanimations", "playonDamageCore", {
                    name: game.i18n.format("AUTOANIM.coreondmg_name"),
                    hint: game.i18n.format("AUTOANIM.coreondmg_hint"),
                    scope: 'world',
                    type: Boolean,
                    default: false,
                    config: true,
                });
            }
            break;
    }

    if (game.modules.get("midi-qol")?.active) {
        log("midi IS active");
        switch (game.settings.get("autoanimations", "playonDamage")) {
            case (true):
                Hooks.on("midi-qol.DamageRollComplete", (workflow) => { setUpMidi(workflow) });
                Hooks.on("createChatMessage", (msg) => { specialCaseAnimations(msg) });
                Hooks.on("midi-qol.RollComplete", (workflow) => { setUpMidiNoAD(workflow) });
                break;
            case (false):
                Hooks.on("midi-qol.AttackRollComplete", (workflow) => { setUpMidi(workflow) });
                Hooks.on("midi-qol.RollComplete", (workflow) => { setUpMidiNoA(workflow) });
                Hooks.on("createChatMessage", (msg) => { specialCaseAnimations(msg) });
                break;
        }
        if (game.settings.get("autoanimations", "EnableCritical") || game.settings.get("autoanimations", "EnableCriticalMiss")) {
            Hooks.on("midi-qol.AttackRollComplete", (workflow) => { criticalCheck(workflow) })
        }

    } else {
        switch (game.system.id) {
            case "pf1":
            case "D35E":
                Hooks.on("createChatMessage", async (msg) => { onCreateChatMessage(msg) });
                break;
            case "dnd5e":
            case "sw5e":
                Hooks.on("createChatMessage", async (msg) => {
                    setUp5eCore
                        (msg);
                    //specialCaseAnimations(msg);
                });
                //Hooks.on("preCreateChatMessage", async (msg, options, userId) => {dnd5ecrits(msg)});
                break;
            case "tormenta20":
                Hooks.on("createChatMessage", async (msg) => { setupTormenta20(msg) });
                break;
            case "demonlord": {
                if (game.data.version === "0.7.9" || game.data.version === "0.7.10") {
                    Hooks.on("DL.ApplyDamage", setupDemonLord);
                    Hooks.on("DL.ApplyHealing", setupDemonLord);
                } else {
                    Hooks.on("DL.Action", setupDemonLord);
                }
            }
                break;
            case "pf2e":
                Hooks.on("createChatMessage", async (msg) => { pf2eReady(msg) });
                break;
            case "sfrpg":
                Hooks.on("createChatMessage", async (msg) => {
                    function extractItemId(content) {
                        try {
                            return $(content).attr("data-item-id");
                        } catch (exception) {
                            return null;
                        }
                    }
                    let itemId = extractItemId(msg.data.content);
                    let tokenId;
                    let sourceToken;
                    let targets;
                    let item;
                    if (itemId === undefined) {
                        return
                    } else {
                        item = sourceToken.actor.items?.get(itemId)
                    }
                    if (!item.hasAttack && !item.hasDamage) {
                        tokenId = msg.data.speaker.token;
                        sourceToken = canvas.tokens.get(tokenId);
                        targets = Array.from(msg.user.targets)
                        AutoAnimations.playAnimation(sourceToken, targets, item)
                    }
                });
                if (game.settings.get("autoanimations", "playonDamage")) {
                    Hooks.on("damageRolled", async (data) => {
                        Hooks.once("createChatMessage", async (msg) => {
                            if (msg.user.id !== game.user.id) { return };
                            starFinder(data, msg)
                        });
                    });
                } else {
                    Hooks.on("attackRolled", async (data) => {
                        Hooks.once("createChatMessage", async (msg) => {
                            if (msg.user.id !== game.user.id) { return };
                            starFinder(data, msg)
                        });
                    })
                    Hooks.on("damageRolled", async (data) => {
                        Hooks.once("createChatMessage", async (msg) => {
                            if (msg.user.id !== game.user.id) { return };
                            if (data.item.hasAttack) {
                                return;
                            } else {
                                starFinder(data, msg)
                            }
                        });
                    })
                }
                break;
            case "swade":
                Hooks.on("swadeAction", async (SwadeActor, SwadeItem) => { swadeData(SwadeActor, SwadeItem) });
                break;
            case "wfrp4e":
                Hooks.on("wfrp4e:rollWeaponTest", async (data, info) => {
                    let targets = game.user.targets;
                    wfrpWeapon(data, targets, info)
                });
                Hooks.on("wfrp4e:rollPrayerTest", async (data, info) => {
                    let targets = game.user.targets;
                    wfrpPrayer(data, targets, info)
                });
                Hooks.on("wfrp4e:rollCastTest", async (data, info) => {
                    let targets = game.user.targets;
                    wfrpCast(data, targets, info)
                });
                Hooks.on("wfrp4e:rollTraitTest", async (data, info) => {
                    let targets = game.user.targets;
                    wfrpTrait(data, targets, info)
                });
                Hooks.on("wfrp4e:rollTest", async (data, info) => {
                    let targets = game.user.targets;
                    wfrpSkill(data, targets, info)
                });
                break;
        }
        //Hooks.on("createMeasuredTemplate", async (msg) => { getTemplateParams(msg) });
    }
})
// sets the A-A button on the Item Sheet title bar
Hooks.on(`renderItemSheet`, async (app, html, data) => {
    if (!game.user.isGM && game.settings.get("autoanimations", "hideFromPlayers")) {
        return;
    }
    const aaBtn = $(`<a class="aa-item-settings" title="A-A"><i class="fas fa-biohazard"></i>A-A</a>`);
    if (game.data.version === "0.7.9" || game.data.version === "0.7.10") {
        aaBtn.click(ev => {
            new AAItemSettings(app.entity, {}).render(true);
        });
    } else {
        aaBtn.click(ev => {
            new AAItemSettings(app.document, {}).render(true);
        });
    }
    html.closest('.app').find('.aa-item-settings').remove();
    let titleElement = html.closest('.app').find('.window-title');
    aaBtn.insertAfter(titleElement);
});
// Registers Database with Sequencer
Hooks.once('ready', function () {
    let obj01 = moduleIncludes("jb2a_patreon") === true ? JB2APATREONDB : JB2AFREEDB;

    Hooks.on("sequencer.ready", () => {
        SequencerDatabase.registerEntries("autoanimations", obj01);
    });
    if (game.user.isGM && (!game.modules.get("JB2A_DnD5e") && !game.modules.get("jb2a_patreon"))) {
        ui.notifications.error(game.i18n.format("AUTOANIM.error"));
    }
});

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

/* External call for animations
* sourcToken as the originating token
* targets as an array from the user
* item as the item instance being used
*/
class AutoAnimations {
    static playAnimation(sourceToken, targets, item) {
        let handler = new GeneralAnimHandler(sourceToken, targets, item);
        trafficCop(handler);
    }
}
window.AutoAnimations = AutoAnimations;

function moduleIncludes(test) {
    return !!game.modules.get(test);
}

/*
/ Midi-QOL Functions for DnD 5e and Star Wars 5e
*/
// setUpMidi for 5e/SW5e Animations on "Attack Rolls" (not specifically on damage)
function setUpMidi(workflow) {
    let handler = new MidiHandler(workflow);
    if (handler.animType === "t8" && handler.animOverride) {return;}
    trafficCop(handler);
}
// setUpMidiNoAD for Animations on items that have NO Attack or Damage rolls. Active if Animate on Damage true
function setUpMidiNoAD(workflow) {
    if (workflow.item?.hasAttack && workflow.item?.hasDamage) { return; }
    let handler = new MidiHandler(workflow);
    if (handler.animType === "t8" && handler.animOverride) {return;}
    trafficCop(handler)
}
// setUpMidiNoD for Animations on items that have NO Attack Roll. Active only if Animating on Attack Rolls
function setUpMidiNoA(workflow) {
    if (workflow.item?.hasAttack) { return; }
    let handler = new MidiHandler(workflow);
    if (handler.animType === "t8" && handler.animOverride) {return;}
    trafficCop(handler)
}
// Special cases required when using Midi-QOL. Houses only the Template Animations right now
async function specialCaseAnimations(msg) {
    if (game.user.id !== msg.user.id) {
        return;
    }
    let handler = new Dnd5Handler(msg);
    if (handler.animType === "t8" && handler.animOverride) {
        Hooks.once("createMeasuredTemplate", (msg) => {
            templateAnimation(handler, msg);
        })
    }
}

/*
/ Set up DnD5e and SW5e CORE (NON MIDI)
*/
function setUp5eCore(msg) {
    if (msg.user.id !== game.user.id) { return };

    const animationNow = game.settings.get("autoanimations", "playonDamageCore");
    let handler;
    let rollType;
    switch (game.system.id) {
        case "dnd5e":
            handler = new Dnd5Handler(msg);
            rollType = (msg.data?.flags?.dnd5e?.roll?.type?.toLowerCase() ?? msg.data?.flavor?.toLowerCase() ?? "pass");
            break;
        case "sw5e":
            handler = new SW5eHandler(msg);
            rollType = msg.data?.flags?.sw5e?.roll?.type?.toLowerCase() ?? "pass";
            break;
    }

    if (!handler.item || handler.animKill) { return }
    switch (true) {
        case !handler.hasAttack && !handler.hasDamage:
            trafficCop(handler);
            break;
        case handler.animType === "t8" && !rollType.includes("damage"):
            trafficCop(handler);
            break;
        case animationNow:
            if (rollType.includes("damage")) {
                if (handler.animType === "t8") { return; }
                if (game.modules.get("mre-dnd5e")?.active) {
                    switch (game.settings.get("mre-dnd5e", "autoDamage")) {
                        case (true):
                            switch (true) {
                                case handler.convertedName === "thunderwave":
                                    //case handler.convertedName.includes(game.i18n.format("AUTOANIM.itemThunderwave").toLowerCase()):
                                    Hooks.once("createMeasuredTemplate", () => {
                                        thunderwaveAuto(handler);
                                    })
                                    break;
                            }
                            break;
                        case (false):
                            trafficCop(handler);
                            break;
                    }
                } else { trafficCop(handler); }
            }
            break;
        case !animationNow:
            switch (true) {
                case rollType.includes("damage") && !handler.hasAttack:
                case rollType.includes('attack'):
                    if (handler.animType === "t8") { return; }
                    trafficCop(handler);
                    break;
            }
            break;
    }
}

/*
/ sets Handler for PF1 and DnD3.5
*/
function onCreateChatMessage(msg) {
    if (msg.user.id !== game.user.id) { return };
    log('onCreateChatMessage', msg);
    let handler;
    switch (game.system.id) {
        case "pf1":
            handler = new Pf1Handler(msg);
            break;
        case "D35E":
            handler = new Dnd35Handler(msg);
            break;
    }
    /*
    if (game.user.id === msg.user.id) {
        switch (true) {
            case ((handler.animType === "t12") && (handler.animOverride)):
                teleportation(handler);
                break;
        }
    }
    */
    trafficCop(handler)
}

/*
/ Sets Handler for SWADE
*/
function swadeData(SwadeActor, SwadeItem) {
    let handler = new SwadeHandler(SwadeActor, SwadeItem);
    trafficCop(handler);
}

/*
/ Sets Handler for Starfinder
*/
function starFinder(data, msg) {
    let tokenId = msg.data.speaker.token;
    let sourceToken = canvas.tokens.get(tokenId);
    let targets = Array.from(msg.user.targets);
    let item = data.item;
    AutoAnimations.playAnimation(sourceToken, targets, item)
}

/*
/ Sets Handler for Tormenta 20
*/
function setupTormenta20(msg) {
    let handler = new Tormenta20Handler(msg);
    if (game.user.id === msg.user.id) {
        switch (true) {
            case ((handler.animType === "t12") && (handler.animOverride)):
                teleportation(handler);
                break;
        }
    }
    if (game.user.id === msg.user.id) {
        return;
    }
    trafficCop(handler);
}

/*
/ Sets Handler for Demon Lord
*/
function setupDemonLord(data) {
    let handler = new DemonLordHandler(data);
    trafficCop(handler);
}

/*
/ Sets Handler for Pathfinder 2e and routes to animations
*/
async function pf2eReady(msg) {
    if (game.user.id !== msg.user.id) { return; }
    const handler = new PF2Handler(msg);
    if (!handler.item || !handler.actorToken || handler.animKill) {
        return;
    }
    const itemType = handler.itemType;
    const damage = handler.item.damageValue;
    const spellType = handler.item?.data?.data?.spellType?.value ?? "utility";
    const playOnDmg = game.settings.get("autoanimations", "playonDamageCore")
    if (handler.animType === "t8" && handler.animOverride) {
        if (msg.data.flavor?.toLowerCase().includes("damage")) { return; }
        trafficCop(handler);
        return;
    }
    switch (itemType) {
        case "spell":
            switch (spellType) {
                case "utility":
                    trafficCop(handler);
                    break;
                case "save":
                    if (!damage) {
                        trafficCop(handler);
                    } else if (msg.data.flavor?.toLowerCase().includes("damage")) {
                        trafficCop(handler);
                    }
                    break;
                case "heal":
                    if (msg.data.flavor?.toLowerCase().includes('healing')) {
                        trafficCop(handler);
                    }
                    break;
                case "attack":
                    switch (playOnDmg) {
                        case true:
                            if (msg.data.flavor?.toLowerCase().includes("damage")) {
                                trafficCop(handler);
                            }
                            break;
                        default:
                            if (msg.data.flags.pf2e?.context?.type.includes("attack")) {
                                trafficCop(handler);
                            }
                    }
                    break;
            }
            break;
        case "melee":
        case "weapon":
            switch (true) {
                case playOnDmg:
                    if (msg.data.flags.pf2e?.damageRoll /*msg.data.flavor?.toLowerCase().includes("damage")*/) {
                        trafficCop(handler);
                    }
                    break;
                default:
                    if (msg.data.flags.pf2e?.context?.type.includes("attack")) {
                        trafficCop(handler);
                    }
            }
            break;
        case "consumable":
        case "armor":
        case "feat":
        case "action":
        case "effect":
            trafficCop(handler);
            break;
    }
}

async function itemSound(handler) {
    let audio = handler.allSounds.item;
    if (handler.itemSound) {
        await wait(audio.delay);
        AudioHelper.play({ src: audio.file, volume: audio.volume, autoplay: true, loop: false }, true);
    }
}
async function criticalCheck(workflow) {
    if (!workflow.isCritical && !workflow.isFumble) { return; }
    let critical = workflow.isCritical;
    let fumble = workflow.isFumble;

    let token;

    let critAnim = game.settings.get("autoanimations", "CriticalAnimation");
    let critMissAnim = game.settings.get("autoanimations", "CriticalMissAnimation");

    switch (true) {
        case (game.settings.get("autoanimations", "EnableCritical") && critical):
            token = canvas.tokens.get(workflow.tokenId);
            new Sequence()
                .effect()
                .file(critAnim)
                .atLocation(token)
                .play()
            break;
        case (game.settings.get("autoanimations", "EnableCriticalMiss") && fumble):
            token = canvas.tokens.get(workflow.tokenId);
            new Sequence()
                .effect()
                .file(critMissAnim)
                .atLocation(token)
                .play()
            break;
    }
}
/*
/ WFRP Functions
*/
function wfrpWeapon(data, targets, info) {
    if (game.user.id !== info.user) { return }
    let item = data.weapon;
    let allTargets = Array.from(targets);
    let handler = new WFRP4eHandler(item, allTargets);
    switch (true) {
        case ((handler.animType === "t12") && (handler.animOverride)):
            teleportation(handler);
            break;
        default:
            trafficCop(handler);
    }
}
function wfrpPrayer(data, targets, info) {
    if (game.user.id !== info.user) { return }
    let item = data.prayer;
    let allTargets = Array.from(targets);
    let handler = new WFRP4eHandler(item, allTargets);
    switch (true) {
        case ((handler.animType === "t12") && (handler.animOverride)):
            teleportation(handler);
            break;
        default:
            trafficCop(handler);
    }
}
function wfrpCast(data, targets, info) {
    if (game.user.id !== info.user) { return }
    let item = data.spell;
    let allTargets = Array.from(targets);
    let handler = new WFRP4eHandler(item, allTargets);
    switch (true) {
        case ((handler.animType === "t12") && (handler.animOverride)):
            teleportation(handler);
            break;
        default:
            trafficCop(handler);
    }
}
function wfrpTrait(data, targets, info) {
    if (game.user.id !== info.user) { return }
    let item = data.trait;
    let allTargets = Array.from(targets);
    let handler = new WFRP4eHandler(item, allTargets);
    switch (true) {
        case ((handler.animType === "t12") && (handler.animOverride)):
            teleportation(handler);
            break;
        default:
            trafficCop(handler);
    }
}
function wfrpSkill(data, targets, info) {
    if (game.user.id !== info.user) { return }
    let item = data.skill;
    let allTargets = Array.from(targets);
    let handler = new WFRP4eHandler(item, allTargets);
    switch (true) {
        case ((handler.animType === "t12") && (handler.animOverride)):
            teleportation(handler);
            break;
        default:
            trafficCop(handler);
    }
}













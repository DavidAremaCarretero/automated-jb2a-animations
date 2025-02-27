
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function bardicInspiration(handler) {

    let token = handler.actorToken;
    let target = handler.allTargets[0];
    
    let selfMarkerPath = handler.bards.markerColor === "random" ? `autoanimations.bardicinspiration.marker` : `autoanimations.bardicinspiration.marker.${handler.bards.markerColor}`;
    let targetMarkerPath = handler.bards.markerColorTarget === "random" ? `autoanimations.bardicinspiration.marker` : `autoanimations.bardicinspiration.marker.${handler.bards.markerColorTarget}`
    async function markerCreate(tokenMarker, path) {
        new Sequence()
        .effect()
        .file(path)
        .atLocation(tokenMarker)
        .scale((tokenMarker.w / 400) * 2)
        .belowTokens(true)
        .play()
    }

    let selfMusicPath = handler.bards.bardSelfColor === "random" ? `autoanimations.music` : `autoanimations.music.${handler.bards.bardSelfColor}`
    let targetMusicPath = handler.bards.bardTargetColor === "random" ? `autoanimations.music` : `autoanimations.music.${handler.bards.bardTargetColor}`
    async function music(token, path) {
        
        let musicPlay = new Sequence()
        .effect()
        .file(path)
        .atLocation(token)
        .scale(token.w / 200)
        .repeats(10, 350)
        .randomOffset()

        if (handler.bardSelf) {musicPlay.play()}
    }

    let selfBIPath = handler.bards.bardSelfColor === "random" ? `autoanimations.bardicinspiration.inspire` : `autoanimations.bardicinspiration.inspire.${handler.bards.bardSelfColor}`
    let targetBIPath = handler.bards.bardTargetColor === "random" ? `autoanimations.bardicinspiration.inspire` : `autoanimations.bardicinspiration.inspire.${handler.bards.bardTargetColor}`
    async function bardicInspiration(biToken, path) {

        let bardicPlay = new Sequence()
        .effect()
        .file(path)
        .atLocation(biToken)
        .scale((biToken.w / 400) * 2)

        if (handler.bardSelf) { bardicPlay.play()}
    }

    if (handler.bards.bardSelf) {
        switch (true) {
            case handler.bardAnim === "music":
                music(token, selfMusicPath);
                if (handler.bards.marker) {
                    if (handler.bardSelf) {
                        markerCreate(token, selfMarkerPath);
                    }
                    await wait(3750);
                }
                break;
            default:
                bardicInspiration(token, selfBIPath);
                if (handler.bards.marker) {
                    if (handler.bardSelf) {
                        markerCreate(token, selfMarkerPath);
                    }
                    await wait(3750);
                }
        }
    }
    if (handler.bards.bardTarget && target !== undefined) {
        switch (true) {
            case handler.bards.bardTargetAnim === "music":
                music(target, targetMusicPath);
                if (handler.bards.marker) {
                    if (target && handler.bardTarget) {
                        markerCreate(target, targetMarkerPath);
                    }
                    await wait(3750);
                }
                break;
            default:
                bardicInspiration(target, targetBIPath);
                if (handler.bards.marker) {
                    if (target && handler.bardTarget) {
                        markerCreate(target, targetMarkerPath);
                    }
                    await wait(3750);
                }
        }
    }
}
export default bardicInspiration;
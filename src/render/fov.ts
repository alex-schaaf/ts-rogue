import * as ROT from 'rot-js'
import { GameMap, XYtoCoords } from '../game/game'

function isTransparent(map: GameMap, x: number, y: number) {
    const coords = XYtoCoords(x, y)
    if (coords in map) {
        return map[coords].isTransparent
    }
    return false
}

function lightPasses(map: GameMap, x: number, y: number): boolean {
    return isTransparent(map, x, y)
}

function getFovMap(map: GameMap, x: number, y: number, radius: number) {
    const fovMap: Record<string, boolean> = {}
    const fov = new ROT.FOV.PreciseShadowcasting((x, y) =>
        lightPasses(map, x, y)
    )

    fov.compute(x, y, radius, (x, y, r, visibility) => {
        if (visibility) {
            const coord = XYtoCoords(x, y)
            if (map[coord] === undefined) {
                return
            }
            fovMap[coord] = true
            map[coord].isExplored = true
        }
    })
    return fovMap
}

export { getFovMap }

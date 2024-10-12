import * as ROT from 'rot-js'
import { Map } from '../game/game'

function XYtoCoords(x: number, y: number) {
    return `${x},${y}`
}

function isTransparent(map: Map, x: number, y: number) {
    const coords = XYtoCoords(x, y)
    if (coords in map) {
        return map[coords].isTransparent
    }
    return false
}

function lightPasses(map: Map, x: number, y: number): boolean {
    return isTransparent(map, x, y)
}

function getFovMap(map: Map, x: number, y: number) {
    const fovMap: Record<string, boolean> = {}
    const fov = new ROT.FOV.PreciseShadowcasting((x, y) =>
        lightPasses(map, x, y)
    )

    fov.compute(x, y, 8, (x, y, r, visibility) => {
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

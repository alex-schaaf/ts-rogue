import * as ROT from 'rot-js'
import { GameMap } from '../game/game'
import { Tile } from '../game/tile'

function isTransparent(map: GameMap<Tile>, x: number, y: number) {
    const tile = map.get(x, y)
    if (tile) {
        return tile.isTransparent
    }
    return false
}

function lightPasses(map: GameMap<Tile>, x: number, y: number): boolean {
    return isTransparent(map, x, y)
}

function getFovMap(map: GameMap<Tile>, x: number, y: number, radius: number) {
    const fovMap =  new GameMap<boolean>()
    const fov = new ROT.FOV.PreciseShadowcasting((x, y) =>
        lightPasses(map, x, y)
    )

    fov.compute(x, y, radius, (x, y, r, visibility) => {
        if (visibility) {
            const tile = map.get(x, y)
            if (tile === undefined) {
                return
            }
            fovMap.set(x, y, true)
            tile.isExplored = true
        }
    })
    return fovMap
}

export { getFovMap }

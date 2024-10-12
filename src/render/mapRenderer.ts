import * as ROT from 'rot-js'
import { Tile } from '../game/tile'

export function renderMap(display: ROT.Display, map: Record<string, Tile>) {
    for (let key in map) {
        let [x, y] = key.split(',').map(Number)
        let tile = map[key]
        display.draw(x, y, tile.char, tile.colorFg, tile.colorBg)
    }
}
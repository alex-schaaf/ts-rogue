import * as ROT from 'rot-js'
import { GameMap } from '../game/game'
import { Tile } from '../game/tile'

export function renderMap(
    display: ROT.Display,
    map: GameMap<Tile>
    // fovMap: Record<string, boolean>
) {
    function isVisible(x: number, y: number) {
        // return coord in fovMap
        return true
    }

    function isExplored(x: number, y: number) {
        return true
        return map.get(x, y)?.isExplored === true
    }

    

    for (const [x, y] of map.getCoords()) {
        let tile = map.get(x, y)!
        if (isVisible(x, y)) {
            display.draw(x, y, tile.char, tile.colorFg, tile.colorBg)
        } else if (isExplored(x, y)) {
            display.draw(
                x,
                y,
                tile.char,
                darkenColor(tile.colorFg, 50),
                darkenColor(tile.colorBg, 50)
            )
        }
    }
}

function darkenColor(colorStr: string, percent: number): string {
    const rgb = ROT.Color.fromString(colorStr)
    if (!rgb || rgb.length !== 3) {
        throw new Error('Invalid RGB color format')
    }
    const [r, g, b] = rgb.map((value) =>
        Math.max(0, Math.min(255, value * (1 - percent / 100)))
    )
    return `rgb(${r}, ${g}, ${b})`
}

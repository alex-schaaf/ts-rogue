import * as ROT from 'rot-js'
import { Tile } from '../game/tile'



export function renderMap(display: ROT.Display, map: Record<string, Tile>, fovMap: Record<string, boolean>) {
    function isVisible(coord: string) {
        // return true
        return coord in fovMap
    }

    function isExplored(coord: string) {
        return true
        return map[coord].isExplored === true
    }

    for (let coord in map) {
        let [x, y] = coord.split(',').map(Number)
        let tile = map[coord]
        if (isVisible(coord)) {
            display.draw(x, y, tile.char, tile.colorFg, tile.colorBg)
        } else if (isExplored(coord)) {
            display.draw(x, y, tile.char, darkenColor(tile.colorFg, 50), darkenColor(tile.colorBg, 50))
        }
    }
}

function darkenColor(colorStr: string, percent: number): string {
    const rgb = ROT.Color.fromString(colorStr)
    if (!rgb || rgb.length !== 3) {
        throw new Error("Invalid RGB color format");
    }
    const [r, g, b] = rgb.map(value => Math.max(0, Math.min(255, value * (1 - percent / 100))));
    return `rgb(${r}, ${g}, ${b})`;
}
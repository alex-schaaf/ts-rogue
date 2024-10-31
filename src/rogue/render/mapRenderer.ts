import * as ROT from 'rot-js'
import { GameMap } from '@game/game'
import { Tile } from '@game/tile'
import { Camera } from '@rogue/game/camera'

export function renderMap(
    display: ROT.Display,
    map: GameMap<Tile>,
    camera: Camera
    // fovMap: Record<string, boolean>
) {
    function isVisible(x: number, y: number) {
        // return coord in fovMap
        return true
    }

    function isExplored(x: number, y: number) {
        return true
        // return map.get(x, y)?.isExplored === true
    }

    const bounds = camera.getBounds()

    for (const [x, y] of camera.getVisibleCoords()) {
        let tile = map.get(x, y)
        if (!tile) {
            continue
        }
        display.draw(
            x - bounds.x0,
            y - bounds.y0,
            tile.char,
            tile.colorFg,
            tile.colorBg
        )
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

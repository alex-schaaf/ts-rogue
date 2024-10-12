import { Tile } from "../game/tile"

function generateMap(width: number, height: number): Record<string, Tile> {
    let map = {}
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Math.random() < 0.2) {
                map[`${x},${y}`] = {
                    char: '#',
                    colorFg: '#efefef',
                    colorBg: '#000',
                    isWalkable: false,
                    isTransparent: false,
                    isExplored: false,
                }
            } else {
                map[`${x},${y}`] = {
                    char: '.',
                    colorFg: '#404040',
                    colorBg: '#000',
                    isWalkable: true,
                    isTransparent: true,
                    isExplored: false,
                }
            }
        }
    }
    return map
}

export {generateMap}
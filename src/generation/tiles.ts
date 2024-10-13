import { Tile } from '../game/tile'

function getWall(): Tile {
    return {
        char: '#',
        colorFg: '#efefef',
        colorBg: '#000',
        isWalkable: false,
        isTransparent: false,
        isExplored: false,
    }
}

function getFloor(): Tile {
    return {
        char: '.',
        colorFg: '#404040',
        colorBg: '#000',
        isWalkable: true,
        isTransparent: true,
        isExplored: false,
    }
}

export { getWall, getFloor }

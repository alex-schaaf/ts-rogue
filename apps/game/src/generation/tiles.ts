import { Tile } from '@game/tile'

function getWall(): Tile {
    return {
        char: '#',
        colorFg: '#00ff00',
        colorBg: '#003300',
        isWalkable: false,
        isTransparent: false,
        isExplored: false,
    }
}

function getFloor(): Tile {
    return {
        char: '.',
        colorFg: '#003300',
        colorBg: '#000',
        isWalkable: true,
        isTransparent: true,
        isExplored: false,
    }
}

function getStairsUp(): Tile {
    return {
        char: '<',
        colorFg: '#00ff00',
        colorBg: '#000',
        isWalkable: true,
        isTransparent: true,
        isExplored: false,
    }
}

function getStairsDown(): Tile {
    return {
        char: '>',
        colorFg: '#00ff00',
        colorBg: '#000',
        isWalkable: true,
        isTransparent: true,
        isExplored: false,
    }
}

export { getWall, getFloor, getStairsUp, getStairsDown }

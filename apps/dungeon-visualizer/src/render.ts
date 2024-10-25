import * as ROT from 'rot-js'
import TileType from './tileType'

function renderDungeon(display: ROT.Display, dungeon: number[][]): void {
    for (let y = 0; y < dungeon.length; y++) {
        for (let x = 0; x < dungeon[y].length; x++) {
            const value = dungeon[y][x]
            switch (value) {
                case TileType.Wall:
                    display.draw(x, y, ' ', '#000', '#000')
                    break
                case TileType.Floor:
                    display.draw(x, y, ' ', '#fff', '#fff')
                    break
                case TileType.Door:
                    display.draw(x, y, '+', '#000', '#fff')
                    break
                case TileType.Corridor:
                    display.draw(x, y, '.', '#000', '#fff')
                    break
            }
        }
    }
}

export { renderDungeon }

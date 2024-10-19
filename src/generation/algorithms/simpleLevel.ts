import { Tile } from "@game/tile";
import { GameMap } from "@lib/gameMap";
import { getFloor, getStairsDown, getStairsUp, getWall } from "../tiles";

function generate(width: number, height: number): GameMap<Tile> {
    let map = new GameMap<Tile>()

    for (let x = 0; x < width ; x++) {
        for (let y = 0; y < height; y++) {
            // walls around the edge of the map
            if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                map.set(x, y, getWall())
                continue
            }

            map.set(x, y, getFloor())
        }
    }

    // add stairs up on the left and stairs down on the right
    map.set(0, height / 2, getStairsUp())
    map.set(width -1, height / 2, getStairsDown())

    return map
}

export { generate }
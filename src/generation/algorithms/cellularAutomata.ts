import { Map, XYtoCoords } from "../../game/game";
import { MapGenerationAlgorithm } from "../abstract";
import { getFloor, getWall } from "../tiles";

class CellularAutomataAlgorithm implements MapGenerationAlgorithm {
    generate(width: number, height: number): Map {
        let map = seedMap(width, height)

        for (let i = 0; i < 5; i++) {
            map = this.iterate(map, width, height)
        }

        return map
    }

    iterate(map: Map, width: number, height: number): Map {
        let newMap = {}

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let wallCount = this.countWalls(map, x, y, width, height)

                if (wallCount >= 5) {
                    newMap[XYtoCoords(x, y)] = getWall()
                } else {
                    newMap[XYtoCoords(x, y)] = getFloor()
                }
            }
        }

        return newMap
    }

    countWalls(map: Map, x: number, y: number, width: number, height: number): number {
        let count = 0

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nx = x + dx
                let ny = y + dy

                if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
                    count++
                } else if (map[XYtoCoords(nx, ny)].char === '#') {
                    count++
                }
            }
        }

        return count
    }
}

// helper function to seed map with random walls
function seedMap(width: number, height: number): Map {
    let map = {}

    // seed map with random walls
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Math.random() < 0.5) {
                map[XYtoCoords(x, y)] = getWall()
            } else {
                map[XYtoCoords(x, y)] = getFloor()
            }
        }
    }

    return map
}


export { CellularAutomataAlgorithm }

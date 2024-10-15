import { CoordsToXY, GameMap, XYtoCoords } from '../../game/game'
import { MapGenerationAlgorithm } from '../abstract'
import { getFloor, getWall } from '../tiles'

function countWalkableTiles(map: GameMap): number {
    let count = 0

    Object.values(map).forEach((tile) => {
        if (tile.isWalkable) {
            count++
        }
    })

    return count
}

class CellularAutomataAlgorithm implements MapGenerationAlgorithm {
    iterations: number

    constructor(iterations?: number) {
        this.iterations = iterations || 10
    }

    generate(width: number, height: number): GameMap {
        let map = seedMap(width, height)

        for (let i = 0; i < this.iterations; i++) {
            map = this.iterate(map, width, height)
        }

        // fill in edges with walls
        for (let y = 0; y < height; y++) {
            map[XYtoCoords(0, y)] = getWall()
            map[XYtoCoords(width - 1, y)] = getWall()
        }
        for (let x = 0; x < width; x++) {
            map[XYtoCoords(x, 0)] = getWall()
            map[XYtoCoords(x, height - 1)] = getWall()
        }

        return map
    }

    iterate(map: GameMap, width: number, height: number): GameMap {
        // generate n random coordinates
        const randomCoordinates: string[] = []
        const n = 450 // Number of random coordinates to generate

        for (let i = 0; i < n; i++) {
            const x = Math.floor(Math.random() * width)
            const y = Math.floor(Math.random() * height)
            randomCoordinates.push(XYtoCoords(x, y))
        }

        randomCoordinates.forEach((coords) => {
            const [x, y] = CoordsToXY(coords)
            let wallCount = this.countWalls(map, x, y, width, height)

            if (wallCount >= 5) {
                map[coords] = getWall()
            } else {
                map[coords] = getFloor()
            }
        })

        // for (let y = 0; y < height; y++) {
        //     for (let x = 0; x < width; x++) {
        //         let wallCount = this.countWalls(map, x, y, width, height)

        //         if (wallCount >= 5) {
        //             newMap[XYtoCoords(x, y)] = getWall()
        //         } else {
        //             newMap[XYtoCoords(x, y)] = getFloor()
        //         }
        //     }
        // }

        return map
    }

    countWalls(
        map: GameMap,
        x: number,
        y: number,
        width: number,
        height: number
    ): number {
        let count = 0

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nx = x + dx
                let ny = y + dy

                if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
                    count++
                } else if (map[XYtoCoords(nx, ny)]?.isWalkable === false) {
                    count++
                }
            }
        }

        return count
    }
}

// helper function to seed map with random walls
function seedMap(width: number, height: number): GameMap {
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

import { Map, XYtoCoords } from '../../game/game'
import { MapGenerationAlgorithm } from '../abstract'
import { CardinalDirection } from '../enums'
import { getFloor, getWall } from '../tiles'

class RandomWalk implements MapGenerationAlgorithm {
    nFloors: number
    percentFloor: number
    nFloorsGoal: number
    iterations: number
    centerWeight: number
    previousDirectionWeight: number

    drunkardX: number
    drunkardY: number
    previousDirection: CardinalDirection

    level: Map

    constructor() {
        this.nFloors = 0
        this.nFloorsGoal = 0
        this.percentFloor = 0.4
        this.iterations = 25000 // in case percentage goal is never reached
        this.centerWeight = 0.15
        this.previousDirectionWeight = 0.7

        this.drunkardX = 0
        this.drunkardY = 0
        this.previousDirection = CardinalDirection.East

        this.level = {}
    }

    generate(width: number, height: number): Map {
        this.drunkardX = Math.round(2 + Math.random() * (width - 2))
        this.drunkardY = Math.round(2 + Math.random() * (height - 2))

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let coord = XYtoCoords(x, y)
                this.level[coord] = getWall()
            }
        }
        this.nFloorsGoal = width * height * this.percentFloor

        for (let i = 0; i < this.iterations; i++) {
            this.walk(width, height)
            if (this.nFloors >= this.nFloorsGoal) {
                break
            }
        }

        return this.level
    }

    walk(width: number, height: number) {
        let directions = {
            north: 1,
            east: 1,
            south: 1,
            west: 1,
        }

        // direct the drunkard away from the edges
        if (this.drunkardX < width * 0.25) {
            directions.east += this.centerWeight
        } else if (this.drunkardX > width * 0.75) {
            directions.west += this.centerWeight
        }
        if (this.drunkardY < height * 0.25) {
            directions.north += this.centerWeight
        } else if (this.drunkardY > height * 0.75) {
            directions.south += this.centerWeight
        }

        // direct the drunkard to go back where he came from
        if (this.previousDirection === CardinalDirection.North) {
            directions.north += this.previousDirectionWeight
        } else if (this.previousDirection === CardinalDirection.East) {
            directions.east += this.previousDirectionWeight
        } else if (this.previousDirection === CardinalDirection.South) {
            directions.south += this.previousDirectionWeight
        } else if (this.previousDirection === CardinalDirection.West) {
            directions.west += this.previousDirectionWeight
        }

        // normalize direction probabilities
        const total =
            directions.north +
            directions.east +
            directions.south +
            directions.west
        directions.north /= total
        directions.east /= total
        directions.south /= total
        directions.west /= total

        // choose direction
        let dx = 0
        let dy = 0
        let direction = CardinalDirection.North
        const rand = Math.random()
        if (0 <= rand && rand <= directions.north) {
            dx = 0
            dy = -1
            direction = CardinalDirection.North
        } else if (
            directions.north <= rand &&
            rand <= directions.north + directions.south
        ) {
            dx = 0
            dy = 1
            direction = CardinalDirection.South
        } else if (
            directions.north + directions.south <= rand &&
            rand <= directions.north + directions.south + directions.east
        ) {
            dx = 1
            dy = 0
            direction = CardinalDirection.East
        } else {
            dx = -1
            dy = 0
            direction = CardinalDirection.West
        }

        // walk
        if (
            1 < this.drunkardX + dx &&
            this.drunkardX + dx < width - 2 &&
            1 < this.drunkardY + dy &&
            this.drunkardY + dy < height - 2
        ) {
            this.drunkardX += dx
            this.drunkardY += dy

            console.log(`Drunkard at ${this.drunkardX}, ${this.drunkardY}`)

            let tile = this.level[XYtoCoords(this.drunkardX, this.drunkardY)]
            if (tile?.isWalkable === false) {
                this.level[XYtoCoords(this.drunkardX, this.drunkardY)] =
                    getFloor()
                this.nFloors++
                this.previousDirection = direction
            }
        }
    }
}

export { RandomWalk }

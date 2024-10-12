// Algorithm from https://www.albertford.com/shadowcasting
import { Tile } from '../game/tile'

enum CardinalDirection {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}

const CARDINALS = [
    CardinalDirection.North,
    CardinalDirection.East,
    CardinalDirection.South,
    CardinalDirection.West,
]

// A Quadrant represents a 90 degrees subset of the fov circle pointing towards
// the cardinal directions. Quadrants are traversed line by line (line of tiles,
// vertical for East and West, horizontal for North and South)
class Quadrant {
    originX: number
    originY: number

    cardinal: CardinalDirection

    constructor(originX: number, originY: number, cardinal: CardinalDirection) {
        this.originX = originX
        this.originY = originY
        this.cardinal = cardinal
    }

    // Convert a location in the current quadrant relative to the origin into
    // absolute coordinates in the map grid
    transform(row: number, col: number) {
        if (this.cardinal === CardinalDirection.North) {
            return `${this.originX + col}, ${this.originY - row}`
        }
        if (this.cardinal === CardinalDirection.South) {
            return `${this.originX + col}, ${this.originY + row}`
        }
        if (this.cardinal === CardinalDirection.East) {
            return `${this.originX + row}, ${this.originY + col}`
        }
        if (this.cardinal === CardinalDirection.West) {
            return `${this.originX - row}, ${this.originY + col}`
        }
        throw Error(`Invalid cardinal ${this.cardinal}, must be in range [0-3]`)
    }
}

// Row represents a line of tiles bound between a start and end slope.
class Row {
    depth: number // distance between the row and the quadrants origin
    startSlope: number
    endSlope: number

    constructor(depth: number, startSlope: number, endSlope: number) {
        this.depth = depth
        this.startSlope = startSlope
        this.endSlope = endSlope
    }

    *tiles() {
        // ! Make sure this actually rounds correctly in JS
        const minCol = Math.round(this.depth * this.startSlope)
        const maxCol = Math.round(this.depth * this.endSlope)

        for (let col = minCol; col <= maxCol; col++) {
            yield { depth: this.depth, col }
        }
    }

    next() {
        return new Row(this.depth + 1, this.startSlope, this.endSlope)
    }
}

function getSlope(row: number, col: number): number {
    return (2 * col - 1) / (2 * row)
}



export function calculateFOV(
    map: Record<string, Tile>,
    originX: number,
    originY: number,
    radius: number
) {
    CARDINALS.forEach((cardinal) => {
        const quadrant = new Quadrant(originX, originY, cardinal)
        const firstRow = new Row(1, -1, 1)
        scan(map, quadrant, firstRow)
    })
}

function isSymmetric(row: Row, depth: number, col: number) {
    return (col >= depth * row.startSlope && col <= row.depth * row.endSlope)
}


function scan(map: Record<string, Tile>, quadrant: Quadrant, row: Row) {
    let previousCoord: string = ""

    let fovMap = {}

    function reveal(coord: string) {
        fovMap[coord] = true
    }

    function isWall(coord: string) {
        return !map[coord].isTransparent
    }

    function isFloor(coord: string) {
        return map[coord].isTransparent
    }

    for (const tile of row.tiles()) {
        const coord = quadrant.transform(tile.depth, tile.col)
        if (isWall(coord) || isSymmetric(row, tile.depth, tile.col)) {
            reveal(coord)
        }
        if (isWall(previousCoord) && isFloor(coord)) {
            row.startSlope = getSlope(tile.depth, tile.col)
        }
        if (isFloor(previousCoord) && isWall(coord)) {
            const nextRow = row.next()
            nextRow.endSlope = getSlope(tile.depth, tile.col)
            scan(map, quadrant, nextRow)
        }
        previousCoord = coord
    }
    if (isFloor(previousCoord)) {
        scan(map, quadrant, row.next())
    }
}
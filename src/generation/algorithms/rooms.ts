import { GameMap } from '../../game/game'
import { Tile } from '../../game/tile'
import { getFloor, getWall } from '../tiles'

interface RectangularRoom {
    x0: number
    y0: number
    x1: number
    y1: number
}

interface Point {
    x: number
    y: number
}

function createRectangularRoom(
    x0: number,
    y0: number,
    width: number,
    height: number
): RectangularRoom {
    return { x0, y0, x1: x0 + width, y1: y0 + height }
}

function getRoomCenter(room: RectangularRoom): Point {
    return {
        x: Math.floor((room.x0 + room.x1) / 2),
        y: Math.floor((room.y0 + room.y1) / 2),
    }
}

function getInnerArea(room: RectangularRoom): [number, number][] {
    let area: [number, number][] = []
    for (let x = room.x0 + 1; x < room.x1; x++) {
        for (let y = room.y0 + 1; y < room.y1; y++) {
            area.push([x, y])
        }
    }
    return area
}

/**
 * Generates a simple L-shaped tunnel between two points.
 *
 * @param p1 - The starting point of the tunnel.
 * @param p2 - The ending point of the tunnel.
 * @returns An array of coordinates representing the tunnel path.
 */
function getSimpleTunnel(p1: Point, p2: Point): [number, number][] {
    let tunnel: [number, number][] = []

    for (let x = Math.min(p1.x, p2.x); x <= Math.max(p1.x, p2.x); x++) {
        tunnel.push([x, p1.y])
    }
    for (let y = Math.min(p1.y, p2.y); y <= Math.max(p1.y, p2.y); y++) {
        tunnel.push([p2.x, y])
    }

    return tunnel
}

function paintRoom(map: GameMap<Tile>, room: RectangularRoom) {
    // Fill the room with floor tiles
    getInnerArea(room).forEach(([x, y]) => {
        map.set(x, y, getFloor())
    })
    // Fill the edges with wall tiles
    for (let x = room.x0; x <= room.x1; x++) {
        map.set(x, room.y0, getWall())
        map.set(x, room.y1, getWall())
    }
    for (let y = room.y0; y <= room.y1; y++) {
        map.set(room.x0, y, getWall())
        map.set(room.x1, y, getWall())
    }
}

function paintTunnel(map: GameMap<Tile>, tunnel: [number, number][]) {
    // Fill the tunnel with floor tiles
    tunnel.forEach(([x, y]) => {
        map.set(x, y, getFloor())
    })
    // Fill the edges with wall tiles, except for the tunnel endpoints

    function isEmpty(x: number, y: number) {
        return map.get(x, y) === undefined
    }

    tunnel.forEach(([x, y], idx) => {
        // get all surrounding tiles, including diagonals
        let surroundingTiles: [number, number][] = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y + 1],
        ]
        surroundingTiles.forEach(([x, y]) => {
            if (isEmpty(x, y)) {
                map.set(x, y, getWall())
            }
        })
    })
}

function generate(width: number, height: number): GameMap<Tile> {
    let map = new GameMap<Tile>()

    let rooms = [
        createRectangularRoom(3, 27, 10, 8),
        createRectangularRoom(20, 15, 10, 10),
        createRectangularRoom(37, 15, 10, 9),
        createRectangularRoom(36, 26, 10, 4),
    ]

    rooms.forEach((room) => {
        paintRoom(map, room)
    })

    // connect all rooms with tunnels
    for (let roomIndex = 0; roomIndex < rooms.length - 1; roomIndex++) {
        let room1 = rooms[roomIndex]
        let room2 = rooms[roomIndex + 1]
        let room1Center = getRoomCenter(room1)
        let room2Center = getRoomCenter(room2)

        let tunnel = getSimpleTunnel(room1Center, room2Center)

        paintTunnel(map, tunnel)
    }

    return map
}

export { generate }

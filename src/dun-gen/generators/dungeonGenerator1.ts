// https://github.com/a327ex/blog/issues/7

import { AbstractDungeonGenerator } from '../abstract'
import { TileType } from '../tiles'

type Grid = number[][]

class Room {
    private vx: number
    private vy: number

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vx = 1
        this.vy = 1
    }

    public getCenter(): { x: number; y: number } {
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y + Math.floor(this.height / 2),
        }
    }

    public move(): void {
        this.x = this.x + this.vx
        this.y = this.y + this.vy
    }

    public snapToGrid(): void {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        this.width = Math.floor(this.width)
        this.height = Math.floor(this.height)
    }

    public repulse(other: Room): void {
        const dx = this.x - other.x
        const dy = this.y - other.y

        // move this room apart by one unit form the center of the other room
        if (dx > 0) {
            this.vx = 1
        } else {
            this.vx = -1
        }
        if (dy > 0) {
            this.vy = 1
        } else {
            this.vy = -1
        }
    }

    public collidesWith(other: Room): boolean {
        return (
            this.x < other.x + other.width + 1 &&
            this.x + this.width + 1 > other.x &&
            this.y < other.y + other.height + 1 &&
            this.y + this.height + 1 > other.y
        )
    }
}

class DungeonGenerator1 implements AbstractDungeonGenerator {
    public grid: Grid
    public centerX: number
    public centerY: number
    public maxRoomWidth: number
    public maxRoomHeight: number

    public rooms: Room[] = []

    constructor(
        public width: number,
        public height: number
    ) {
        this.width = width
        this.centerX = Math.floor(width / 2)
        this.height = height
        this.centerY = Math.floor(height / 2)

        this.maxRoomWidth = 10
        this.maxRoomHeight = 10

        this.grid = []
        // fill the grid with walls
        for (let i = 0; i < height; i++) {
            this.grid.push([])
            for (let j = 0; j < width; j++) {
                this.grid[i].push(TileType.Wall)
            }
        }
    }

    private isValidRoom(room: Room): boolean {
        // a room is valid when its it is within the bounds of the dungeon
        // and does not have height or width of <= 1
        return (
            room.x >= 0 &&
            room.y >= 0 &&
            room.x + room.width < this.width &&
            room.y + room.height < this.height &&
            room.width > 3 &&
            room.height > 3
        )
    }

    public *generate(): Generator<Grid, Grid, void> {
        const nRooms = 30
        const dungeonRadius = 25

        while (this.rooms.length < nRooms) {
            const room = this.createRandomRoom(dungeonRadius / 4)
            if (!this.isValidRoom(room)) {
                continue
            }
            this.addRoom(room)
        }

        this.clear()
        this.paintRooms()

        for (let i = 0; i < 200; i++) {
            this.repulseRooms()
            this.clear()
            this.paintRooms()
            yield this.grid
        }

        // remove any room that is off the grid
        this.rooms = this.rooms.filter((room) => this.isValidRoom(room))
        this.clear()
        this.paintRooms()

        return this.grid
    }

    paintRoom(room: Room): void {
        for (let x = room.x; x < room.x + room.width; x++) {
            for (let y = room.y; y < room.y + room.height; y++) {
                if (this.grid[y] === undefined) {
                    continue
                }
                this.grid[y][x] = TileType.Floor
            }
        }
    }

    clear(): void {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = TileType.Wall
            }
        }
    }

    paintRooms(): void {
        this.rooms.forEach((room) => {
            this.paintRoom(room)
        })
    }

    private createRandomRoom(radius: number): Room {
        // create a new random room in a circle dfined by radius from origin of
        // the center of the dungeon
        const width = 1 + Math.random() * this.maxRoomWidth
        const height = 1 + Math.random() * this.maxRoomHeight
        const t = 2 * Math.PI * Math.random()
        let u = Math.random() + Math.random()
        let r: number
        if (u > 1) {
            r = 2 - u
        } else {
            r = u
        }
        const x = radius * r * Math.cos(t) + this.centerX
        const y = radius * r * Math.sin(t) + this.centerY

        const room = new Room(x, y, width, height)
        room.snapToGrid()

        return room
    }

    private addRoom(room: Room): void {
        this.rooms.push(room)
    }

    private repulseRooms(): void {
        this.rooms.forEach((room) => {
            this.rooms.forEach((other) => {
                if (room !== other && room.collidesWith(other)) {
                    room.repulse(other)
                    other.repulse(room)
                    room.move()
                    other.move()
                }
            })
        })
    }
}

export { DungeonGenerator1, Grid }

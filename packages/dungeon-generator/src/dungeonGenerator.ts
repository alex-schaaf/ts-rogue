// https://github.com/a327ex/blog/issues/7

type Grid = number[][]

// 0 = wall
// 1 = floor
// 2 = door
// 3 = corridor

class DungeonGenerator {
    public grid: Grid
    public centerX: number
    public centerY: number
    public maxRoomWidth: number
    public maxRoomHeight: number
    
    public rooms = {}

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

        this.grid = new Array(height).fill(0).map(() => new Array(width).fill(0))
    }

    getRandomRoom(radius: number) {
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
    }
}

export { DungeonGenerator }


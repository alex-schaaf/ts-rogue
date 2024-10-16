import { Tile } from './tile'

class GameMap {
    private BIT_LENGTH = 16
    private map: Record<number, Tile> = {}

    private packCoords(x: number, y: number): number {
        return (x << this.BIT_LENGTH) | y
    }

    private unpackCoords(packed: number): [number, number] {
        const x = packed >> this.BIT_LENGTH
        const y = packed & ((1 << this.BIT_LENGTH) - 1)
        return [x, y]
    }

    public get(x: number, y: number): Tile {
        return this.map[this.packCoords(x, y)]
    }

    public set(x: number, y: number, tile: Tile) {
        this.map[this.packCoords(x, y)] = tile
    }

    public delete(x: number, y: number) {
        delete this.map[this.packCoords(x, y)]
    }

    public getCoords(): [number, number][] {
        return Object.keys(this.map).map(Number).map(this.unpackCoords)
    }
}

export { GameMap }

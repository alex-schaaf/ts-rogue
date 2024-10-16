import { Tile } from './tile'

class GameMap {
    private BIT_LENGTH = 16
    private map: Map<number, Tile> = new Map()

    private packCoords(x: number, y: number): number {
        return (x << this.BIT_LENGTH) | y
    }

    private unpackCoords(packed: number): [number, number] {
        const x = packed >> this.BIT_LENGTH
        const y = packed & ((1 << this.BIT_LENGTH) - 1)
        return [x, y]
    }

    public get(x: number, y: number): Tile | undefined {
        return this.map.get(this.packCoords(x, y))
    }

    public set(x: number, y: number, tile: Tile) {
        this.map.set(this.packCoords(x, y), tile)
    }

    public delete(x: number, y: number) {
        delete this.map[this.packCoords(x, y)]
    }

    public *getCoords() {
        for (const packed of this.map.keys()) {
            yield this.unpackCoords(packed)
        }
    }
}

export { GameMap }

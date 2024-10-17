/**
 * The GameMap class represents a sparse 2D grid map where each coordinate is
 * mapped to a value of type T.
 *
 * It uses bitwise operations to pack and unpack coordinates into a single
 * number for efficient storage in a Map.
 */
class GameMap<T> {
    /**
     * The number of bits used to represent each coordinate. This allows for a
     * maximum coordinate value of 2^BIT_LENGTH - 1.
     */
    private BIT_LENGTH = 16

    /**
     * The internal map that stores the packed coordinates as keys and the
     * values of type T.
     */
    private map: Map<number, T> = new Map()

    /**
     * Packs two coordinates (x, y) into a single number using bitwise
     * operations.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @returns The packed coordinates as a single number.
     */
    private packCoords(x: number, y: number): number {
        return (x << this.BIT_LENGTH) | y
    }

    /**
     * Unpacks a single number into two coordinates (x, y) using bitwise
     * operations.
     * @param packed - The packed coordinates as a single number.
     * @returns A tuple containing the x and y coordinates.
     */
    private unpackCoords(packed: number): [number, number] {
        const x = packed >> this.BIT_LENGTH
        const y = packed & ((1 << this.BIT_LENGTH) - 1)
        return [x, y]
    }

    /**
     * Retrieves the value T at the specified coordinates.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @returns The value at the specified coordinates, or undefined if no value
     * is set.
     */
    public get(x: number, y: number): T | undefined {
        return this.map.get(this.packCoords(x, y))
    }

    /**
     * Sets the value T at the specified coordinates.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @param tile - The value to set at the specified coordinates.
     */
    public set(x: number, y: number, tile: T) {
        this.map.set(this.packCoords(x, y), tile)
    }

    /**
     * Deletes the value at the specified coordinates.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     */
    public delete(x: number, y: number) {
        delete this.map[this.packCoords(x, y)]
    }

    /**
     * Returns a generator that yields all the coordinates in the map.
     * @returns A generator that yields tuples of x and y coordinates.
     */
    public *getCoords(): Generator<[number, number]> {
        for (const packed of this.map.keys()) {
            yield this.unpackCoords(packed)
        }
    }
}

export { GameMap }

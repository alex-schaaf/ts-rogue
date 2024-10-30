import { TileType } from '@dun-gen/tiles'
import { Grid } from './dungeonGenerator1'

/**
 * A random dungeon generator that uses noise to generate a very basic dungeon
 * for testing purposes.
 */
class NoiseRandomDungeonGenerator {
    public constructor(
        private width: number,
        private height: number
    ) {
        this.width = width
        this.height = height
    }

    *generate(): Generator<Grid, Grid, unknown> {
        const grid: Grid = []

        for (let y = 0; y < this.height; y++) {
            grid.push([])
            for (let x = 0; x < this.width; x++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.width - 1 ||
                    y === this.height - 1
                ) {
                    grid[y].push(TileType.Wall)
                } else {
                    grid[y].push(
                        Math.random() > 0.5 ? TileType.Floor : TileType.Wall
                    )
                }
            }
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {}
        }
        return grid
    }
}

export { NoiseRandomDungeonGenerator }

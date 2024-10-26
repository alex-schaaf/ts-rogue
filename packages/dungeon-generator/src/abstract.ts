type Grid = number[][]

abstract class AbstractDungeonGenerator {
    abstract generate(): Generator<Grid, Grid, unknown>
}

export { AbstractDungeonGenerator }

interface Tile {
    char: string
    colorFg: string
    colorBg: string

    isWalkable: boolean
    isTransparent: boolean
    isExplored: boolean
}

export { Tile }

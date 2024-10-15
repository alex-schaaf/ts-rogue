import * as ROT from 'rot-js'
import { Tile } from './tile'
import { ECS } from '../ecs/ecs'

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

interface Level {
    map: GameMap
}

interface GameSettings {
    fovRadius: number
}

class Game {
    display: ROT.Display
    level: Level
    settings: GameSettings

    public ecs = new ECS()

    constructor(width: number, height: number) {
        this.display = new ROT.Display({
            width: width,
            height: height,
            fontSize: 14,
        })
        const displayContainer = this.display.getContainer()
        if (!displayContainer) {
            throw new Error('Display container not found')
        }
        const mapElement = document.getElementById('map')
        if (!mapElement) {
            throw new Error('Map element not found')
        }
        mapElement.appendChild(displayContainer)

        this.level = {
            map: new GameMap(),
        }

        this.settings = {
            fovRadius: 6,
        }

        console.debug('Game initialized')
    }
}

export { Game, GameMap }

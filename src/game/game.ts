import * as ROT from 'rot-js'
import { Tile } from './tile'
import { Entity } from '../ecs/entity'
import { ECS } from '../ecs/ecs'

type GameMap = Record<string, Tile>

function XYtoCoords(x: number, y: number) {
    return `${x},${y}`
}

function CoordsToXY(coords: string): [number, number] {
    const [x, y] = coords.split(',').map(Number)
    return [x, y]
}

interface Level {
    map: GameMap
    entities: Entity[]
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
            map: {},
            entities: [],
        }

        this.settings = {
            fovRadius: 6,
        }

        console.debug('Game initialized')
    }
}

export { Game, GameMap, XYtoCoords, CoordsToXY }

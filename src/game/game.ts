import * as ROT from 'rot-js'
import { Tile } from './tile'
import { Entity } from '../ecs/entity'

type Map = Record<string, Tile>

function XYtoCoords(x: number, y: number) {
    return `${x},${y}`
}

function CoordsToXY(coords: string): [number, number] {
    const [x, y] = coords.split(',').map(Number)
    return [x, y]
}

interface Level {
    map: Map
    entities: Entity[]
}

interface GameSettings {
    fovRadius: number
}

interface GameInterface {
    display: ROT.Display
    level: Level

    player: Entity

    settings: GameSettings
}

class Game implements GameInterface {
    display: ROT.Display
    level: Level
    player: Entity
    settings: GameSettings

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

        this.player = new Entity()

        this.settings = {
            fovRadius: 6,
        }

        console.debug('Game initialized')
    }
}

export { Game, Map, XYtoCoords, CoordsToXY }

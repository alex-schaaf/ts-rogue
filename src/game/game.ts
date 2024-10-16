import * as ROT from 'rot-js'
import { ECS } from '../lib/ecs'
import { GameMap } from './gameMap'

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

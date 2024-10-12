import * as ROT from 'rot-js'
import { Tile } from './tile'
import { Entity } from '../ecs/entity'

type Map = Record<string, Tile>

interface Level {
    map: Map
    entities: Entity[]
}

interface GameInterface {
    display: ROT.Display
    level: Level

    player: Entity
}

class Game implements GameInterface {
    display: ROT.Display
    level: Level
    player: Entity

    constructor() {
        this.display = new ROT.Display({ width: 60, height: 24, fontSize: 24 })
        const displayContainer = this.display.getContainer()
        if (!displayContainer) {
            throw new Error('Display container not found')
        }
        document.body.appendChild(displayContainer)

        this.level = {
            map: {},
            entities: [],
        }

        this.player = new Entity()

        console.debug('Game initialized')
    }
}

export { Game, Map }

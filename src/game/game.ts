import * as ROT from 'rot-js'
import { ECS } from '@lib/ecs'
import { GameMap } from '@lib/gameMap'
import { Tile } from './tile'
import { IsPlayer } from '@components/IsPlayer'
import { Position } from '@components/Position'
import { BlockMovement } from '@components/BlockMovement'
import { Health } from '@components/Health'
import { Renderable } from '@components/Renderable'
import { Faction, FactionName } from '@components/Faction'
import { Name } from '@components/Name'
import { Inventory } from '@components/Inventory'
import { generate } from 'src/generation/algorithms/simpleLevel'

interface Level {
    number: number
    map: GameMap<Tile>
}

interface GameSettings {
    fovRadius: number
}

class Game {
    display: ROT.Display
    level: Level
    settings: GameSettings

    public ecs = new ECS()
    public playerEntity: number

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
            number: 1,
            map: generate(width, height),
        }

        this.settings = {
            fovRadius: 6,
        }

        const player = this.ecs.addEntity()
        this.playerEntity = player
        this.ecs.addComponent(player, new IsPlayer())
        this.ecs.addComponent(player, new Position(Math.floor(width / 2), Math.floor(height / 2)))
        this.ecs.addComponent(player, new Renderable('@', '#de935f', '#000'))
        this.ecs.addComponent(player, new BlockMovement())
        this.ecs.addComponent(player, new Health(10, 10))
        this.ecs.addComponent(player, new Faction(FactionName.Player))
        this.ecs.addComponent(player, new Name('Player'))
        this.ecs.addComponent(player, new Inventory())

        console.debug('Game initialized')
    }
}

export { Game, GameMap }

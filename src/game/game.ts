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
import { DisplayOptions } from 'rot-js/lib/display/types'

interface Level {
    map: GameMap<Tile>
}

interface GameSettings {
    fovRadius: number
}

class Game {
    display: ROT.Display
    settings: GameSettings

    levels: Level[] = []
    currentLevel: number = 0

    public ecs = new ECS()
    public playerEntity: number

    constructor(width: number, height: number) {
        this.display = registerDisplay({
            width: width,
            height: height,
            fontSize: 14,
        })

        this.levels.push({
            map: generate(width, height),
        })

        this.settings = {
            fovRadius: 6,
        }

        const player = this.ecs.addEntity()
        this.playerEntity = player
        this.ecs.addComponent(player, new IsPlayer())
        this.ecs.addComponent(
            player,
            new Position(Math.floor(width / 2), Math.floor(height / 2))
        )
        this.ecs.addComponent(player, new Renderable('@', '#de935f', '#000'))
        this.ecs.addComponent(player, new BlockMovement())
        this.ecs.addComponent(player, new Health(10, 10))
        this.ecs.addComponent(player, new Faction(FactionName.Player))
        this.ecs.addComponent(player, new Name('Player'))
        this.ecs.addComponent(player, new Inventory())

        console.debug('Game initialized')
    }

    /**
     * Retrieves the current level object.
     */
    public getLevel(): Level {
        return this.levels[this.currentLevel]
    }

    /**
     * Retrieves the current game map.
     */
    public getMap(): GameMap<Tile> {
        return this.getLevel().map
    }

    /**
     * Progresses the game to the next level.
     *
     * This method is called when the player character reaches the exit of the
     * current level. It generates a new level map and increments the current
     * level counter.
     */
    public nextLevel(width: number, height: number): void {
        this.levels.push({
            map: generate(width, height),
        })
        this.currentLevel++
    }
}

export { Game, GameMap }

/**
 * Registers and initializes a ROT.js display with the given settings.
 *
 * This function creates a new ROT.Display instance using the provided settings,
 * retrieves its container element, and appends it to the DOM element with the ID 'map'.
 *
 * @param settings - A partial object of DisplayOptions to configure the display.
 * @returns The initialized ROT.Display instance.
 * @throws Will throw an error if the display container or the map element is not found.
 */
function registerDisplay(settings: Partial<DisplayOptions>): ROT.Display {
    const display = new ROT.Display(settings)
    const displayContainer = display.getContainer()
    if (!displayContainer) {
        throw new Error('Display container not found')
    }
    const mapElement = document.getElementById('map')
    if (!mapElement) {
        throw new Error('Map element not found')
    }
    mapElement.appendChild(displayContainer)
    return display
}

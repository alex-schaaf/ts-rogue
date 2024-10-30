import * as ROT from 'rot-js'
import { ComponentContainer, ECS } from '@lib/ecs'
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
import { DisplayOptions } from 'rot-js/lib/display/types'

interface Level {
    // The map of the level
    map: GameMap<Tile>
    // Entities belonging to this level that are not currently active in the ECS
    storedEntities: ComponentContainer[]
}

interface GameSettings {
    fovRadius: number
}

function generate(width: number, height: number): GameMap<Tile> {
    const gameMap = new GameMap<Tile>()

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = Math.random() > 0.8 ? 0 : 1
            if (tile === 0) {
                gameMap.set(x, y, {
                    char: '#',
                    colorFg: '#657b83',
                    colorBg: '#002b36',
                    isWalkable: false,
                    isTransparent: false,
                    isExplored: false,
                })
            } else {
                gameMap.set(x, y, {
                    char: '.',
                    colorFg: '#073642',
                    colorBg: '#002b36',
                    isWalkable: true,
                    isTransparent: true,
                    isExplored: false,
                })
            }
        }
    }

    return gameMap
}

class Game {
    display: ROT.Display
    settings: GameSettings

    levels: Level[] = []
    currentLevel: number = 0

    public ecs = new ECS()
    public playerEntity: number
    private displayWidth: number
    private displayHeight: number

    constructor(width: number, height: number) {
        this.displayWidth = width
        this.displayHeight = height

        this.display = registerDisplay({
            width: width,
            height: height,
            fontSize: 14,
        })

        this.levels.push({
            map: generate(width, height),
            storedEntities: [],
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
    public nextLevel(): void {
        this.levels.push({
            map: generate(this.displayWidth, this.displayHeight),
            storedEntities: [],
        })
        this.storeEntitiesOf(this.currentLevel)
        this.currentLevel++
    }

    /**
     * Navigates to the previous level in the game. If the current level is
     * greater than 0, it decrements the current level. After updating the
     * level, it restores the entities of the new current level.
     */
    public previousLevel(): void {
        if (this.currentLevel > 0) {
            this.currentLevel--
        }
        this.restoreEntitiesOf(this.currentLevel)
    }

    /**
     * Stores entities of a specified level that have a Position component.
     *
     * This method iterates through all entities managed by the ECS (Entity
     * Component System). If an entity is not the player entity and has a
     * Position component, it is stored in the specified level's storedEntities
     * array and then removed from the ECS.
     *
     * @param level - The level number whose entities are to be stored.
     *
     * @remarks
     * - Player entity is skipped and not stored.
     * - Only entities with a Position component are stored.
     * - After storing, the entity is removed from the ECS.
     */
    private storeEntitiesOf(level: number): void {
        const entities = this.ecs.getEntities()
        for (const [entitiy, components] of entities) {
            if (entitiy === this.playerEntity) {
                continue
            }
            if (components.has(Position)) {
                this.levels[level].storedEntities.push(components)
                this.ecs.removeEntity(entitiy)
            }
        }
    }

    /**
     * Restores the entities of a specified level by adding them back to the ECS
     * (Entity Component System).
     *
     * @param level - The level number whose entities are to be restored.
     *
     * This method iterates through the stored entities of the specified level,
     * adds each entity back to the ECS, and then clears the stored entities
     * list for that level.
     */
    private restoreEntitiesOf(level: number): void {
        for (const components of this.levels[level].storedEntities) {
            const entity = this.ecs.addEntity()
            for (const component of components.getAll()) {
                this.ecs.addComponent(entity, component)
            }
        }
        this.levels[level].storedEntities = []
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

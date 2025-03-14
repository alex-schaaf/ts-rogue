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
import { Camera } from './camera'
import { GameSettings } from './gameSettings'
import { DungeonGenerator1, Grid, TileType } from '@dun-gen/index'
import { NoiseRandomDungeonGenerator } from '@dun-gen/generators/noiseDungeonGenerator'

interface Level {
    // The map of the level
    map: GameMap<Tile>
    // Entities belonging to this level that are not currently active in the ECS
    storedEntities: ComponentContainer[]
}

function isUnreachable(grid: Grid, x: number, y: number): boolean {
    const directions = [
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 }, // right
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 }, // down
    ]

    for (const { dx, dy } of directions) {
        const nx = x + dx
        const ny = y + dy

        if (nx < 0 || ny < 0 || nx >= grid[0].length || ny >= grid.length) {
            continue // out of bounds, count as wall
        }

        if (grid[ny][nx] !== TileType.Wall) {
            return false
        }
    }

    return true
}

function convertGridToMap(grid: Grid): GameMap<Tile> {
    const gameMap = new GameMap<Tile>()

    const height = grid.length
    const width = grid[0].length

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (isUnreachable(grid, x, y)) {
                continue
            }
            const tile = grid[y][x]
            switch (tile) {
                case TileType.Wall:
                    gameMap.set(x, y, {
                        char: '#',
                        colorFg: '#666',
                        colorBg: '#000',
                        isWalkable: false,
                        isTransparent: false,
                        isExplored: false,
                    })
                    break
                case TileType.Floor:
                    gameMap.set(x, y, {
                        char: '.',
                        colorFg: '#222',
                        colorBg: '#000',
                        isWalkable: true,
                        isTransparent: true,
                        isExplored: false,
                    })
                    break
                case TileType.Door:
                    gameMap.set(x, y, {
                        char: '+',
                        colorFg: '#666',
                        colorBg: '#000',
                        isWalkable: false,
                        isTransparent: false,
                        isExplored: false,
                    })
                    break
                case TileType.Corridor:
                    gameMap.set(x, y, {
                        char: '.',
                        colorFg: '#222',
                        colorBg: '#000',
                        isWalkable: true,
                        isTransparent: true,
                        isExplored: false,
                    })
                    break
                default:
                    break
            }
        }
    }

    return gameMap
}

function generate(width: number, height: number): GameMap<Tile> {
    // const dunGen = new NoiseRandomDungeonGenerator(width, height)
    const dunGen = new DungeonGenerator1(width, height)

    // get the final value of the generator as the dungeon generators currently
    // yield the grid during the generation process for visualization
    const generator = dunGen.generate()
    let grid = generator.next().value
    while (!generator.next().done) {
        grid = generator.next().value
    }

    return convertGridToMap(grid)
}

class Game {
    display: ROT.Display

    levels: Level[] = []
    currentLevel: number = 0

    public ecs = new ECS()
    public playerEntity: number
    private displayWidth: number
    private displayHeight: number
    public camera: Camera

    constructor(public settings: GameSettings) {
        this.displayWidth = settings.cameraWidth
        this.displayHeight = settings.cameraHeight

        this.display = registerDisplay({
            width: this.displayWidth,
            height: this.displayHeight,
            fontSize: 26,
        })

        this.levels.push({
            map: generate(this.settings.mapWidth, this.settings.mapHeight),
            storedEntities: [],
        })

        const player = this.ecs.addEntity()
        this.playerEntity = player
        this.ecs.addComponent(player, new IsPlayer())

        const playerPosition = new Position(
            Math.floor(this.settings.mapWidth / 2),
            Math.floor(this.settings.mapHeight / 2)
        )

        // create a camera centered on the current player position
        this.camera = new Camera(
            this.displayWidth,
            this.displayHeight,
            playerPosition.x,
            playerPosition.y
        )

        this.ecs.addComponent(player, playerPosition)
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
            map: generate(this.settings.mapWidth, this.settings.mapHeight),
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

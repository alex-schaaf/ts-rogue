import { Game } from './game/game'
import { renderMap } from './render/mapRenderer'
import { generate } from './generation/algorithms/rooms'

import { InputSystem } from './ecs/systems/InputSystem'
import { IsPlayer, Location, Renderable } from './ecs/components/components'
import { EntityRenderSystem } from './ecs/systems/EntityRenderSystem'
import { MovementSystem } from './ecs/systems/MovementSystem'
import { CollisionSystem } from './ecs/systems/CollisionSystem'
import { Logger, LogLevel } from './lib/logger'

Logger.logLevel = LogLevel.WARN

function loop(game: Game) {
    game.display.clear()
    renderMap(game.display, game.level.map)
    game.ecs.update()

    // if (!playerLoc) {
    //     throw new Error('Player has no location component')
    // }
    // const fovMap = getFovMap(
    //     game.level.map,
    //     playerLoc.x,
    //     playerLoc.y,
    //     game.settings.fovRadius
    // )

    requestAnimationFrame(() => loop(game))
}

function main() {
    const mapWidth = 50
    const mapHeight = 40

    let map = generate(mapWidth, mapHeight)

    const game = new Game(mapWidth, mapHeight)
    game.level.map = map

    const renderSystem = new EntityRenderSystem(game.display)
    game.ecs.addSystem(renderSystem)

    const player = game.ecs.addEntity()
    game.ecs.addComponent(player, new IsPlayer())
    game.ecs.addComponent(player, new Location(25, 20))
    game.ecs.addComponent(player, new Renderable('@', '#ff0', '#000'))

    const inputSystem = new InputSystem(player)
    game.ecs.addSystem(inputSystem)

    const collisionSystem = new CollisionSystem(game.level.map)
    game.ecs.addSystem(collisionSystem)

    const movementSystem = new MovementSystem()
    game.ecs.addSystem(movementSystem)

    window.addEventListener('keydown', (event) =>
        inputSystem.handleInput(event)
    )

    requestAnimationFrame(() => loop(game))
}

main()

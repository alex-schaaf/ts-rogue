import { Game } from './game/game'
import { renderMap } from './render/mapRenderer'
import { generate } from './generation/algorithms/rooms'

import { InputSystem } from './ecs/systems/InputSystem'
import { EntityRenderSystem } from './ecs/systems/EntityRenderSystem'
import { MovementSystem } from './ecs/systems/MovementSystem'
import { CollisionSystem } from './ecs/systems/CollisionSystem'
import { Logger, LogLevel } from './lib/logger'
import { Renderable } from './ecs/components/Renderable'

import { Health } from './ecs/components/Health'
import { BlockMovement } from './ecs/components/BlockMovement'
import { IsPlayer } from './ecs/components/IsPlayer'
import { Position } from './ecs/components/Position'
import { loop } from './game/loop'

Logger.logLevel = LogLevel.WARN


function main() {
    const mapWidth = 50
    const mapHeight = 40

    const game = new Game(mapWidth, mapHeight)
    game.level.map = generate(mapWidth, mapHeight)

    const renderSystem = new EntityRenderSystem(game.display)
    game.ecs.addSystem(renderSystem)

    const player = game.ecs.addEntity()
    game.ecs.addComponent(player, new IsPlayer())
    game.ecs.addComponent(player, new Position(25, 20))
    game.ecs.addComponent(player, new Renderable('@', '#ff0', '#000'))
    game.ecs.addComponent(player, new BlockMovement())
    game.ecs.addComponent(player, new Health(10, 10))

    const rat = game.ecs.addEntity()
    game.ecs.addComponent(rat, new Position(30, 20))
    game.ecs.addComponent(rat, new Renderable('r', '#f00', '#000'))
    game.ecs.addComponent(rat, new BlockMovement())
    game.ecs.addComponent(rat, new Health(2, 2))

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

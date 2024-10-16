import { Game } from './game/game'

import { InputSystem } from './ecs/systems/InputSystem'
import { EntityRenderSystem } from './ecs/systems/EntityRenderSystem'
import { MovementSystem } from './ecs/systems/MovementSystem'
import { CollisionSystem } from './ecs/systems/CollisionSystem'
import { Logger, LogLevel } from './lib/logger'
import { Renderable } from './ecs/components/Renderable'

import { Health } from '@components/Health'
import { BlockMovement } from '@components/BlockMovement'
import { IsPlayer } from '@components/IsPlayer'
import { Position } from '@components/Position'
import { loop } from '@game/loop'
import { AiSystem } from '@systems/AiSystem'
import { IsEnemy } from '@components/IsEnemy'

Logger.logLevel = LogLevel.WARN

function initSystems(game: Game) {
    const collisionSystem = new CollisionSystem(game.level.map)
    game.ecs.addSystem(collisionSystem)

    const movementSystem = new MovementSystem()
    game.ecs.addSystem(movementSystem)

    const aiSystem = new AiSystem()
    game.ecs.addSystem(aiSystem)

    const renderSystem = new EntityRenderSystem(game.display)
    game.ecs.addSystem(renderSystem)
}

function main() {
    const mapWidth = 50
    const mapHeight = 40

    const game = new Game(mapWidth, mapHeight)

    const player = game.ecs.addEntity()
    game.ecs.addComponent(player, new IsPlayer())
    game.ecs.addComponent(player, new Position(25, 20))
    game.ecs.addComponent(player, new Renderable('@', '#de935f', '#000'))
    game.ecs.addComponent(player, new BlockMovement())
    game.ecs.addComponent(player, new Health(10, 10))

    const rat = game.ecs.addEntity()
    game.ecs.addComponent(rat, new Position(29, 20))
    game.ecs.addComponent(rat, new Renderable('r', '#CE422B', '#000'))
    game.ecs.addComponent(rat, new BlockMovement())
    game.ecs.addComponent(rat, new Health(2, 2))
    game.ecs.addComponent(rat, new IsEnemy())

    const inputSystem = new InputSystem(player)
    game.ecs.addSystem(inputSystem)

    window.addEventListener('keydown', (event) =>
        inputSystem.handleInput(event)
    )

    initSystems(game)

    requestAnimationFrame(() => loop(game))
}

main()

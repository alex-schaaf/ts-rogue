import { Game } from '@game/game'
import { InputSystem } from '@systems/InputSystem'
import { EntityRenderSystem } from '@systems/EntityRenderSystem'
import { MovementSystem } from '@systems/MovementSystem'
import { CollisionSystem } from '@systems/CollisionSystem'
import { Renderable } from './ecs/components/Renderable'
import { Health } from '@components/Health'
import { BlockMovement } from '@components/BlockMovement'
import { Position } from '@components/Position'
import { loop } from '@game/loop'
import { AiSystem } from '@systems/AiSystem'
import { PhysicalCombatSystem } from '@systems/PhysicalCombatSystem'
import { HealthSystem } from '@systems/HealthSystem'
import { Faction, FactionName } from '@components/Faction'
import { AiControlled } from '@components/AiControlled'
import { UiSystem } from '@systems/UiSystem'
import { Name } from '@components/Name'

function initSystems(game: Game) {
    const inputSystem = new InputSystem(game.playerEntity)
    game.ecs.addSystem(inputSystem)

    const aiSystem = new AiSystem(game.playerEntity, game.level.map)
    game.ecs.addSystem(aiSystem)

    const collisionSystem = new CollisionSystem(game.level.map)
    game.ecs.addSystem(collisionSystem)

    const physicalCombatSystem = new PhysicalCombatSystem()
    game.ecs.addSystem(physicalCombatSystem)

    const healthSystem = new HealthSystem()
    game.ecs.addSystem(healthSystem)

    const movementSystem = new MovementSystem()
    game.ecs.addSystem(movementSystem)

    const renderSystem = new EntityRenderSystem(game.display)
    game.ecs.addSystem(renderSystem)

    const uiSystem = new UiSystem(game.playerEntity)
    game.ecs.addSystem(uiSystem)
}

function main() {
    const mapWidth = 50
    const mapHeight = 40

    const game = new Game(mapWidth, mapHeight)

    const rat = game.ecs.addEntity()
    game.ecs.addComponent(rat, new Position(29, 20))
    game.ecs.addComponent(rat, new Renderable('r', '#CE422B', '#000'))
    game.ecs.addComponent(rat, new BlockMovement())
    game.ecs.addComponent(rat, new Health(2, 2))
    game.ecs.addComponent(rat, new Faction(FactionName.Enemy))
    game.ecs.addComponent(rat, new AiControlled())
    game.ecs.addComponent(rat, new Name("Rat"))

    initSystems(game)

    requestAnimationFrame(() => loop(game))
}

main()

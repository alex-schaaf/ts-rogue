import { Game } from '@game/game'
import { InputSystem } from '@systems/InputSystem'
import { EntityRenderSystem } from '@systems/EntityRenderSystem'
import { MovementSystem } from '@systems/MovementSystem'
import { CollisionSystem } from '@systems/CollisionSystem'
import { Renderable } from './ecs/components/Renderable'
import { Position } from '@components/Position'
import { loop } from '@game/loop'
import { AiSystem } from '@systems/AiSystem'
import { PhysicalCombatSystem } from '@systems/PhysicalCombatSystem'
import { HealthSystem } from '@systems/HealthSystem'
import { UiSystem } from '@systems/UiSystem'
import { InventorySystem } from '@systems/InventorySystem'
import { IsPocketable } from '@components/IsPocketable'
import { Name } from '@components/Name'
import { BlockMovement } from '@components/BlockMovement'
import { Health } from '@components/Health'
import { AiControlled } from '@components/AiControlled'
import { Faction, FactionName } from '@components/Faction'

function initSystems(game: Game) {
    const inputSystem = new InputSystem(game.playerEntity)
    game.ecs.addSystem(inputSystem)

    const aiSystem = new AiSystem(game.playerEntity, game.level.map)
    game.ecs.addSystem(aiSystem)

    const collisionSystem = new CollisionSystem(game.level.map)
    game.ecs.addSystem(collisionSystem)

    const inventorySystem = new InventorySystem()
    game.ecs.addSystem(inventorySystem)

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
    const mapWidth = 11
    const mapHeight = 7

    const game = new Game(mapWidth, mapHeight)

    // const rat = game.ecs.addEntity()
    // game.ecs.addComponent(rat, new Position(Math.floor(mapWidth / 2), Math.floor(mapHeight / 2)))
    // game.ecs.addComponent(rat, new Renderable('r', '#CE422B', '#000'))
    // game.ecs.addComponent(rat, new BlockMovement())
    // game.ecs.addComponent(rat, new Health(2, 2))
    // game.ecs.addComponent(rat, new Faction(FactionName.Enemy))
    // game.ecs.addComponent(rat, new AiControlled())
    // game.ecs.addComponent(rat, new Name("Rat"))

    const sword = game.ecs.addEntity()
    game.ecs.addComponent(sword, new Position(28, 20))
    game.ecs.addComponent(sword, new Renderable('\\', '#FFFFFF', '#000'))
    game.ecs.addComponent(sword, new IsPocketable())
    game.ecs.addComponent(sword, new Name("Greatsword +1"))

    initSystems(game)

    requestAnimationFrame(() => loop(game))
}

main()

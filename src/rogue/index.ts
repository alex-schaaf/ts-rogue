import { Game } from '@game/game'
import { InputSystem, KeyBindings } from '@systems/InputSystem'
import { EntityRenderSystem } from '@systems/EntityRenderSystem'
import { MovementSystem } from '@systems/MovementSystem'
import { CollisionSystem } from '@rogue/ecs/systems/CollisionSystem'
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
import { GameLevelSystem } from '@systems/GameLevelSystem'
import { GameSettings } from './game/gameSettings'

function initSystems(game: Game) {
    const keybindings: KeyBindings = {
        MOVE_LEFT: 'a',
        MOVE_RIGHT: 'd',
        MOVE_UP: 'w',
        MOVE_DOWN: 's',
    }

    const inputSystem = new InputSystem(game.playerEntity, keybindings)
    game.ecs.addSystem(inputSystem)

    const aiSystem = new AiSystem(game)
    game.ecs.addSystem(aiSystem)

    const collisionSystem = new CollisionSystem(game.getMap())
    game.ecs.addSystem(collisionSystem)

    const inventorySystem = new InventorySystem()
    game.ecs.addSystem(inventorySystem)

    const physicalCombatSystem = new PhysicalCombatSystem()
    game.ecs.addSystem(physicalCombatSystem)

    const healthSystem = new HealthSystem()
    game.ecs.addSystem(healthSystem)

    const movementSystem = new MovementSystem(game.camera)
    game.ecs.addSystem(movementSystem)

    const renderSystem = new EntityRenderSystem(game.display, game.camera)
    game.ecs.addSystem(renderSystem)

    const uiSystem = new UiSystem(game.playerEntity)
    game.ecs.addSystem(uiSystem)

    const gameLevelSystem = new GameLevelSystem(game)
    game.ecs.addSystem(gameLevelSystem)
}

function main() {
    const gameSettings: GameSettings = {
        mapWidth: 80,
        mapHeight: 40,
        cameraWidth: 36,
        cameraHeight: 18,
    }

    const game = new Game(gameSettings)

    const rat = game.ecs.addEntity()
    game.ecs.addComponent(
        rat,
        new Position(
            Math.floor(gameSettings.mapWidth / 2) + 1,
            Math.floor(gameSettings.mapHeight / 2)
        )
    )
    game.ecs.addComponent(rat, new Renderable('r', '#CE422B', '#000'))
    game.ecs.addComponent(rat, new BlockMovement())
    game.ecs.addComponent(rat, new Health(2, 2))
    game.ecs.addComponent(rat, new Faction(FactionName.Enemy))
    game.ecs.addComponent(rat, new AiControlled())
    game.ecs.addComponent(rat, new Name('Rat'))

    const sword = game.ecs.addEntity()
    game.ecs.addComponent(sword, new Position(5, 4))
    game.ecs.addComponent(sword, new Renderable('\\', '#FFFFFF', '#000'))
    game.ecs.addComponent(sword, new IsPocketable())
    game.ecs.addComponent(sword, new Name('Short Sword'))

    initSystems(game)

    requestAnimationFrame(() => loop(game))
}

main()

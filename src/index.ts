import LocationComponent from './ecs/components/location'
import RenderableComponent from './ecs/components/renderable'
import MovementSystem from './ecs/systems/movementSystem'
import { Game } from './game/game'
import { renderEntities } from './render/entityRenderer'
import { renderMap } from './render/mapRenderer'
import { handleInput } from './game/inputHandler'
import { getFovMap } from './render/fov'
import { generate } from './generation/algorithms/rooms'
import { Entity } from './ecs/entity'
import HealthComponent from './ecs/components/health'
import BlockMovementComponent from './ecs/components/blockMovement'
import CollisionSystem from './ecs/systems/collisionSystem'

function loop(game: Game) {
    game.display.clear()

    let playerLoc = game.player.getComponent(LocationComponent)
    if (!playerLoc) {
        throw new Error('Player has no location component')
    }
    const fovMap = getFovMap(
        game.level.map,
        playerLoc.x,
        playerLoc.y,
        game.settings.fovRadius
    )

    renderMap(game.display, game.level.map, fovMap)
    renderEntities(game.display, game.level.entities)
    requestAnimationFrame(() => loop(game))
}

function main() {
    const mapWidth = 50
    const mapHeight = 40

    let map = generate(mapWidth, mapHeight)

    const game = new Game(mapWidth, mapHeight)
    game.level.map = map
    game.level.entities.push(game.player)

    game.player.addComponent(new LocationComponent(23, 20))
    game.player.addComponent(new HealthComponent(10, 10))
    game.player.addComponent(new BlockMovementComponent(true))
    game.player.addComponent(new RenderableComponent('@', '#ff0', '#000'))

    let rat = new Entity()
    rat.addComponent(new LocationComponent(30, 20))
    rat.addComponent(new HealthComponent(2, 2))
    rat.addComponent(new BlockMovementComponent(true))
    rat.addComponent(new RenderableComponent('r', '#f00', '#000'))
    game.level.entities.push(rat)

    const movementSystem = new MovementSystem(map, game.level.entities)
    const collisionSystem = new CollisionSystem(game.level.entities)

    window.addEventListener('keydown', (event) =>
        handleInput(movementSystem, collisionSystem, game.player, event)
    )

    requestAnimationFrame(() => loop(game))
}

main()

import LocationComponent from './ecs/components/location'
import RenderableComponent from './ecs/components/renderable'
import { Tile } from './game/tile'
import MovementSystem from './ecs/systems/movementSystem'
import { Game } from './game/game'
import { renderEntities } from './render/entityRenderer'
import { renderMap } from './render/mapRenderer'
import { handleInput } from './game/inputHandler'
import { getFovMap } from './render/fov'
import { generateMap } from './generation/map'
import { RandomWalk } from './generation/algorithms/randomWalk'
import { CellularAutomataAlgorithm } from './generation/algorithms/cellularAutomata'
import { BSP } from './generation/algorithms/binaryPartition'
import { generate } from './generation/algorithms/rooms'
import { Entity } from './ecs/entity'
import HealthComponent from './ecs/components/health'



function loop(game: Game) {
    game.display.clear()

    let playerLoc = game.player.getComponent(LocationComponent)
    const fovMap = getFovMap(game.level.map, playerLoc.x, playerLoc.y, game.settings.fovRadius)

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
    game.player.addComponent(new RenderableComponent('@', '#ff0', '#000'))

    let rat = new Entity()
    rat.addComponent(new LocationComponent(30, 20))
    rat.addComponent(new HealthComponent(2, 2))
    rat.addComponent(new RenderableComponent('r', '#f00', '#000'))
    game.level.entities.push(rat)

    const movementSystem = new MovementSystem(map)

    window.addEventListener('keydown', (event) =>
        handleInput(movementSystem, game.player, event)
    )

    requestAnimationFrame(() => loop(game))
}

main()

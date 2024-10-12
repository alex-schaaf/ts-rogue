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



function loop(game: Game) {
    game.display.clear()

    let playerLoc = game.player.getComponent(LocationComponent)
    const fovMap = getFovMap(game.level.map, playerLoc.x, playerLoc.y, game.settings.fovRadius)

    renderMap(game.display, game.level.map, fovMap)
    renderEntities(game.display, game.level.entities)
    requestAnimationFrame(() => loop(game))
}

function main() {
    const mapWidth = 60
    const mapHeight = 24

    const algorithm = new RandomWalk()
    let map = algorithm.generate(mapWidth, mapHeight)

    const game = new Game()
    game.level.map = map
    game.level.entities.push(game.player)

    game.player.addComponent(new LocationComponent(30, 12))
    game.player.addComponent(new RenderableComponent('@', '#ff0', '#000'))

    const movementSystem = new MovementSystem(map)

    window.addEventListener('keydown', (event) =>
        handleInput(movementSystem, game.player, event)
    )

    requestAnimationFrame(() => loop(game))
}

main()

import { renderMap } from '../render/mapRenderer'
import { Game } from './game'

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

export { loop }

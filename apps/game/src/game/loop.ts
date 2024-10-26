import { renderMap } from '../render/mapRenderer'
import { Game } from './game'

function loop(game: Game) {
    game.display.clear()
    renderMap(game.display, game.getMap())
    game.ecs.update()

    requestAnimationFrame(() => loop(game))
}

export { loop }

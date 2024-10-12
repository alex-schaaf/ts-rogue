import * as ROT from 'rot-js'
import { Entity } from './ecs/entity'
import LocationComponent from './ecs/components/location'
import RenderableComponent from './ecs/components/renderable'
import { Tile } from './game/tile'
import MovementSystem from './ecs/systems/movementSystem'
import Game from './game/game'

function generateMap(width: number, height: number): Record<string, Tile> {
    let map = {}
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            map[`${x},${y}`] = {
                char: '.',
                colorFg: '#404040',
                colorBg: '#000',
                isWalkable: true,
            }
        }
    }
    return map
}

function renderMap(display: ROT.Display, map: Record<string, Tile>) {
    for (let key in map) {
        let [x, y] = key.split(',').map(Number)
        let tile = map[key]
        display.draw(x, y, tile.char, tile.colorFg, tile.colorBg)
    }
}

function renderEntities(display: ROT.Display, entities: Entity[]) {
    for (let entity of entities) {
        let location = entity.getComponent(LocationComponent)
        let renderable = entity.getComponent(RenderableComponent)
        display.draw(
            location.x,
            location.y,
            renderable.char,
            renderable.colorFg,
            renderable.colorBg
        )
    }
}

function handleInput(
    movementSystem: MovementSystem,
    player: Entity,
    event: KeyboardEvent
) {
    switch (event.key) {
        case 'ArrowUp':
            movementSystem.moveUp(player)
            break
        case 'ArrowDown':
            movementSystem.moveDown(player)
            break
        case 'ArrowLeft':
            movementSystem.moveLeft(player)
            break
        case 'ArrowRight':
            movementSystem.moveRight(player)
            break
    }
}

function loop(game: Game) {
    game.display.clear()
    renderMap(game.display, game.level.map)
    renderEntities(game.display, game.level.entities)
    requestAnimationFrame(() => loop(game))
}

function main() {
    const mapWidth = 60
    const mapHeight = 24

    let map = generateMap(mapWidth, mapHeight)

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

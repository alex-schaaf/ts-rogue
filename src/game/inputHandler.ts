import { Entity } from '../ecs/entity'
import MovementSystem from '../ecs/systems/movementSystem'

export function handleInput(
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

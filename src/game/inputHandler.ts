import { Entity } from '../ecs/entity'
import CollisionSystem from '../ecs/systems/collisionSystem'
import MovementSystem from '../ecs/systems/movementSystem'

export function handleInput(
    movementSystem: MovementSystem,
    collisionSystem: CollisionSystem,
    player: Entity,
    event: KeyboardEvent
) {
    switch (event.key) {
        case 'ArrowUp':
            if (collisionSystem.willCollide(player, 0, -1)) {
                return
            }
            movementSystem.moveUp(player)
            break
        case 'ArrowDown':
            if (collisionSystem.willCollide(player, 0, 1)) {
                return
            }
            movementSystem.moveDown(player)
            break
        case 'ArrowLeft':
            if (collisionSystem.willCollide(player, -1, 0)) {
                return
            }
            movementSystem.moveLeft(player)
            break
        case 'ArrowRight':
            if (collisionSystem.willCollide(player, 1, 0)) {
                return
            }
            movementSystem.moveRight(player)
            break
    }
}

import { GameMap } from '../../game/game'
import { BlockMovement } from '../components/BlockMovement'
import { Position } from '../components/Position'
import { System } from '../../lib/ecs'
import { MoveCommand, MoveIntent } from '../events/movement'

/**
 * A system that handles collision detection and resolution.
 *
 * This system listens for MoveIntent events and checks if the movement is
 * blocked by the game map or other entities. If the movement is not blocked, a
 * MoveCommand event is emitted.
 */
class CollisionSystem extends System {
    componentsRequired = new Set<Function>([Position, BlockMovement])
    gameMap: GameMap

    constructor(gameMap: GameMap) {
        super()
        this.gameMap = gameMap
    }

    public update(): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(MoveIntent, this.handleMoveIntent.bind(this))
    }

    private handleMoveIntent(event: MoveIntent): void {
        const container = this.ecs.getComponents(event.entityId)
        const location = container.get(Position)

        const targetX = location.x + event.dx
        const targetY = location.y + event.dy

        if (this.isBlockedByMap(targetX, targetY)) {
            return // Movement is blocked
        }
        if (this.isBlockedByEntity(targetX, targetY)) {
            return // Movement is blocked
        }

        this.eventBus.emit(
            MoveCommand,
            new MoveCommand(event.entityId, event.dx, event.dy)
        )
    }

    private isBlockedByEntity(x: number, y: number): boolean {
        for (const entity of this.ecs.getEntitiesForSystem(this)) {
            const container = this.ecs.getComponents(entity)
            const location = container.get(Position)

            if (location.x === x && location.y === y) {
                return true
            }
        }
        return false
    }

    private isBlockedByMap(x: number, y: number): boolean {
        const tile = this.gameMap.get(x, y)
        return !tile.isWalkable
    }
}

export { CollisionSystem }

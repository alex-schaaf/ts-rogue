import { GameMap } from '@lib/gameMap'
import { BlockMovement } from '@components/BlockMovement'
import { Position } from '@components/Position'
import { Entity, System } from '@lib/ecs'
import { MoveCommand, MoveIntent } from '../events/movement'
import { Tile } from '@game/tile'
import { PhysicalAttack } from '@events/combat'
import { EventLogger, Logger } from '@lib/logger'

/**
 * A system that handles collision detection and resolution.
 *
 * This system listens for MoveIntent events and checks if the movement is
 * blocked by the game map or other entities. If the movement is not blocked, a
 * MoveCommand event is emitted.
 */
class CollisionSystem extends System {
    componentsRequired = new Set<Function>([Position, BlockMovement])
    gameMap: GameMap<Tile>

    constructor(gameMap: GameMap<Tile>) {
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

        const blockingEntity = this.isBlockedByEntity(targetX, targetY)
        if (blockingEntity !== null) {
            this.eventBus.emit(
                PhysicalAttack,
                new PhysicalAttack(event.entityId, blockingEntity)
            )
            return
        }

        this.eventBus.emit(
            MoveCommand,
            new MoveCommand(event.entityId, event.dx, event.dy)
        )
    }

    private isBlockedByEntity(x: number, y: number): Entity | null {
        for (const entity of this.ecs.getEntitiesForSystem(this)) {
            const container = this.ecs.getComponents(entity)
            const location = container.get(Position)

            if (location.x === x && location.y === y) {
                return entity
            }
        }
        return null
    }

    private isBlockedByMap(x: number, y: number): boolean {
        const tile = this.gameMap.get(x, y)
        return !tile.isWalkable
    }
}

export { CollisionSystem }

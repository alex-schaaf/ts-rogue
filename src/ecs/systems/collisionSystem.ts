import { GameMap } from '@lib/gameMap'
import { BlockMovement } from '@components/BlockMovement'
import { Position } from '@components/Position'
import { ComponentContainer, Entity, System } from '@lib/ecs'
import { Moved, MoveIntent } from '../events/movement'
import { Tile } from '@game/tile'
import { PhysicalAttack } from '@events/combat'
import { Faction } from '@components/Faction'
import { IsPocketable } from '@components/IsPocketable'
import { AddToInventory } from '@events/inventory'
import { Inventory } from '@components/Inventory'

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
        const movingComponents = this.ecs.getComponents(event.entityId)
        const location = movingComponents.get(Position)

        const targetX = location.x + event.dx
        const targetY = location.y + event.dy

        if (this.isBlockedByMap(targetX, targetY)) {
            return // Movement is blocked
        }

        const blockingEntity = this.isBlockedByEntity(targetX, targetY)

        if (blockingEntity !== null) {
            const blockingComponents = this.ecs.getComponents(blockingEntity)

            if (this.isBlockedByEnemy(movingComponents, blockingComponents)) {
                this.eventBus.emit(
                    PhysicalAttack,
                    new PhysicalAttack(event.entityId, blockingEntity)
                )
            }
            return
        }

        const pocketableEntity = this.containsPocketable(targetX, targetY)
        if (pocketableEntity !== null && movingComponents.has(Inventory)) {
            this.eventBus.emit(AddToInventory, new AddToInventory(event.entityId, pocketableEntity))
        }

        this.eventBus.emit(
            Moved,
            new Moved(event.entityId, event.dx, event.dy)
        )
    }

    private isBlockedByEntity(x: number, y: number): Entity | null {
        for (const entity of this.ecs.getEntitiesWithComponents([Position, BlockMovement])) {
            const container = this.ecs.getComponents(entity)
            const location = container.get(Position)

            if (location.x === x && location.y === y) {
                return entity
            }
        }
        return null
    }

    private containsPocketable(x: number, y: number): Entity | null {
        for (const entity of this.ecs.getEntitiesWithComponent(IsPocketable)) {
            const container = this.ecs.getComponents(entity)
            const location = container.get(Position)
            if (!location) {
                continue
            }
            const pocketable = container.get(IsPocketable)

            if (location.x === x && location.y === y && pocketable) {
                return entity
            }
        }
        return null
    }

    private isBlockedByMap(x: number, y: number): boolean {
        const tile = this.gameMap.get(x, y)
        return !tile?.isWalkable || false
    }

    private isBlockedByEnemy(
        movingComponents: ComponentContainer,
        blockingComponents: ComponentContainer
    ): boolean {
        const entityFaction = movingComponents.get(Faction)
        const blockingFaction = blockingComponents.get(Faction)

        if (!entityFaction || !blockingFaction) {
            return false
        }

        return entityFaction.name !== blockingFaction.name
    }
}

export { CollisionSystem }

import { BlockMovement } from '@components/BlockMovement'
import { Position } from '@components/Position'
import { ComponentContainer, Entity, System } from '@lib/ecs'
import { Moved, MoveIntent } from '../events/movement'
import { PhysicalAttack } from '@events/combat'
import { Faction } from '@components/Faction'
import { IsPocketable } from '@components/IsPocketable'
import { AddToInventory } from '@events/inventory'
import { Inventory } from '@components/Inventory'
import { Game } from '@game/game'
import { IsPlayer } from '@components/IsPlayer'
import { Tile } from '@game/tile'
import { ToNextLevel, ToPreviousLevel } from '@events/level'

interface MoveDestination {
    movingEntity: Entity
    movingEntityComponents: ComponentContainer
    x: number
    y: number
}

enum EntityCollisionType {
    BlockedByEnemy,
    Pocketable,
    Unblocked,
}

enum MapCollisionType {
    Blocked,
    Unblocked,
    StairsUp,
    StairsDown,
}

/**
 * A system that handles collision detection and resolution.
 *
 * This system listens for MoveIntent events and checks if the movement is
 * blocked by the game map or other entities. If the movement is not blocked, a
 * MoveCommand event is emitted.
 */
class CollisionSystem extends System {
    componentsRequired = new Set<Function>([Position, BlockMovement])
    game: Game

    constructor(game: Game) {
        super()
        this.game = game
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

        const md: MoveDestination = {
            movingEntity: event.entityId,
            movingEntityComponents: movingComponents,
            x: targetX,
            y: targetY,
        }

        const mapCollision = this.handleMapCollision(md)
        if (mapCollision === MapCollisionType.Blocked) {
            return
        } else if (mapCollision === MapCollisionType.StairsUp) {
            this.eventBus.emit(
                ToPreviousLevel,
                new ToPreviousLevel(event.entityId)
            )
            return
        } else if (mapCollision === MapCollisionType.StairsDown) {
            this.eventBus.emit(ToNextLevel, new ToNextLevel(event.entityId))
            return
        }

        const { type, entity } = this.handleEntityCollision(md)

        if (type === EntityCollisionType.BlockedByEnemy) {
            this.eventBus.emit(
                PhysicalAttack,
                new PhysicalAttack(event.entityId, entity!)
            )
            return
        } else if (
            type === EntityCollisionType.Pocketable &&
            movingComponents.has(Inventory)
        ) {
            this.eventBus.emit(
                AddToInventory,
                new AddToInventory(event.entityId, entity!)
            )
        }

        this.eventBus.emit(Moved, new Moved(event.entityId, targetX, targetY))
    }

    private handleEntityCollision(md: MoveDestination): {
        type: EntityCollisionType
        entity?: Entity
    } {
        for (const entity of this.ecs.getEntitiesWithComponent(Position)) {
            const components = this.ecs.getComponents(entity)
            const position = components.get(Position)
            if (position.x !== md.x || position.y !== md.y) {
                continue // entity is not at the target location
            }
            if (!components.has(BlockMovement)) {
                if (components.has(IsPocketable)) {
                    return { type: EntityCollisionType.Pocketable, entity }
                }
                continue
            }
            if (this.isBlockedByEnemy(md.movingEntityComponents, components)) {
                return { type: EntityCollisionType.BlockedByEnemy, entity }
            }
        }
        return { type: EntityCollisionType.Unblocked }
    }

    private handleMapCollision(md: MoveDestination): MapCollisionType {
        const tile = this.game.getMap().get(md.x, md.y)
        if (tile === undefined) {
            return MapCollisionType.Blocked
        }
        if (!tile.isWalkable) {
            return MapCollisionType.Blocked
        }
        if (this.isStairsUp(tile)) {
            return MapCollisionType.StairsUp
        }
        if (this.isStairsDown(tile)) {
            return MapCollisionType.StairsDown
        }
        return MapCollisionType.Unblocked
    }

    private isStairsUp(tile: Tile): boolean {
        return tile.char === '<'
    }

    private isStairsDown(tile: Tile): boolean {
        return tile.char === '>'
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

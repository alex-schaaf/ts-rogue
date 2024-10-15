import { GameMap, XYtoCoords } from '../../game/game'
import { BlockMovement, Location } from '../components/components'
import { System } from '../ecs'
import { MoveCommand, MoveIntent } from '../events/movement'

class CollisionSystem extends System {
    componentsRequired = new Set<Function>([Location, BlockMovement])
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
        const location = container.get(Location)

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
            const location = container.get(Location)

            if (location.x === x && location.y === y) {
                return true
            }
        }
        return false
    }

    private isBlockedByMap(x: number, y: number): boolean {
        const coords = XYtoCoords(x, y)
        const tile = this.gameMap[coords]
        return !tile.isWalkable
    }
}

export { CollisionSystem }

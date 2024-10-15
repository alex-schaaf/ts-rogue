import { Entity, System } from '../ecs'
import { MoveCommand } from '../events/movement'
import { Position } from '../components/Position'

class MovementSystem extends System {
    componentsRequired = new Set<Function>([Position])

    constructor() {
        super()
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(MoveCommand, this.handleMoveIntent.bind(this))
    }

    public handleMoveIntent(event: MoveCommand): void {
        const container = this.ecs.getComponents(event.entityId)
        const location = container.get(Position)

        location.x += event.dx
        location.y += event.dy
    }
}

export { MovementSystem }

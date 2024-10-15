import { Entity, System } from '../ecs'
import { MoveCommand } from '../events/movement'
import { Location } from '../components'

class MovementSystem extends System {
    componentsRequired = new Set<Function>([Location])

    constructor() {
        super()
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(MoveCommand, this.handleMoveIntent.bind(this))
    }

    public handleMoveIntent(event: MoveCommand): void {
        const container = this.ecs.getComponents(event.entityId)
        const location = container.get(Location)

        location.x += event.dx
        location.y += event.dy
    }
}

export { MovementSystem }

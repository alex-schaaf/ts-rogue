import { Entity, System } from '@lib/ecs'
import { Moved } from '../events/movement'
import { Position } from '../components/Position'

class MovementSystem extends System {
    componentsRequired = new Set<Function>([Position])

    constructor() {
        super()
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(Moved, this.handleMoveIntent.bind(this))
    }

    public handleMoveIntent(event: Moved): void {
        const container = this.ecs.getComponents(event.entityId)
        const location = container.get(Position)

        location.x = event.x
        location.y = event.y
    }
}

export { MovementSystem }

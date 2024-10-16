import { Display } from 'rot-js'

import { Entity, System } from '../../lib/ecs'
import { Renderable } from '../components/Renderable'
import { Position } from '../components/Position'

class EntityRenderSystem extends System {
    componentsRequired = new Set<Function>([Position, Renderable])
    private display: Display

    constructor(display: Display) {
        super()
        this.display = display
    }

    public update(entities: Set<Entity>): void {
        for (const entity of entities) {
            const container = this.ecs.getComponents(entity)

            const location = container.get(Position)
            const renderable = container.get(Renderable)

            this.display.draw(
                location.x,
                location.y,
                renderable.char,
                renderable.fgColor,
                renderable.bgColor
            )
        }
    }

    public registerEventHandlers(): void {}
}

export { EntityRenderSystem }

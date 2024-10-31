import { Display } from 'rot-js'

import { Entity, System } from '@lib/ecs'
import { Renderable } from '../components/Renderable'
import { Position } from '../components/Position'
import { Camera } from '@rogue/game/camera'

class EntityRenderSystem extends System {
    componentsRequired = new Set<Function>([Position, Renderable])

    constructor(
        private display: Display,
        private camera: Camera
    ) {
        super()
    }

    public update(entities: Set<Entity>): void {
        const cameraBounds = this.camera.getBounds()

        for (const entity of entities) {
            const container = this.ecs.getComponents(entity)

            const location = container.get(Position)

            if (!this.camera.isVisible(location.x, location.y)) {
                continue
            }

            const renderable = container.get(Renderable)

            this.display.draw(
                location.x - cameraBounds.x0,
                location.y - cameraBounds.y0,
                renderable.char,
                renderable.fgColor,
                renderable.bgColor
            )
        }
    }

    public registerEventHandlers(): void {}
}

export { EntityRenderSystem }

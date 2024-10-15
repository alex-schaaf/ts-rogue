import { Display } from 'rot-js'
import { Renderable, Location } from '../components'
import { Entity, System } from '../ecs'

class EntityRenderSystem extends System {
    componentsRequired = new Set<Function>([Location, Renderable])
    private display: Display

    constructor(display: Display) {
        super()
        this.display = display
    }

    public update(entities: Set<Entity>): void {
        for (const entity of entities) {
            const container = this.ecs.getComponents(entity)

            const location = container.get(Location)
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

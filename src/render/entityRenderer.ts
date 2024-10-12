import * as ROT from 'rot-js'

import LocationComponent from '../ecs/components/location'
import RenderableComponent from '../ecs/components/renderable'
import { Entity } from '../ecs/entity'

export function renderEntities(display: ROT.Display, entities: Entity[]) {
    for (let entity of entities) {
        let location = entity.getComponent(LocationComponent)
        let renderable = entity.getComponent(RenderableComponent)
        display.draw(
            location.x,
            location.y,
            renderable.char,
            renderable.colorFg,
            renderable.colorBg
        )
    }
}

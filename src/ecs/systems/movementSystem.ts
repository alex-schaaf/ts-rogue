import { Entity } from '../entity'
import { Tile } from '../../game/tile'
import LocationComponent from '../components/location'

class MovementSystem {
    map: Record<string, Tile>
    entities: Entity[] = []

    constructor(map: Record<string, Tile>, entities: Entity[]) {
        this.map = map
        this.entities = entities
    }

    moveBy = (entity: Entity, dx: number, dy: number) => {
        let location = entity.getComponent(LocationComponent)
        if (!location) {
            return
        } 
        let key = `${location.x + dx},${location.y + dy}`

        if (!(key in this.map)) {
            return
        }
        if (!this.map[key].isWalkable) {
            return
        }

        location.x += dx
        location.y += dy
    }

    moveUp = (entity: Entity) => {
        this.moveBy(entity, 0, -1)
    }

    moveDown = (entity: Entity) => {
        this.moveBy(entity, 0, 1)
    }

    moveLeft = (entity: Entity) => {
        this.moveBy(entity, -1, 0)
    }

    moveRight = (entity: Entity) => {
        this.moveBy(entity, 1, 0)
    }
}

export default MovementSystem

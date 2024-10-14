import LocationComponent from "../components/location";
import { Entity } from "../entity";

class CollisionSystem {
    entities: Entity[] = []
    
    constructor(entities: Entity[]) {
        this.entities = entities
    }

    willCollide(entity: Entity, dx: number, dy: number): boolean {
        let location = entity.getComponent(LocationComponent)
        if (!location) {
            console.debug("Entity has no location component")
            return false
        }
        let x = location.x + dx
        let y = location.y + dy
        for (let other of this.entities) {
            if (entity === other) {
                continue
            }
            let location = other.getComponent(LocationComponent)
            if (!location) {
                console.debug("Entity has no location component")
                continue
            }
            if (location.x === x && location.y === y) {
                console.debug("Collision detected")
                return true
            }
        }
        return false
    }
}

export default CollisionSystem

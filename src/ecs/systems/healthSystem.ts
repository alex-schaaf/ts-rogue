import HealthComponent from "../components/health";
import { Entity } from "../entity";


class HealthSystem {
    private getHealth(entity: Entity) {
        let health = entity.getComponent(HealthComponent)
        if (health === undefined) {
            throw new Error('Entity has no health component')
        }
        return health
    }

    damage(entity: Entity, amount: number) {
        let health = this.getHealth(entity)

        health.current -= amount
        if (health.current <= 0) {
            health.current = 0
        }
    }

    heal(entity: Entity, amount: number) {
        let health = this.getHealth(entity)

        health.current += amount
        if (health.current > health.max) {
            health.current = health.max
        }
    }
}

export default HealthSystem;

import { Health } from "@components/Health";
import { Renderable } from "@components/Renderable";
import { TookDamage } from "@events/combat";
import { Died } from "@events/death";
import { System } from "@lib/ecs";
import { Logger } from "@lib/logger";

class HealthSystem extends System {
    componentsRequired = new Set<Function>([Health])

    public update(): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(TookDamage, this.handleTookDamage.bind(this))
    }

    private handleTookDamage(event: TookDamage): void {
        const container = this.ecs.getComponents(event.entityId)
        const health = container.get(Health)

        health.current -= event.amount

        if (health.current <= 0) {
            this.ecs.removeEntity(event.entityId)
            this.eventBus.emit(Died, new Died(event.entityId))
        }
    }
}

export { HealthSystem }

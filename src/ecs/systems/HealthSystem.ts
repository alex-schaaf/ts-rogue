import { Health } from "@components/Health";
import { TookDamage } from "@events/combat";
import { System } from "@lib/ecs";
import { Logger } from "@lib/logger";

class HealthSystem extends System {
    componentsRequired = new Set<Function>([Health])

    public update(): void {}

    public registerEventHandlers(): void {
        Logger.debug('HealthSystem: Registering event handlers')
        this.eventBus.on(TookDamage, this.handleTookDamage.bind(this))
    }

    private handleTookDamage(event: TookDamage): void {
        Logger.debug(`HealthSystem: TookDamage ${JSON.stringify(event)}`)
        const container = this.ecs.getComponents(event.entityId)
        const health = container.get(Health)

        health.current -= event.amount
    }
}

export { HealthSystem }

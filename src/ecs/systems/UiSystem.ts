import { Health } from '@components/Health'
import { HealthUpdate } from '@events/ui'
import { Entity, System } from '@lib/ecs'

class UiSystem extends System {
    componentsRequired = new Set<Function>([Health])
    private playerEntity: Entity

    constructor(playerEntity: Entity) {
        super()
        this.playerEntity = playerEntity
    }

    public update(): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(HealthUpdate, this.handleHealthUpdate.bind(this))
    }

    private handleHealthUpdate(event: HealthUpdate): void {
        if (event.entityId !== this.playerEntity) {
            return
        }

        const healthBar = document.getElementById('healthBar') as HTMLProgressElement;
        const healthCurrent = document.getElementById('healthCurrent') as HTMLSpanElement;
        const healthMax = document.getElementById('healthMax') as HTMLSpanElement;

        if (healthBar === null || healthCurrent === null || healthMax === null) {
            return
        }
        healthBar.value = event.current
        healthBar.max = event.max
        healthCurrent.textContent = event.current.toString()
        healthMax.textContent = event.max.toString()
    }
}

export { UiSystem }

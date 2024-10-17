import { Health } from '@components/Health'
import { Name } from '@components/Name'
import { UIAttackUpdate, UIHealthUpdate } from '@events/ui'
import { Entity, System } from '@lib/ecs'

class UiSystem extends System {
    componentsRequired = new Set<Function>([Health])
    private playerEntity: Entity

    private logContainer: HTMLElement
    private healthElements: {
        healthBar: HTMLProgressElement
        healthCurrent: HTMLSpanElement
        healthMax: HTMLSpanElement
    }

    constructor(playerEntity: Entity) {
        super()
        this.playerEntity = playerEntity

        this.logContainer = document.getElementById('log') as HTMLElement
        this.healthElements = {
            healthBar: document.getElementById(
                'healthBar'
            ) as HTMLProgressElement,
            healthCurrent: document.getElementById(
                'healthCurrent'
            ) as HTMLSpanElement,
            healthMax: document.getElementById('healthMax') as HTMLSpanElement,
        }
    }

    public update(): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(UIHealthUpdate, this.handleHealthUpdate.bind(this))
        this.eventBus.on(UIAttackUpdate, this.handleAttackUpdate.bind(this))
    }

    private handleAttackUpdate(event: UIAttackUpdate): void {
        const attackerName = this.ecs
            .getComponents(event.entityId)
            .get(Name).name
        const targetName = this.ecs.getComponents(event.targetId).get(Name).name

        const message = `${attackerName} attacks ${targetName} for ${event.damage} damage`

        const logLine = document.createElement('div')
        logLine.classList.add('log-line')
        logLine.classList.add('text-danger')
        logLine.textContent = message
        this.logContainer.appendChild(logLine)
    }

    private handleHealthUpdate(event: UIHealthUpdate): void {
        if (event.entityId !== this.playerEntity) {
            return
        }
        this.healthElements.healthBar.value = event.current
        this.healthElements.healthBar.max = event.max
        this.healthElements.healthCurrent.textContent = event.current.toString()
        this.healthElements.healthMax.textContent = event.max.toString()
    }
}

export { UiSystem }

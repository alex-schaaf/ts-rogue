import { Health } from '@components/Health'
import { Name } from '@components/Name'
import { UIAttackUpdate, UIHealthUpdate, UIInventoryAdded } from '@events/ui'
import { Entity, System } from '@lib/ecs'

class UiSystem extends System {
    componentsRequired = new Set<Function>([Health])
    private playerEntity: Entity

    private logContainer: HTMLElement
    private inventoryContainer: HTMLElement
    private healthElements: {
        healthBar: HTMLProgressElement
        healthCurrent: HTMLSpanElement
        healthMax: HTMLSpanElement
    }

    constructor(playerEntity: Entity) {
        super()
        this.playerEntity = playerEntity

        this.logContainer = document.getElementById('log') as HTMLElement
        this.inventoryContainer = document.getElementById('inventory') as HTMLElement
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
        this.eventBus.on(UIInventoryAdded, this.handleInventoryUpdate.bind(this))
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
        this.addLogEntry(logLine)
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

    private handleInventoryUpdate(event: UIInventoryAdded): void {
        const itemName = this.ecs.getComponents(event.itemId).get(Name).name
        const message = `You picked up ${itemName}`

        const logLine = document.createElement('div')
        logLine.classList.add('log-line')
        logLine.classList.add('text-success')
        logLine.textContent = message
        this.logContainer.appendChild(logLine)

        const itemElement = document.createElement('div')
        itemElement.textContent = itemName
        itemElement.id = `item-${event.itemId}`
        this.inventoryContainer.appendChild(itemElement)
    }

    private addLogEntry(div: HTMLDivElement): void {
        this.logContainer.prepend(div)
        this.logContainer.scrollTop = this.logContainer.scrollHeight
    }
}

export { UiSystem }

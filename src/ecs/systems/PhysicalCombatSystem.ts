import { Health } from '@components/Health'
import { PhysicalAttack, TookDamage } from '@events/combat'
import { System } from '@lib/ecs'
import { Logger } from '@lib/logger'

class PhysicalCombatSystem extends System {
    componentsRequired = new Set<Function>([Health])

    constructor() {
        super()
    }

    public update() {}

    public registerEventHandlers(): void {
        this.eventBus.on(PhysicalAttack, this.handlePhysicalAttack.bind(this))
    }

    private handlePhysicalAttack(event: PhysicalAttack): void {
        this.eventBus.emit(TookDamage, new TookDamage(event.targetId, 1))
    }
}

export { PhysicalCombatSystem }

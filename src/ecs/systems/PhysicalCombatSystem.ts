import { Health } from '@components/Health'
import { PhysicalAttack, TookDamage } from '@events/combat'
import { UIAttackUpdate } from '@events/ui'
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
        const damage = 1
        this.eventBus.emit(TookDamage, new TookDamage(event.targetId, damage))
        this.eventBus.emit(UIAttackUpdate, new UIAttackUpdate(event.entityId, event.targetId, damage))
    }
}

export { PhysicalCombatSystem }

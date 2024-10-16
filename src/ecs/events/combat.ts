import { EntityEvent } from '@lib/eventing'

export class PhysicalAttack extends EntityEvent {
    constructor(
        public entityId: number,
        public targetId: number
    ) {
        super()
    }
}

export class TookDamage extends EntityEvent {
    constructor(
        public entityId: number,
        public amount: number
    ) {
        super()
    }
}

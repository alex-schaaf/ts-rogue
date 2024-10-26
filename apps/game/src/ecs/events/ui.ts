import { EntityEvent } from '@lib/eventing'

export class UIHealthUpdate extends EntityEvent {
    constructor(
        public entityId: number,
        public current: number,
        public max: number
    ) {
        super()
    }
}

export class UIAttackUpdate extends EntityEvent {
    constructor(
        public entityId: number,
        public targetId: number,
        public damage: number
    ) {
        super()
    }
}

export class UIInventoryAdded extends EntityEvent {
    constructor(
        public entityId: number,
        public itemId: number
    ) {
        super()
    }
}

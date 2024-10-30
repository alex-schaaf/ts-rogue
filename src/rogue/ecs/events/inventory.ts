import { EntityEvent } from '@lib/eventing'

class AddToInventory extends EntityEvent {
    constructor(
        public entityId: number,
        public itemId: number
    ) {
        super()
    }
}

export { AddToInventory }

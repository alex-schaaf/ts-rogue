import { EntityEvent } from '@lib/eventing'

class PlayerTookTurn extends EntityEvent {
    constructor(
        public entityId: number
    ) {
        super()
    }
}

export { PlayerTookTurn }

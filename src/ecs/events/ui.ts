import { EntityEvent } from '@lib/eventing'

export class HealthUpdate extends EntityEvent {
    constructor(
        public entityId: number,
        public current: number,
        public max: number
    ) {
        super()
    }
}

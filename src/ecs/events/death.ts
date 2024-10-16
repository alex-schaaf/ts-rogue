import { EntityEvent } from '@lib/eventing'

export class Died extends EntityEvent {
    constructor(public entityId: number) {
        super()
    }
}

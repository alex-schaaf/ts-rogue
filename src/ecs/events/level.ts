import { EntityEvent } from '@lib/eventing'

class ToNextLevel extends EntityEvent {
    constructor(public entityId: number) {
        super()
    }
}
class ToPreviousLevel extends EntityEvent {
    constructor(public entityId: number) {
        super()
    }
}

export { ToNextLevel, ToPreviousLevel }

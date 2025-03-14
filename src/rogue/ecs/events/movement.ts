import { EntityEvent } from '@lib/eventing'

class MoveIntent extends EntityEvent {
    constructor(
        public entityId: number,
        public dx: number,
        public dy: number
    ) {
        super()
    }
}

class Moved extends EntityEvent {
    constructor(
        public entityId: number,
        public x: number,
        public y: number
    ) {
        super()
    }
}

export { MoveIntent, Moved }

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

class MoveCommand extends EntityEvent {
    constructor(
        public entityId: number,
        public dx: number,
        public dy: number
    ) {
        super()
    }
}

export { MoveIntent, MoveCommand }

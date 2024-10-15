import { Component } from '../ecs'

export class IsPlayer extends Component {
    constructor() {
        super()
    }
}

export class Location extends Component {
    constructor(
        public x: number,
        public y: number
    ) {
        super()
    }
}

export class Health extends Component {
    constructor(
        public current: number,
        public max: number
    ) {
        super()
    }
}

export class Renderable extends Component {
    constructor(
        public char: string,
        public fgColor: string,
        public bgColor: string
    ) {
        super()
    }
}

export class BlockMovement extends Component {
    constructor(public blocks: boolean) {
        super()
    }
}

import { Component, Entity } from '@lib/ecs'

export class Inventory extends Component {
    constructor(
        public items: Entity[] = []
    ) {
        super()
    }
}

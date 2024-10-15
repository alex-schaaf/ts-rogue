import { Component } from "../ecs";

export class Health extends Component {
    constructor(
        public current: number,
        public max: number
    ) {
        super()
    }
}

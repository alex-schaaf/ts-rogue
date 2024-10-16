import { Component } from "@lib/ecs";

export class Position extends Component {
    constructor(
        public x: number,
        public y: number
    ) {
        super()
    }
}

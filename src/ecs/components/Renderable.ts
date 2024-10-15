import { Component } from "../ecs";

export class Renderable extends Component {
    constructor(
        public char: string,
        public fgColor: string,
        public bgColor: string
    ) {
        super()
    }
}

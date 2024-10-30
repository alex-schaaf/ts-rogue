import { Component } from '@lib/ecs'

export enum FactionName {
    Player = 'Player',
    Enemy = 'Enemy'
}

export class Faction extends Component {
    constructor(
        public name: FactionName
    ) {
        super()
    }
}

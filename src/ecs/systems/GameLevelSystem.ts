import { Entity, System } from '@lib/ecs'
import { IsPlayer } from '@components/IsPlayer'
import { Game } from '@game/game'

class GameLevelSystem extends System {
    componentsRequired = new Set<Function>([IsPlayer])
    private game: Game

    constructor(game: Game) {
        super()
        this.game = game
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {}
}

export { GameLevelSystem }

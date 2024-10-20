import { Entity, System } from '@lib/ecs'
import { IsPlayer } from '@components/IsPlayer'
import { Game } from '@game/game'
import { ToNextLevel, ToPreviousLevel } from '@events/level'
import { Moved } from '@events/movement'

class GameLevelSystem extends System {
    componentsRequired = new Set<Function>([IsPlayer])
    private game: Game

    constructor(game: Game) {
        super()
        this.game = game
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(ToNextLevel, this.handlePlayerNextLevel.bind(this))
        this.eventBus.on(ToPreviousLevel, this.handlePlayerPreviousLevel.bind(this))
    }

    private handlePlayerNextLevel(): void {
        this.game.nextLevel()
        this.eventBus.emit(Moved, new Moved(this.game.playerEntity, 1, 3))
    }

    private handlePlayerPreviousLevel(): void {
        if (this.game.currentLevel === 0) {
            return
        }
        this.game.previousLevel()
        this.eventBus.emit(Moved, new Moved(this.game.playerEntity, 9, 3))
    }
}

export { GameLevelSystem }

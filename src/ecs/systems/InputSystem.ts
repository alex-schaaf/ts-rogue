import { Logger } from '@lib/logger'
import { IsPlayer } from '../components/IsPlayer'
import { Entity, System } from '@lib/ecs'
import { MoveIntent } from '../events/movement'
import { PlayerTookTurn } from '@events/turn'

class InputSystem extends System {
    componentsRequired = new Set<Function>([IsPlayer])
    private player: Entity

    constructor(player: Entity) {
        super()
        this.player = player

        window.addEventListener('keydown', (event) =>
            this.handleInput(event)
        )
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {}

    public handleInput(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, 0, -1)
                )
                break
            case 'ArrowDown':
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, 0, 1)
                )
                break
            case 'ArrowLeft':
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, -1, 0)
                )
                break
            case 'ArrowRight':
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, 1, 0)
                )
                break
        }
        this.eventBus.emit(PlayerTookTurn, new PlayerTookTurn(this.player))
    }
}

export { InputSystem }

import { IsPlayer } from '../components'
import { Entity, System } from '../ecs'
import { MoveIntent } from '../events/movement'

class InputSystem extends System {
    componentsRequired = new Set<Function>([IsPlayer])
    private player: Entity

    constructor(player: Entity) {
        super()
        this.player = player
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {}

    public handleInput(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                console.debug('InputSystem.handleInput: ArrowUp')
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, 0, -1)
                )
                break
            case 'ArrowDown':
                console.debug('InputSystem.handleInput: ArrowDown')
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, 0, 1)
                )
                break
            case 'ArrowLeft':
                console.debug('InputSystem.handleInput: ArrowLeft')
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, -1, 0)
                )
                break
            case 'ArrowRight':
                console.debug('InputSystem.handleInput: ArrowRight')
                this.eventBus.emit(
                    MoveIntent,
                    new MoveIntent(this.player, 1, 0)
                )
                break
        }
    }
}

export { InputSystem }

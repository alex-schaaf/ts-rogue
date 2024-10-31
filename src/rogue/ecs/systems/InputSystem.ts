import { Logger } from '@lib/logger'
import { IsPlayer } from '../components/IsPlayer'
import { Entity, System } from '@lib/ecs'
import { MoveIntent } from '../events/movement'
import { PlayerTookTurn } from '@events/turn'

interface KeyBindings {
    MOVE_LEFT: string
    MOVE_RIGHT: string
    MOVE_UP: string
    MOVE_DOWN: string
}

class InputSystem extends System {
    componentsRequired = new Set<Function>([IsPlayer])

    constructor(
        private player: Entity,
        private keybindings: KeyBindings
    ) {
        super()
        this.player = player

        window.addEventListener('keydown', (event) => this.handleInput(event))
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {}

    public handleInput(event: KeyboardEvent): void {
        switch (event.key) {
            case this.keybindings.MOVE_UP:
                this.eventBus.emit(new MoveIntent(this.player, 0, -1))
                break
            case this.keybindings.MOVE_DOWN:
                this.eventBus.emit(new MoveIntent(this.player, 0, 1))
                break
            case this.keybindings.MOVE_LEFT:
                this.eventBus.emit(new MoveIntent(this.player, -1, 0))
                break
            case this.keybindings.MOVE_RIGHT:
                this.eventBus.emit(new MoveIntent(this.player, 1, 0))
                break
            default:
                return
        }
        this.eventBus.emit(new PlayerTookTurn(this.player))
    }
}

export { KeyBindings, InputSystem }

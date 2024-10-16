import { IsEnemy } from "@components/IsEnemy";
import { MoveIntent } from "@events/movement";
import { PlayerTookTurn } from "@events/turn";
import { Entity, System } from "@lib/ecs";

class AiSystem extends System {
     componentsRequired = new Set<Function>([IsEnemy])

    public update(entities: Set<Entity>): void {

    }

    public registerEventHandlers(): void {
        this.eventBus.on(PlayerTookTurn, this.handlePlayerTookTurn.bind(this))
    }

    public handlePlayerTookTurn(event: PlayerTookTurn): void {
        // this.ecs.getEntitiesForSystem(this).forEach(entity => {
        //     // const container = this.ecs.getComponents(entity)

        //     const direction = Math.floor(Math.random() * 4)
        //     if (direction === 0) this.eventBus.emit(MoveIntent, new MoveIntent(entity, 0, -1))
        //     if (direction === 1) this.eventBus.emit(MoveIntent, new MoveIntent(entity, 0, 1))
        //     if (direction === 2) this.eventBus.emit(MoveIntent, new MoveIntent(entity, -1, 0))
        //     if (direction === 3) this.eventBus.emit(MoveIntent, new MoveIntent(entity, 1, 0))
        // })
    }
}

export { AiSystem }
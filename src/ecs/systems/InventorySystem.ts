import { Inventory } from '@components/Inventory'
import { Position } from '@components/Position'
import { AddToInventory } from '@events/inventory'
import { UIInventoryAdded } from '@events/ui'
import { System } from '@lib/ecs'

class InventorySystem extends System {
    componentsRequired = new Set<Function>([Inventory])

    public update(): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(AddToInventory, this.handleAddToInventory.bind(this))
    }

    private handleAddToInventory(event: AddToInventory): void {
        const components = this.ecs.getComponents(event.entityId)
        const inventory = components.get(Inventory)
        inventory.items.push(event.itemId)
        
        this.ecs.removeComponent(event.itemId, Position) // remove item from map

        this.eventBus.emit(UIInventoryAdded, new UIInventoryAdded(event.entityId, event.itemId))        
    }
}

export { InventorySystem }

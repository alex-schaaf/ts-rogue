abstract class EntityEvent {
    public abstract entityId: number
}

type EventClass = new (...args: any[]) => EntityEvent

class EventBus {
    /**
     * Map events to functions that are to be called when the event is emitted.
     */
    private eventHandlers: Map<EventClass, Function[]> = new Map()

    /**
     * Add an event handler function to an event.
     */
    public on(eventType: EventClass, handler: Function): void {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, [])
        }
        this.eventHandlers.get(eventType)!.push(handler)
    }

    public emit(eventType: EventClass, event: EntityEvent): void {
        this.eventHandlers.get(eventType)?.forEach((handler) => {
            handler(event)
        })
    }
}

export { EntityEvent, EventBus }

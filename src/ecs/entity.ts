import { Component } from "./component";


class Entity {
    components: Record<string, Component> = {};

    addComponent(component: Component) {
        this.components[component.constructor.name] = component;
    }

    getComponent<T extends Component>(component: {new(...args: any[]): T}): T {
        return this.components[component.name] as T;
    }

    hasComponent<T extends Component>(component: {new(): T}): boolean {
        return component.name in this.components;
    }

    removeComponent<T extends Component>(component: {new(): T}): void {
        delete this.components[component.name];
    }
}

export { Entity };
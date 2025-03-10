class Queue<T> {
    private items: T[] = []

    public enqueue(item: T): void {
        this.items.push(item)
    }

    public dequeue(): T | undefined {
        return this.items.shift()
    }

    public isEmpty(): boolean {
        return this.size() === 0
    }

    public size(): number {
        return this.items.length
    }
}

export default Queue

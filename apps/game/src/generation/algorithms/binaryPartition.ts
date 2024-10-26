import { GameMap, XYtoCoords } from '../../game/game'
import { MapGenerationAlgorithm } from '../abstract'
import { getFloor, getWall } from '../tiles'

interface Node {
    x0: number
    y0: number
    x1: number
    y1: number

    depth: number

    parent?: Node
    left?: Node
    right?: Node
}

function getWidth(node: Node): number {
    return node.x1 - node.x0
}

function getHeight(node: Node): number {
    return node.y1 - node.y0
}

function getArea(node: Node): number {
    return getWidth(node) * getHeight(node)
}

function getCenter(node: Node): [number, number] {
    return [node.x0 + getWidth(node) / 2, node.y0 + getHeight(node) / 2]
}

function getLeafNodes(node: Node): Node[] {
    let leafNodes: Node[] = []
    let queue: Node[] = [node]
    while (queue.length > 0) {
        let currentNode = queue.shift()
        if (currentNode === undefined) {
            break
        }

        if (currentNode.left) {
            queue.push(currentNode.left)
        }
        if (currentNode.right) {
            queue.push(currentNode.right)
        }

        if (!currentNode.left && !currentNode.right) {
            leafNodes.push(currentNode)
        }
    }
    return leafNodes
}

type Array2D<T> = T[][]

function getSibling(node: Node): Node | undefined {
    if (!node.parent) {
        return undefined
    }
    return node.parent.left === node ? node.parent.right : node.parent.left
}

class BSP implements MapGenerationAlgorithm {
    generate(width: number, height: number): GameMap {
        let arr = this.seedMap(width, height)

        let root: Node = { x0: 0, y0: 0, x1: width, y1: height, depth: 0 }

        this.split(root, 2)
        // this.paintPartitions(root, arr)

        let leafNodes = getLeafNodes(root)

        this.paintRooms(leafNodes, arr)

        this.connectRooms(leafNodes, arr)

        return this.transformArrayToMap(arr)
    }

    connectRooms(leafNodes: Node[], arr: Array2D<boolean>) {
        let queue: Node[] = [...leafNodes]
        while (queue.length > 0) {
            let currentNode = queue.shift()
            if (currentNode === undefined) {
                break
            }
            let siblingNode = getSibling(currentNode)
            if (siblingNode === undefined) {
                continue
            }

            let [x0, y0] = getCenter(currentNode)
            let [x1, y1] = getCenter(siblingNode)
        }
    }

    paintRooms(leafNodes: Node[], arr: Array2D<boolean>) {
        leafNodes.forEach((node) => {
            // create a room inside the node
            let roomX0 = node.x0 + Math.floor(Math.random() * 3) + 1
            let roomY0 = node.y0 + Math.floor(Math.random() * 3) + 1
            let roomX1 = node.x1 - Math.floor(Math.random() * 3) - 1
            let roomY1 = node.y1 - Math.floor(Math.random() * 3) - 1

            for (let y = roomY0; y < roomY1; y++) {
                for (let x = roomX0; x < roomX1; x++) {
                    arr[y][x] = true
                }
            }
        })
    }

    paintPartitions(root: Node, arr: Array2D<boolean>) {
        let queue: Node[] = [root]
        while (queue.length > 0) {
            let currentNode = queue.shift()
            if (currentNode === undefined) {
                break
            }

            if (currentNode.left) {
                queue.push(currentNode.left)
            }
            if (currentNode.right) {
                queue.push(currentNode.right)
            }

            if (currentNode.depth === 0) {
                // continue
            }

            for (let y = currentNode.y0; y < currentNode.y1; y++) {
                arr[y][currentNode.x0] = false
                // arr[y][currentNode.x1 - 1] = false
            }

            for (let x = currentNode.x0; x < currentNode.x1; x++) {
                arr[currentNode.y0][x] = false
                // arr[currentNode.y1 - 1][x] = false
            }
        }
    }

    split(node: Node, maxDepth: number = 4) {
        if (node.depth >= maxDepth) {
            return
        }
        console.debug('splitting node', node)

        let splitHorizontal = this.getSplitHorizontally()
        let splitLocation = this.getSplitLocation(
            splitHorizontal,
            node.x1 - node.x0,
            node.y1 - node.y0
        )
        console.debug('splitLocation', splitLocation)

        if (splitHorizontal) {
            console.debug('splitting horizontally')
            node.left = {
                x0: node.x0,
                y0: node.y0,
                x1: node.x1,
                y1: node.y0 + splitLocation,
                depth: node.depth + 1,
            }
            console.debug('node.left', node.left)
            if (getHeight(node.left) < 3) {
                return this.split(node, maxDepth)
            }
            node.right = {
                x0: node.x0,
                y0: node.y0 + splitLocation,
                x1: node.x1,
                y1: node.y1,
                depth: node.depth + 1,
            }
            console.debug('node.right', node.right)
        } else {
            console.debug('splitting vertically')
            node.left = {
                x0: node.x0,
                y0: node.y0,
                x1: node.x0 + splitLocation,
                y1: node.y1,
                depth: node.depth + 1,
            }
            console.debug('node.left', node.left)
            if (getWidth(node.left) < 3) {
                return this.split(node, maxDepth)
            }
            node.right = {
                x0: node.x0 + splitLocation,
                y0: node.y0,
                x1: node.x1,
                y1: node.y1,
                depth: node.depth + 1,
            }
            console.debug('node.right', node.right)
        }

        node.left.parent = node
        node.right.parent = node

        this.split(node.left, maxDepth)
        this.split(node.right, maxDepth)
    }

    transformArrayToMap(arr: Array2D<boolean>): GameMap {
        let map: GameMap = {}
        arr.forEach((row, y) => {
            row.forEach((isFloor, x) => {
                let coords = XYtoCoords(x, y)
                map[coords] = isFloor ? getFloor() : getWall()
            })
        })
        return map
    }

    getSplitHorizontally(): boolean {
        return Math.random() > 0.5
    }

    getSplitLocation(
        splitHorizontal: boolean,
        width: number,
        height: number
    ): number {
        return Math.floor(
            (0.45 + Math.random() * 0.1) *
                (splitHorizontal ? height - 1 : width - 1)
        )
    }

    seedMap(width: number, height: number): Array2D<boolean> {
        let arr: boolean[][] = []
        for (let y = 0; y < height; y++) {
            let row: boolean[] = []
            for (let x = 0; x < width; x++) {
                row.push(false)
            }
            arr.push(row)
        }
        return arr
    }
}

export { BSP }

import {Node, Grid} from './types';
const getNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors: Node[] = [];
    const {row, col} = node;
    // return the neighbors of the given node in the following order: top, right, bottom, left
    if(row > 0) neighbors.push(grid[row - 1][col]);
    if(col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if(row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if(col > 0) neighbors.push(grid[row][col - 1]);
    return neighbors.filter(neighbor => !neighbor.isWall);
};

const getDistance = (nodeA: Node, nodeB: Node) => {
    if(!nodeA || !nodeB) return 0;
    // return the distance between the two given nodes
    const x = nodeA.row - nodeB.row;
    const y = nodeA.col - nodeB.col;
    return Math.sqrt(x * x + y * y);
};

const createGrid = (width: number, height: number) => {
    let grid: Node[][] = [];

    for(let x = 0; x < width; x++) {
        let row: Node[] = [];
        for(let y = 0; y < height; y++) {
            row.push({
                id: `${x}-${y}`,
                row: x,
                col: y,
                neighbors: [],
                g: 0,
                h: 0,
                f: 0,
                isStart: false,
                isEnd: false,
                isWall: false,
                isVisited: false,
                isPath: false
            });
        }
        grid.push(row);
    }

    const gridObj: Grid = {
        nodes: grid,
        start: undefined,
        end: undefined
    };

    return gridObj;
};

const bfs = (grid: Grid, start: Node, end: Node) => {
    if(!start || !end || start === end) return [];
    //Make a copy of the grid to perform the search on
    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[start.row][start.col];
    const endNode = gridCopy[end.row][end.col];

    //Perform the search on the copy array of nodes, and return the visited nodes in order, while marking the parents of each node for the shortest path
    const visitedNodesInOrder: Node[] = [];
    const queue: Node[] = [];
    queue.push(startNode);
    while(queue.length) {
        const currentNode = queue.shift()!;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        if(currentNode === endNode) return visitedNodesInOrder;
        const neighbors = getNeighbors(currentNode, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited && !queue.includes(neighbor)) {
                queue.push(neighbor);
                console.log(neighbor);
                neighbor.parent = currentNode;
                // Also set the parent on the original grid, so that the shortest path can be found
                grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[currentNode.row][currentNode.col];
            }
        }
    }
    return visitedNodesInOrder;
};

const dfs = (grid: Grid, start: Node, end: Node) => {
    if(!start || !end || start === end) return [];
    // Do recursive DFS on a copy of the grid, and return the visited nodes in order, while marking the parents of each node for the shortest path
    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[start.row][start.col];
    const endNode = gridCopy[end.row][end.col];
    const visitedNodesInOrder: Node[] = [];
    const dfsHelper = (node: Node) => {
        if(node === endNode) return true;
        visitedNodesInOrder.push(node);
        node.isVisited = true;
        const neighbors = getNeighbors(node, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited) {
                neighbor.parent = node;
                grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[node.row][node.col];
                if(dfsHelper(neighbor)) return true;
            }
        }
        return false;
    };
    dfsHelper(startNode);
    return visitedNodesInOrder;
};

const dijkstra = (grid: Grid, start: Node, end: Node) => {
    if(!start || !end || start === end) return [];
    //Make a copy of the grid to perform the search on
    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[start.row][start.col];
    const endNode = gridCopy[end.row][end.col];

    //Perform the search on the copy array of nodes, and return the visited nodes in order, while marking the parents of each node for the shortest path
    // Dijkstra's algorithm is a greedy algorithm, so we can use a min heap to find the node with the lowest f value
    // Nodes that are walls will not be added to the heap, so they will not be visited

    const visitedNodesInOrder: Node[] = [];
    const unvisitedNodes: Node[] = [];
    startNode.g = 0;
    startNode.h = getDistance(startNode, endNode);
    startNode.f = startNode.g + startNode.h;
    unvisitedNodes.push(startNode);
    while(unvisitedNodes.length) {
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
        const currentNode = unvisitedNodes.shift()!;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        if(currentNode === endNode) return visitedNodesInOrder;
        const neighbors = getNeighbors(currentNode, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited && !neighbor.isWall) {
                neighbor.g = currentNode.g + getDistance(currentNode, neighbor);
                neighbor.h = getDistance(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentNode;
                // Also set the parent on the original grid, so that the shortest path can be found
                grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[currentNode.row][currentNode.col];
                if(!unvisitedNodes.includes(neighbor)) unvisitedNodes.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
};

const aStar = (grid: Grid, start: Node, end: Node) => {
    //TODO: implement this function
    return [];
};

const getPath = (end: Node) => {
    let nodesInShortestPathOrder: Node[] = [];
    let currentNode = end;
    while(currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        if(!currentNode.parent) break;
        currentNode = currentNode.parent;
    }
    return nodesInShortestPathOrder;
};

export {getNeighbors, getDistance, createGrid, bfs, dfs, dijkstra, aStar, getPath};
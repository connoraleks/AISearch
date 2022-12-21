import {Node, Grid} from './types';
// Helper functions for the pathfinding algorithms
// Returns the neighbors of the given node in the following order: top, right, bottom, left
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
// Returns the distance between the two given nodes calculated using the Pythagorean theorem
const getDistance = (nodeA: Node, nodeB: Node) => {
    if(!nodeA || !nodeB) return 0;
    // return the distance between the two given nodes
    const x = nodeA.row - nodeB.row;
    const y = nodeA.col - nodeB.col;
    return Math.sqrt(x * x + y * y);
};
// Returns the shortest path from the start node to the end node, by tracing the parents of each node from the end node to the start node
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
// Returns a new empty grid with the given dimensions
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
        start: null,
        end: null,
        rows: width,
        cols: height,
        walls: [],
        visited: [],
        path: []
    };

    return gridObj;
}

// Path-Finding algorithms; returns true if a path was found, false otherwise
//Breadth-first search
const bfs = (grid: Grid) => {
    if(grid.start === null || grid.end === null || grid.start === grid.end) return false;
    //Make a copy of the grid to perform the search on
    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[grid.start.row][grid.start.col];
    const endNode = gridCopy[grid.end.row][grid.end.col];

    //Perform the search on the copy array of nodes, and return the visited nodes in order, while marking the parents of each node for the shortest path
    const visitedNodesInOrder: Node[] = [];
    const queue: Node[] = [];
    queue.push(startNode);
    while(queue.length) {
        const currentNode = queue.shift()!;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(grid.nodes[currentNode.row][currentNode.col]);
        if(currentNode === endNode){
            grid.visited = visitedNodesInOrder;
            return true;
        }
        const neighbors = getNeighbors(currentNode, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited && !queue.includes(neighbor)) {
                queue.push(neighbor);
                neighbor.parent = currentNode;
                // Also set the parent on the original grid, so that the shortest path can be found
                grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[currentNode.row][currentNode.col];
            }
        }
    }
    return false;
};
//Depth-first search
const dfs = (grid: Grid) => {
    if(grid.start === null || grid.end === null || grid.start === grid.end) return false;
    //Make a copy of the grid to perform the search on
    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[grid.start.row][grid.start.col];
    const endNode = gridCopy[grid.end.row][grid.end.col];

    //Perform a depth first search, completely analyzing each node before moving on to the next
    const visitedNodesInOrder: Node[] = [];
    const stack: Node[] = [];
    stack.push(startNode);
    while(stack.length) {
        const currentNode = stack.pop()!;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(grid.nodes[currentNode.row][currentNode.col]);
        if(currentNode === endNode){
            grid.visited = visitedNodesInOrder;
            return true;
        }
        const neighbors = getNeighbors(currentNode, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited && !stack.includes(neighbor)) {
                stack.push(neighbor);
                neighbor.parent = currentNode;
                // Also set the parent on the original grid, so that the shortest path can be found
                grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[currentNode.row][currentNode.col];
            }
        }
    }
    return false;

};
//Dijkstra's algorithm
const dijkstra = (grid: Grid) => {
    // djiikstra's algorithm is a greedy algorithm that finds the shortest path from a start node to an end node using a priority queue, where the priority is the distance from the start node, in this case the g value
    if(grid.start === null || grid.end === null || grid.start === grid.end) return false;
    //Make a copy of the grid to perform the search on
    const gridCopy = grid.nodes.map(row => row.map(node => node.isStart ? {...node, g: 0} : {...node, g: Infinity}));
    const startNode = gridCopy[grid.start.row][grid.start.col];
    const endNode = gridCopy[grid.end.row][grid.end.col];

    //Perform the search on the copy array of nodes, and return the visited nodes in order, while marking the parents of each node for the shortest path
    const visitedNodesInOrder: Node[] = [];
    const unvisitedNodes: Node[] = [];
    unvisitedNodes.push(startNode);
    while(unvisitedNodes.length) {
        const currentNode = unvisitedNodes.shift()!;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(grid.nodes[currentNode.row][currentNode.col]);
        if(currentNode === endNode){
            grid.visited = visitedNodesInOrder;
            return true;
        }
        const neighbors = getNeighbors(currentNode, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited) {
                const newG = currentNode.g + 1;
                if(newG < neighbor.g) {
                    neighbor.g = newG;
                    neighbor.parent = currentNode;
                    // Also set the parent on the original grid, so that the shortest path can be found
                    grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[currentNode.row][currentNode.col];
                }
                if(!unvisitedNodes.includes(neighbor)) unvisitedNodes.push(neighbor);
            }
        }
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.g - nodeB.g);
    }
    return false;
};
//A* search
const aStar = (grid: Grid) => {
    if(grid.start === null || grid.end === null || grid.start === grid.end) return false;
    //Make a copy of the grid to perform the search on
    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[grid.start.row][grid.start.col];
    const endNode = gridCopy[grid.end.row][grid.end.col];

    //Perform the search on the copy array of nodes, and return the visited nodes in order, while marking the parents of each node for the shortest path
    const visitedNodesInOrder: Node[] = [];
    const unvisitedNodes: Node[] = [];
    startNode.g = 0;
    startNode.h = 0;
    startNode.f = 0;
    unvisitedNodes.push(startNode);
    while(unvisitedNodes.length) {
        // sort the unvisited nodes by f value
        unvisitedNodes.sort((a, b) => a.f - b.f);
        const currentNode = unvisitedNodes.shift()!;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(grid.nodes[currentNode.row][currentNode.col]);
        if(currentNode === endNode){
            grid.visited = visitedNodesInOrder;
            return true;
        }
        const neighbors = getNeighbors(currentNode, gridCopy);
        for(const neighbor of neighbors) {
            if(!neighbor.isVisited && !unvisitedNodes.includes(neighbor)) {
                neighbor.g = currentNode.g + 1;
                neighbor.h = getDistance(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                unvisitedNodes.push(neighbor);
                neighbor.parent = currentNode;
                // Also set the parent on the original grid, so that the shortest path can be found
                grid.nodes[neighbor.row][neighbor.col].parent = grid.nodes[currentNode.row][currentNode.col];
            }
        }
    }
    return false;
};

//Maze-Generation Algorithms; returns true if a valid maze with a solution is generated, false otherwise
//Recursive Backtracker
const recursiveDivision = (grid: Grid, gap: number) => {
    // Recursive division is a maze generation algorithm that works by slicing the grid into smaller and smaller grids, and then randomly choosing a row or column to pave a wall over, creating a maze

    if(grid.start === null || grid.end === null || grid.start === grid.end) return false;

    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[grid.start.row][grid.start.col];
    const endNode = gridCopy[grid.end.row][grid.end.col];

    const walls: Node[] = [];
    //stack of grid sections to be divided
    const stack: {rowStart: number, rowEnd: number, colStart: number, colEnd: number}[] = [];
    //if the grid is too small, return false
    if(gridCopy.length < 3 || gridCopy[0].length < 3) return false;
    stack.push({rowStart: 1, rowEnd: gridCopy.length - 2, colStart: 1, colEnd: gridCopy[0].length - 2});
    //outline the grid with walls
    gridCopy.flat().forEach(node => {
        if(node.row === 0 || node.row === gridCopy.length - 1 || node.col === 0 || node.col === gridCopy[0].length - 1) {
            node.isWall = true;
            walls.push(node);
        }
    });
    //while there are still sections to divide
    while(stack.length) {
        //pop a section off the stack
        const {rowStart, rowEnd, colStart, colEnd} = stack.pop()!;
        //if the section is too small, skip it
        if(rowEnd - rowStart < 1 || colEnd - colStart < 1) continue;

        const row = Math.floor(Math.random() * (rowEnd - rowStart + 1)) + rowStart;
        const col = Math.floor(Math.random() * (colEnd - colStart + 1)) + colStart;
        // If the grid is taller than it is wide, create a random horizontal wall with a gap
        if(rowEnd - rowStart > colEnd - colStart) {
            for(let i = colStart; i <= colEnd; i++) {
                if(!(i < col + gap && i > col - gap) && gridCopy[row][i] !== startNode && gridCopy[row][i] !== endNode) {
                    gridCopy[row][i].isWall = true;
                    walls.push(gridCopy[row][i]);
                }
            }
            //Push the higher and lower sections of the grid onto the stack
            stack.push({rowStart, rowEnd: row-1, colStart, colEnd});
            stack.push({rowStart: row+1, rowEnd, colStart, colEnd});
        }
        // If the grid is wider than it is tall, create a random vertical wall with a gap
        else if(rowEnd - rowStart < colEnd - colStart) {
            for(let i = rowStart; i <= rowEnd; i++) {
                if(!(i < row + gap && i > row - gap) && gridCopy[i][col] !== startNode && gridCopy[i][col] !== endNode) {
                    gridCopy[i][col].isWall = true;
                    walls.push(gridCopy[i][col]);
                }
            }
            //Push the left and right sections of the grid onto the stack
            stack.push({rowStart, rowEnd, colStart, colEnd: col-1});
            stack.push({rowStart, rowEnd, colStart: col+1, colEnd});
        }
        // If the grid is square, randomly choose between creating a horizontal or vertical wall
        else {
            if(Math.random() < 0.5) {
                for(let i = colStart; i <= colEnd; i++) {
                    if(!(i < col + gap && i > col - gap) && gridCopy[row][i] !== startNode && gridCopy[row][i] !== endNode) {
                        gridCopy[row][i].isWall = true;
                        walls.push(gridCopy[row][i]);
                    }
                }
                stack.push({rowStart, rowEnd: row - 1, colStart, colEnd});
                stack.push({rowStart: row + 1, rowEnd, colStart, colEnd});
            }
            else {
                for(let i = rowStart; i <= rowEnd; i++) {
                    if(!(i < row + gap && i > row - gap) && gridCopy[i][col] !== startNode && gridCopy[i][col] !== endNode) {
                        gridCopy[i][col].isWall = true;
                        walls.push(gridCopy[i][col]);
                    }
                }
                stack.push({rowStart, rowEnd, colStart, colEnd: col - 1});
                stack.push({rowStart, rowEnd, colStart: col + 1, colEnd});
            }
        }
    }
    //check if the maze has a solution
    const solution = bfs({...grid, nodes: gridCopy, start: gridCopy[grid.start.row][grid.start.col], end: gridCopy[grid.end.row][grid.end.col]});
    if(!solution) return false;
    //if the maze has a solution, add the walls to grid.walls for animation upon return
    grid.walls = walls.map(node => grid.nodes[node.row][node.col]);
    return true;
};
//Prim's Algorithm
const prims = (grid: Grid) => {
    //TODO: Implement Prim's algorithm
    return false;
};
//Kruskal's Algorithm
const kruskals = (grid: Grid) => {
    //TODO: Implement Kruskal's algorithm
    return false;
};




export {getNeighbors, getDistance, createGrid, bfs, dfs, dijkstra, aStar, getPath, recursiveDivision, prims, kruskals};
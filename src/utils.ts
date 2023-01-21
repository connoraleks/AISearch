import {NodeType, NodeStatus, NodeInterface, GridInterface} from './types';
// Constructor functions
export const createNode = (row: number, col: number): NodeInterface => {
    return {
        row,
        col,
        type: NodeType.Default,
        status: NodeStatus.Default,
        distance: Infinity,
        g: Infinity,
        h: Infinity,
        f: Infinity,
        previousNode: null,
    };
};
export const createGrid = (width: number, height: number): GridInterface => {
    const grid: GridInterface = {
        nodes: [],
        startNode: null,
        endNode: null,
        walls: [],
        path: [],
        width,
        height,
    };

    for (let row = 0; row < height; row++) {
        const currentRow = [];
        for (let col = 0; col < width; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.nodes.push(currentRow);
    }

    return grid;
};

// Setters
export const setStart = (grid: GridInterface, node: NodeInterface): GridInterface => {
    if(node.type === NodeType.End) return grid;
    if(grid.startNode && grid.startNode === node) {
        grid.startNode.type = NodeType.Default;
        grid.startNode = null;
        return grid;
    }
    if (grid.startNode) {
        grid.startNode.type = NodeType.Default;
    }
    grid.startNode = node;
    node.type = NodeType.Start;
    return grid;
};
export const setEnd = (grid: GridInterface, node: NodeInterface): GridInterface => {
    if(node.type === NodeType.Start) return grid;
    if(grid.endNode && grid.endNode === node) {
        grid.endNode.type = NodeType.Default;
        grid.endNode = null;
        return grid;
    }
    if (grid.endNode) {
        grid.endNode.type = NodeType.Default;
    }
    grid.endNode = node;
    node.type = NodeType.End;
    return grid;
}
export const setWall = (grid: GridInterface, node: NodeInterface): GridInterface => {
    if (node.type === NodeType.Start || node.type === NodeType.End) return grid;
    if (node.type === NodeType.Wall) {
        node.type = NodeType.Default;
        return grid;
    }
    node.type = NodeType.Wall;
    return grid;
};

// Getters
export const getNeighbors = (grid: GridInterface, node: NodeInterface): NodeInterface[] => {
    const neighbors: NodeInterface[] = [];
    const {col, row} = node;
    if (col > 0) neighbors.push(grid.nodes[row][col - 1]);
    if (row > 0) neighbors.push(grid.nodes[row - 1][col]);
    if (col < grid.width - 1) neighbors.push(grid.nodes[row][col + 1]);
    if (row < grid.height - 1) neighbors.push(grid.nodes[row + 1][col]);
    return neighbors;
};
export const getDistance = (nodeA: NodeInterface, nodeB: NodeInterface): number => {
    const x = nodeA.col - nodeB.col;
    const y = nodeA.row - nodeB.row;
    return Math.sqrt(x * x + y * y);
};
export const getPathNodes = (endNode: NodeInterface): NodeInterface[] => {
    const shortestPath: NodeInterface[] = [];
    let currentNode: NodeInterface | null = endNode;
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
};
export const getVisitedNodes = (grid: GridInterface): NodeInterface[] => {
    const visitedNodes: NodeInterface[] = [];
    for (const row of grid.nodes) {
        for (const node of row) {
            if (node.status === NodeStatus.Visited) {
                visitedNodes.push(node);
            }
        }
    }
    return visitedNodes;
};

// Resetters
export const resetGrid = (grid: GridInterface): GridInterface => {
    for (const row of grid.nodes) {
        for (const node of row) {
            if (node.type === NodeType.Wall) continue;
            node.type = NodeType.Default;
            node.status = NodeStatus.Default;
            node.distance = Infinity;
            node.g = Infinity;
            node.h = Infinity;
            node.f = Infinity;
            node.previousNode = null;
        }
    }
    return grid;
};
export const resetPath = (grid: GridInterface): GridInterface => {
    for (const row of grid.nodes) {
        for (const node of row) {
            if (node.type === NodeType.Wall) continue;
            node.status = NodeStatus.Default;
            node.distance = Infinity;
            node.g = Infinity;
            node.h = Infinity;
            node.f = Infinity;
            node.previousNode = null;
        }
    }
    return grid;
};
export const resetWalls = (grid: GridInterface): GridInterface => {
    for (const row of grid.nodes) {
        for (const node of row) {
            if (node.type === NodeType.Wall) {
                node.type = NodeType.Default;
            }
        }
    }
    return grid;
};
export const resetStartEnd = (grid: GridInterface): GridInterface => {
    if (grid.startNode) {
        grid.startNode.type = NodeType.Default;
        grid.startNode = null;
    }
    if (grid.endNode) {
        grid.endNode.type = NodeType.Default;
        grid.endNode = null;
    }
    return grid;
};
export const resetAll = (grid: GridInterface): GridInterface => {
    return resetStartEnd(resetWalls(resetGrid(grid)));
};

// Maze Generators
export const generateRecursiveDivisionMaze = (grid: GridInterface, gap: number) => {
    // Recursive division is a maze generation algorithm that works by slicing the grid into smaller and smaller grids, and then randomly choosing a row or column to pave a wall over, creating a maze

    if(grid.startNode === null || grid.endNode === null || grid.startNode === grid.endNode) return false;

    const gridCopy = grid.nodes.map(row => row.map(node => ({...node})));
    const startNode = gridCopy[grid.startNode.row][grid.startNode.col];
    const endNode = gridCopy[grid.endNode.row][grid.endNode.col];

    const walls: NodeInterface[] = [];
    //stack of grid sections to be divided
    const stack: {rowStart: number, rowEnd: number, colStart: number, colEnd: number}[] = [];
    //if the grid is too small, return false
    if(gridCopy.length < 3 || gridCopy[0].length < 3) return false;
    stack.push({rowStart: 1, rowEnd: gridCopy.length - 2, colStart: 1, colEnd: gridCopy[0].length - 2});
    //outline the grid with walls
    gridCopy.flat().forEach(node => {
        if((node.row === 0 || node.row === gridCopy.length - 1 || node.col === 0 || node.col === gridCopy[0].length - 1 ) && node !== startNode && node !== endNode) {
            node.type = NodeType.Wall;
            walls.push(node);
        }
    });
    //while there are still sections to divide
    while(stack.length) {
        //pop a section off the stack
        const {rowStart, rowEnd, colStart, colEnd} = stack.pop()!;
        //if the section is too small, skip it
        if(rowEnd - rowStart <= gap || colEnd - colStart <= gap) continue;

        // Get a random row and column from within the section, but not within the constant gap from the edges
        const row = Math.floor(Math.random() * (rowEnd - rowStart - gap * 2)) + rowStart + gap;
        const col = Math.floor(Math.random() * (colEnd - colStart - gap * 2)) + colStart + gap;

        // If the grid is taller than it is wide, create a random horizontal wall with a gap
        if(rowEnd - rowStart > colEnd - colStart) {
            for(let i = colStart; i <= colEnd; i++) {
                if(!(i >= col  && i < col + gap) && gridCopy[row][i] !== startNode && gridCopy[row][i] !== endNode) {
                    gridCopy[row][i].type = NodeType.Wall;
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
                if(!(i >= row  && i < row + gap) && gridCopy[i][col] !== startNode && gridCopy[i][col] !== endNode) {
                    gridCopy[i][col].type = NodeType.Wall;
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
                        gridCopy[row][i].type = NodeType.Wall;
                        walls.push(gridCopy[row][i]);
                    }
                }
                stack.push({rowStart, rowEnd: row - 1, colStart, colEnd});
                stack.push({rowStart: row + 1, rowEnd, colStart, colEnd});
            }
            else {
                for(let i = rowStart; i <= rowEnd; i++) {
                    if(!(i < row + gap && i > row - gap) && gridCopy[i][col] !== startNode && gridCopy[i][col] !== endNode) {
                        gridCopy[i][col].type = NodeType.Wall;
                        walls.push(gridCopy[i][col]);
                    }
                }
                stack.push({rowStart, rowEnd, colStart, colEnd: col - 1});
                stack.push({rowStart, rowEnd, colStart: col + 1, colEnd});
            }
        }
    }
    /*
    //check if the maze has a solution
    const solution = bfs({...grid, nodes: gridCopy, startNode: gridCopy[grid.startNode.row][grid.startNode.col], endNode: gridCopy[grid.endNode.row][grid.endNode.col]});
    if(!solution) return false;
    */
    //if the maze has a solution, add the walls to grid.walls for animation upon return
    grid.walls = walls.map(node => grid.nodes[node.row][node.col]);
    return true;
};

// Pathfinding Algorithms

// Utility Functions
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
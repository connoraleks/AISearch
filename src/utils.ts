import {NodeType, NodeStatus, Node, Grid} from './types';
export const createNode = (row: number, col: number): Node => {
    return {
        row,
        col,
        type: NodeType.Default,
        status: NodeStatus.Unvisited,
        distance: Infinity,
        g: Infinity,
        h: Infinity,
        f: Infinity,
        previousNode: null,
    };
};
export const createGrid = (width: number, height: number): Grid => {
    const grid: Grid = {
        nodes: [],
        startNode: null,
        endNode: null,
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

import {Node, Grid} from './types';
const getNeighbors = (node: Node, grid: Node[][]) => {
    // TODO: implement this function
    // return an array of nodes that are neighbours of the given node
    // the neighbours are the nodes that are directly above, below, left and right of the given node
    return [];
};

const getDistance = (nodeA: Node, nodeB: Node) => {
    //TODO: implement this function
    // return the distance between the two given nodes
    return 0;
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
                color: "#ffffff"
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

export { getNeighbors, getDistance, createGrid };
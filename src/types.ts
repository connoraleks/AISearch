interface Node {
    id: string;
    row: number;
    col: number;
    neighbors: Node[];
    parent?: Node;
    g: number;
    h: number;
    f: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    color: string;
}

interface Grid {
    nodes: Node[][];
    start?: Node;
    end?: Node;
}
export type { Node, Grid };




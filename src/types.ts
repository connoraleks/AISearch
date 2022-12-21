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
    isPath: boolean;
}

interface Grid {
    nodes: Node[][];
    start: Node | null;
    end: Node | null;
    rows: number;
    cols: number;
    walls: Node[];
    visited: Node[];
    path: Node[];
}
export type { Node, Grid };




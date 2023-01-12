export enum NodeType {
    Start = 0,
    End = 1,
    Wall = 2,
    Default = 3,
}
export enum NodeStatus {
    Visited = 0,
    Unvisited = 1,
    Path = 2,
}
export enum DrawType {
    Start = 0,
    End = 1,
    Wall = 2,
    Erase = 3,
}
export interface Node {
    row: number;
    col: number;
    type: NodeType;
    status: NodeStatus;
    distance: number;
    g: number;
    h: number;
    f: number;
    previousNode: Node | null;
}
export interface Grid {
    nodes: Node[][];
    startNode: Node | null;
    endNode: Node | null;
    width: number;
    height: number;
}
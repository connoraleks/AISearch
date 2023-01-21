export enum NodeType {
    Default = 0,
    Start = 1,
    End = 2,
    Wall = 3,
}
export enum NodeStatus {
    Default = 0,
    Visited = 1,
    Path = 2,
}
export enum DrawType {
    Start = 0,
    End = 1,
    Wall = 2,
    Erase = 3,
}
export interface NodeInterface {
    row: number;
    col: number;
    type: NodeType;
    status: NodeStatus;
    distance: number;
    g: number;
    h: number;
    f: number;
    previousNode: NodeInterface | null;
}
export interface GridInterface {
    nodes: NodeInterface[][];
    startNode: NodeInterface | null;
    endNode: NodeInterface | null;
    walls: NodeInterface[];
    path: NodeInterface[];
    width: number;
    height: number;
}
export type NodeType = 'start' | 'end' | 'wall' | 'visited' | 'path' | 'default';
export type Algorithm = 'dijkstra' | 'a-star' | 'bfs' | 'dfs' | 'greedy-bfs';
export type DrawMode = 'start' | 'end' | 'wall' | 'default';
export interface Node {
    id: string;
    row: number;
    col: number;
    type: NodeType;
    neighbors: Node[];
    distance: number;
    g: number;
    h: number;
    f: number;
    parent: Node | null;
}
export interface Grid {
    nodes: Node[][];
    start: Node | null;
    end: Node | null;
    walls: Node[];
    path: Node[];
    visited: Node[];
    width: number;
    height: number;
    size: number;
}
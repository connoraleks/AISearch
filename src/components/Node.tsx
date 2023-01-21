import { DrawType, NodeInterface, NodeStatus, NodeType } from '../types';
export const Node = ({node, nodeSize, handleNodeClick, drawMode}: {node: NodeInterface, nodeSize: number, handleNodeClick: (node: NodeInterface) => void, drawMode: (DrawType | null)}) => {
    const nodeColors = {
        //green spring circular expansion until it reaches 100% size
        Start: 'rgba(0,255,0,0.5)',
        //red circular expansion until it reaches 100% size
        End: 'rgba(255,0,0,0.5)',
        //brownish but mostly black circular expansion until it reaches 100% size
        Wall: 'rgba(0,0,0,1)',
        //blue circular expansion until it reaches 100% size
        Visited: 'rgba(0,0,255,0.5)',
        //gold circular expansion until it reaches 100% size
        Path: 'rgba(255,215,0,0.5)',
        //white circular expansion until it reaches 100% size
        Default: 'rgba(255,255,255,0.5)',
    }
    return (
        <div
            id={`node-${node.row}-${node.col}`}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: node.type === NodeType.Default ? node.status === NodeStatus.Default ? nodeColors.Default : nodeColors[NodeStatus[node.status] as keyof typeof nodeColors] : nodeColors[NodeType[node.type] as keyof typeof nodeColors],
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.9)',
                cursor: drawMode === null ? 'default' : 'pointer',
            }}
            onClick={() => handleNodeClick(node)}
        >
        </div>
    );
};
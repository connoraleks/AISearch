import { motion } from 'framer-motion';
import {NodeInterface, GridInterface, DrawType} from '../types';
import {Node as NodeComponent} from './Node';
export const Grid = ({grid, nodeSize, handleNodeClick, drawMode}: {grid: GridInterface, nodeSize: number, handleNodeClick: (node: NodeInterface) => void, drawMode: (DrawType | null)}) => {
    // The grid should represent a dynamic grid of nodes to be used in the pathfinding algorithm
    // The grid should be able to be resized by the user
    // The grid should be able to be drawn on by the user
    // The grid should be able to be animated by the algorithm
    
    return (
        <motion.div
            id='grid'
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${grid.width}, ${nodeSize}px)`,
                gridTemplateRows: `repeat(${grid.height}, ${nodeSize}px)`,
                gridGap: '0px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '0.5rem',
                boxShadow: '0px 0px 0.5rem 0.5rem rgba(0,0,0,0.75)',
                overflow: 'hidden',
            }}
        >
            {grid.nodes.map((row, rindex) => row.map((node, cindex) => <NodeComponent key={`node-${rindex}-${cindex}`} node={node} nodeSize={nodeSize} handleNodeClick={handleNodeClick} drawMode={drawMode}/>))}
        </motion.div>
    );
};


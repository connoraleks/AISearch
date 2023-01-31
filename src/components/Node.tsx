import { Node as NodeInterface, DrawMode, NodeType } from '../utils/types';
import { motion } from 'framer-motion';
export const Node = ({type, parent} : {type: NodeType, parent: NodeInterface | null}) : JSX.Element => {
    return (
        <motion.div 
            className='w-full h-full'
            initial={{scale: 0}}
            animate={(type !== 'default') ? {scale: 1} : {scale: 0}}
            style={{
                backgroundColor: type === 'start' ? 'green' : type === 'end' ? 'red' : type === 'wall' ? 'black' : type === 'path' ? 'yellow' : type === 'visited' ? 'blue' : 'white',
            }}>
        </motion.div>
    )
}


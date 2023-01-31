import { Grid as GridInterface, Node as NodeInterface, DrawMode, NodeType } from '../utils/types';
import * as Utils from '../utils/utils';
import { Node } from './Node';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';

export const Grid = ({size, drawMode, findPath, setFindPath} : {size: number, drawMode: DrawMode, findPath: boolean, setFindPath: (findPath: boolean) => void}) => {
    const [grid, setGrid] = useState<GridInterface | null>(null);
    const [numRows, setNumRows] = useState<number | null>(null);
    const [numCols, setNumCols] = useState<number | null>(null);
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const [visitedIndex, setVisitedIndex] = useState<number>(0);
    const gridRef = useRef<HTMLDivElement>(null);

    const gridGenerationReady = numRows !== null && numCols !== null && grid !== null && grid.nodes !== null;
    const animatePathReady = grid !== null && grid.nodes !== null && grid.path !== null && grid.path.length > 0;
    // callback function for when the mouse is pressed down on a node
    const handleNodeClick = (node: NodeInterface) => {
        if(drawMode === 'start' as DrawMode) {
            if(node.type === 'end' || node.type === 'wall') {
                console.log('Cannot make end or wall node a start node');
            }
            else if(grid?.start === node) {
                console.log('Unsetting start node');
                node.type = 'default';
                setGrid({...grid, start: null});
            }
            else if(grid?.start) {
                console.log('Swapping start node');
                const oldStart = grid.start;
                oldStart.type = 'default';
                setGrid({...grid, start: node});
            }
            else if(grid){
                console.log('Defining start node');
                setGrid({...grid, start: node});
            }
        }
        else if(drawMode === 'end' as DrawMode) {
            if(node.type === 'start' || node.type === 'wall') {
                console.log('Cannot make start or wall node an end node');
            }
            else if(grid?.end === node) {
                console.log('Unsetting end node');
                node.type = 'default';
                setGrid({...grid, end: null});
            }
            else if(grid?.end) {
                console.log('Swapping end node');
                const oldEnd = grid.end;
                oldEnd.type = 'default';
                setGrid({...grid, end: node});
            }
            else if(grid){
                console.log('Defining end node');
                setGrid({...grid, end: node});
            }
        }
        else if(drawMode === 'wall' as DrawMode) {
            if(node.type === 'start' || node.type === 'end') console.log('Cannot make start or end node a wall')
            else if(grid){
                console.log('Defining wall node');
                // If the node is already a wall, remove it from the walls array
                if(grid.walls.includes(node)) {
                    node.type = 'default'
                    setGrid({...grid, walls: grid.walls.filter(wall => wall !== node)});
                }
                else setGrid({...grid, walls: [...grid.walls, node]});
            }
        }
        else{
            console.log('Draw Mode: ' + drawMode + ' is not supported');
        }
    }
    // Use effect responsible for showing changes in start, end, and wall nodes
    useEffect(() => {
        let flag = false; // Flag to determine if the grid state should be updated
        if(grid) {
            console.log('Grid Start: ' + grid.start);
            if(grid.start && grid.start.type !== 'start'){
                grid.start.type = 'start';
                flag = true;
            }
            console.log('Grid End: ' + grid.end);
            if(grid.end && grid.end.type !== 'end') {
                grid.end.type = 'end';
                flag = true;
            }
            console.log('Grid Walls: ' + grid.walls.length);
            grid.walls.forEach(wall => {
                if(wall.type !== 'wall'){
                    wall.type = 'wall';
                    flag = true;
                }
            });
            if(flag) setGrid({...grid});
        }
    }, [grid]);
    // Use effect to determine the number of rows and columns needed for the grid, NOT FOR CREATION OF GRID
    useEffect(() => {
        // If the grid is null, it has not been made yet, determine the number of rows and columns need to be made for an even grid with nodes of size 25px
        if ( (grid === null || size !== grid.size) && gridRef.current !== null) {
            console.log('Grid size changed, calculating new grid size');
            const { numRows : computedNumRows , numCols : computedNumCols } = Utils.getGridSize(size, gridRef);
            setNumRows(computedNumRows);
            setNumCols(computedNumCols);
            // Add a listener on the gridRef to listen for resize events
            const resizeObserver = new ResizeObserver(() => {
                const { numRows : computedNumRows , numCols : computedNumCols } = Utils.getGridSize(size, gridRef);
                setNumRows(computedNumRows);
                setNumCols(computedNumCols);
            });
            resizeObserver.observe(gridRef.current);
        }
    }, [grid, size, gridRef, gridGenerationReady]);
    // Use effect to create the grid
    useEffect(() => {
        if (numRows !== null && numCols !== null && (grid === null || grid.nodes === null)) {
            const grid = Utils.createGrid(numRows, numCols, size);
            setGrid(grid);
            console.log('Created first grid');
        }
        // If the grid is not null, it has been made, and the number of rows and columns have changed, remake the grid
        else if(numRows !== null && numCols !== null && grid !== null && grid.nodes !== null && (numRows !== grid.nodes.length || numCols !== grid.nodes[0].length)) {
            const grid = Utils.createGrid(numRows, numCols, size);
            setGrid(grid);
            console.log('Created grid with new size');
        }
    }, [numRows, numCols]);
    return (
        <motion.div 
            ref={gridRef} 
            className='w-full h-full bg-transparent text-black rounded-xl border-2 border-black overflow-hidden flex flex-col justify-center items-center'
            variants={{
                loading: {
                    opacity: 0,
                    scale: 0,
                    transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        mass: 0.1,
                    }
                },
                loaded: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        mass: 0.1,
                    }
                },
            }}
            initial='loading'
            animate={gridGenerationReady ? 'loaded' : 'loading'}
            >
            { gridGenerationReady ?
                grid.nodes.map((row, index) => {
                    return (
                        <div className='flex justify-center items-center w-full h-full' key={index}>
                            {row.map((node, index) => {
                                return (
                                    <div className='flex justify-center items-center w-full h-full relative bg-white border border-black' key={index}>
                                        <Node
                                            key={(node.row * numCols) + node.col}
                                            type={node.type}
                                            parent={node.parent}
                                        />
                                        <button className='absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none'
                                            disabled={drawMode === 'default' as DrawMode}
                                            onMouseDown={() => {
                                                setMouseDown(true);
                                                handleNodeClick(node);
                                            }}
                                            onMouseEnter={() => {
                                                if(mouseDown) handleNodeClick(node);
                                            }}
                                            onMouseUp={() => {
                                                setMouseDown(false);
                                            }}
                                        ></button>
                                    </div>
                                )
                            })}
                        </div>
                    )
                }) : 'Loading...'}
        </motion.div>
    )
}

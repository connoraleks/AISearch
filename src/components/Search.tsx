// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {DrawType, NodeType, NodeStatus, Node, Grid} from '../types';
import * as Utils from '../utils';
import { useState, useRef, useEffect } from 'react';
import { MenuComponent } from './MenuComponent';
import Slider from '@mui/material/Slider';
import {Box, ToggleButton, ToggleButtonGroup, Typography} from '@mui/material';
import { animate, motion } from 'framer-motion';


const Search = () => {
    const windowRef = useRef<HTMLDivElement>(null); // The ref to the grid div, used to get the width and height for resizing the grid
    const gridRef = useRef<HTMLDivElement>(null); // The ref to the grid div, used to get the width and height for resizing the grid
    const [grid, setGrid] = useState<Grid>(Utils.createGrid( 10, 10)); // The grid object, composed of {nodes: Node[][], start: Node | null, end: Node | null, width: number, height: number}
    const [numRows, setNumRows] = useState<number | null>(null); // The number of rows in the grid
    const [numCols, setNumCols] = useState<number | null>(null); // The number of columns in the grid
    const [nodeSize, setNodeSize] = useState<number>(55); // The size of each node in the grid
    const padding = 75; // The padding around the grid
    const [drawMode, setDrawMode] = useState<DrawType | null>(null); // The current draw mode, either 'wall', 'start', 'end', or null
    const [mouseDown, setMouseDown] = useState<boolean>(false); // Whether or not the mouse is currently down
    // UseEffect to resize the grid when either the windowRef, numRows, or numCols change
    useEffect(() => {
        const resizeGrid = () => {
            if(gridRef.current){
                const {width, height} = gridRef.current.getBoundingClientRect();
                const numRows = Math.floor((height) / nodeSize);
                const numCols = Math.floor((width) / nodeSize);
                setNumRows(numRows);
                setNumCols(numCols);
                setGrid(Utils.createGrid(numCols, numRows));
            }
        }
        window.addEventListener('resize', resizeGrid);
        resizeGrid();
    }, [gridRef, numRows, numCols, nodeSize, padding]);

    // JSX element to be passed to MenuCompoenent as a propm, used to control the grid. It will be the content of the menu
    // The menu should contain two sliders, to adjust the nodeSize and padding
    const handleNodeClick = (node: Node, rowIndex: number, nodeIndex: number) => {
        //Draw Start
        if(drawMode === DrawType.Start) {
            // IF there is no start node set currently
            if(!grid.startNode) {
                // Set the start node to the clicked node
                grid.nodes[rowIndex][nodeIndex].type = NodeType.Start;
                setGrid({...grid, startNode: grid.nodes[rowIndex][nodeIndex]});
            }
            // If there is a start node set currently
            else {
                grid.startNode.type = NodeType.Default;
                grid.nodes[rowIndex][nodeIndex].type = NodeType.Start;
                setGrid({...grid, startNode: grid.nodes[rowIndex][nodeIndex]});
            }
        } 
        //Draw End
        else if(drawMode === DrawType.End) {
        }
        //Draw Walls
        else if(drawMode === DrawType.Wall) {
        }
        else{
            console.log('No draw mode selected');
        }
    }
            

    // JSX element to be returned by the Search component
    return (
        <>
            <motion.div className='w-full h-full flex flex-col justify-center items-center relative' ref={windowRef} style={{padding: padding}}>
                <MenuComponent content={<p>Hello World</p>} constraintRef={windowRef} />
                <motion.div className='w-full h-full flex flex-col justify-center items-center border-2 border-black rounded-lg overflow-visible' ref={gridRef}>
                    {grid.nodes.map((row, rowIndex) => {
                        return (
                            <motion.div className='w-full h-full flex flex-row justify-center items-center' key={rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    return (
                                        <motion.div
                                            className='w-full h-full flex flex-row justify-center items-center overflow-hidden border border-black'
                                            key={nodeIndex}
                                        >
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </>
    );
}

export default Search;
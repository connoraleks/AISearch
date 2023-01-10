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
    const padding = 50; // The padding around the grid
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
    const menuContent = (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <Box
                sx={{
                    width: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography id='input-slider' gutterBottom sx={{fontWeight: 'medium'}} variant='h6'>
                    Draw Controls
                </Typography>
                <ToggleButtonGroup
                    value={drawMode}
                    exclusive
                    aria-label='draw mode'
                >
                    {/* Wall Toggle Button */}
                    <ToggleButton 
                        value={DrawType.Wall}
                        aria-label='wall' 
                        onClick={() => {
                            console.log(drawMode, DrawType.Wall)
                            if(drawMode === DrawType.Wall) {
                                setDrawMode(null);
                            } else {
                                setDrawMode(DrawType.Wall);
                            }
                        }}

                    >
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-square'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect></svg>
                    </ToggleButton>
                    {/* Start Toggle Button */}
                    <ToggleButton 
                        value={DrawType.Start}
                        aria-label='start'
                        onClick={() => {
                            if(drawMode === DrawType.Start) {
                                setDrawMode(null);
                            } else {
                                setDrawMode(DrawType.Start);
                            }
                        }}
                    >
                        {/* Start svg should be a circle with a circle inside */}
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-circle'><circle cx='12' cy='12' r='10'></circle><circle cx='12' cy='12' r='4'></circle></svg>
                    </ToggleButton>
                    {/* End Toggle Button */}
                    <ToggleButton 
                        value={DrawType.End}
                        aria-label='end'
                        onClick={() => {
                            if(drawMode === DrawType.End) {
                                setDrawMode(null);
                            } else {
                                setDrawMode(DrawType.End);
                            }
                        }}
                    >
                        {/* End svg should be a black solid circle */}
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-circle'><circle cx='12' cy='12' r='10'></circle><circle fill='black' cx='12' cy='12' r='4'></circle></svg>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Slider
                defaultValue={nodeSize}
                aria-label='Node Size'
                valueLabelDisplay='auto'
                step={5}
                min={20}
                max={100}
                onChangeCommitted={(event, value) => setNodeSize(value as number)}
            />
        </div>
    );
    const handleNodeClick = (node: Node, rowIndex: number, nodeIndex: number) => {
        if(drawMode === DrawType.Start && !grid.startNode) {
            grid.nodes[rowIndex][nodeIndex].type = NodeType.Start;
            grid.startNode = grid.nodes[rowIndex][nodeIndex];
        } else if(drawMode === DrawType.Start && grid.startNode){
            grid.nodes[rowIndex][nodeIndex].type = node.type === NodeType.Start ? NodeType.Default : NodeType.Start;
            if(node.type === NodeType.Start) {
                grid.startNode = null;
            } else {
                grid.startNode.type = NodeType.Default;
                grid.startNode = grid.nodes[rowIndex][nodeIndex];
            }
        }
    }
            

    // JSX element to be returned by the Search component
    return (
        <>
            <motion.div className='w-full h-full flex flex-col justify-center items-center' ref={windowRef} style={{padding: padding}}>
                <MenuComponent content={menuContent} constraintRef={windowRef} />
                <motion.div className='w-full h-full flex flex-col justify-center items-center border-2 border-black rounded-lg overflow-visible' ref={gridRef}>
                    {grid.nodes.map((row, rowIndex) => {
                        return (
                            <motion.div className='w-full h-full flex flex-row justify-center items-center' key={rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    return (
                                        <motion.div
                                            className='w-full h-full flex flex-row justify-center items-center overflow-hidden border border-black'
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
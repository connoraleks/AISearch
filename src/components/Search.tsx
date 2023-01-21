// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {DrawType, NodeType, NodeStatus, NodeInterface, GridInterface} from '../types';
import * as Utils from '../utils';
import { useState, useRef, useEffect } from 'react';
import { MenuComponent } from './MenuComponent';
import Slider from '@mui/material/Slider';
import {Box, ToggleButton, ToggleButtonGroup, Typography, Button} from '@mui/material';
import { motion } from 'framer-motion';
import { Grid as GridComponent } from './Grid';
import { ImSpinner8 } from 'react-icons/im';
import { CgSpinnerAlt } from 'react-icons/cg';


const Search = () => {
    const windowRef = useRef<HTMLDivElement>(null); // The ref to the grid div, used to get the width and height for resizing the grid
    const gridRef = useRef<HTMLDivElement>(null); // The ref to the grid div, used to get the width and height for resizing the grid
    const [grid, setGrid] = useState<GridInterface | null>(null); // The grid object, composed of {nodes: Node[][], start: Node | null, end: Node | null, width: number, height: number}
    const [numRows, setNumRows] = useState<number | null>(null); // The number of rows in the grid
    const [numCols, setNumCols] = useState<number | null>(null); // The number of columns in the grid
    const [nodeSize, setNodeSize] = useState<number>(55); // The size of each node in the grid
    const padding = 75; // The padding around the grid
    const [drawMode, setDrawMode] = useState<DrawType | null>(null); // The current draw mode, either 'wall', 'start', 'end', or null
    const [running, setRunning] = useState<boolean>(false); // Whether or not an animation is running


    // UseEffect to resize the grid when either the windowRef, numRows, or numCols change
    useEffect(() => {
        console.log('Resize Grid')
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
    // UseEffect to animate the walls when the running state changes to true
    useEffect(() => {
        if(!running || !grid) return;
        const wall = grid.walls.shift();
        if(!wall) {
            setRunning(false);
            return;
        }
        Utils.delay(grid.nodes.length * 0.0001).then(() => setGrid({...Utils.setWall(grid, wall)}));
    }, [running, grid]);


    // JSX element to be passed to MenuCompoenent as a prop, used to control the grid. It will be the content of the menu
    const menuContent = [
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Typography id='node-size-slider'>
                Node Size
            </Typography>
            <Slider
                value={nodeSize}
                style={{maxWidth: '24rem'}}
                onChange={(event, newValue) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setNodeSize(newValue as number);
                }}
                aria-labelledby='node-size-slider'
                valueLabelDisplay='auto'
                step={5}
                min={10}
                max={100}
            />
        </Box>,
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <ToggleButtonGroup
                value={drawMode}
                exclusive
                onChange={(event, newDrawMode) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setDrawMode(newDrawMode);
                }}
                aria-label='draw mode'
                style={{
                    opacity: 1,
                }}
            >
                <ToggleButton value={DrawType.Start} aria-label='start'>
                    Start
                </ToggleButton>
                <ToggleButton value={DrawType.End} aria-label='end'>
                    End
                </ToggleButton>
                <ToggleButton value={DrawType.Wall} aria-label='wall'>
                    Wall
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>,
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {!running ? <Button variant='contained' onClick={(event) => {
                if(!grid) return;
                event.stopPropagation();
                event.preventDefault();
                Utils.resetWalls(grid);
                if(Utils.generateRecursiveDivisionMaze(grid, 2)) setRunning(true);
            }}>
                Generate Maze
            </Button> : <Button variant='contained' onClick={() => setRunning(false)}> Stop </Button>}
        </Box>,
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant='contained' onClick={(event) => {
                if(!grid) return;
                event.stopPropagation();
                event.preventDefault();
                setGrid({...Utils.resetWalls(grid)});
            }}>
                Clear Walls
            </Button>
        </Box>,
    ]
    // The menu should contain two sliders, to adjust the nodeSize and padding
    const handleNodeClick = (node: NodeInterface) => {
        if(!grid) return;
        //Draw Start
        else if(drawMode === DrawType.Start) {
            console.log('Draw Start');
            setGrid({...Utils.setStart(grid, node)});
        } 
        //Draw End
        else if(drawMode === DrawType.End) {
            console.log('Draw End');
            setGrid({...Utils.setEnd(grid, node)});
        }
        //Draw Walls
        else if(drawMode === DrawType.Wall) {
            console.log('Draw Wall', grid.walls);
            setGrid({...Utils.setWall(grid, node)});
        }
        else{
            console.log('No draw mode selected');
        }
    }

    // JSX element to be returned by the Search component
    return (
        <motion.div className='w-full h-full flex flex-col justify-center items-center relative' ref={windowRef} style={{padding: padding}} drag={false}>
            <MenuComponent content={menuContent} constraintRef={windowRef} />
            <div className='w-full h-full relative flex justify-center items-center' ref={gridRef}>
            {grid ? <GridComponent grid={grid} nodeSize={nodeSize} handleNodeClick={handleNodeClick} drawMode={drawMode}/> : 
            <>
                <CgSpinnerAlt className='animate-spin absolute ' size={100} />
                <ImSpinner8 className='animate-spin absolute' size={100} />
            </>
            }
            </div>
        </motion.div>
    );
}

export default Search;
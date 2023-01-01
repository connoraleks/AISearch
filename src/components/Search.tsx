// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {DrawType, NodeType, NodeStatus, Node, Grid} from '../types';
import * as Utils from '../utils';
import { useState, useRef, useEffect } from 'react';
import { MenuComponent } from './MenuComponent';
import Slider from '@mui/material/Slider';
import {Box, ToggleButton, ToggleButtonGroup, Typography} from '@mui/material';


const Search = () => {
    const gridRef = useRef<HTMLDivElement>(null); // The ref to the grid div, used to get the width and height for resizing the grid
    const [grid, setGrid] = useState<Grid>(Utils.createGrid( 10, 10)); // The grid object, composed of {nodes: Node[][], start: Node | null, end: Node | null, width: number, height: number}
    const [numRows, setNumRows] = useState<number>(10); // The number of rows in the grid
    const [numCols, setNumCols] = useState<number>(10); // The number of columns in the grid
    const [nodeSize, setNodeSize] = useState<number>(32); // The size of each node in the grid
    const [padding, setPadding] = useState<number>(75); // The padding around the grid
    const [drawMode, setDrawMode] = useState<DrawType | null>(null); // The current draw mode, either 'wall', 'start', 'end', or null
    // UseEffect to resize the grid when either the gridRef, numRows, or numCols change
    useEffect(() => {
        if (gridRef.current && numRows && numCols && nodeSize && padding) {
            if(Math.floor((gridRef.current.clientHeight - (padding * 2)) / nodeSize) !== numRows || Math.floor((gridRef.current.clientWidth - (padding * 2)) / nodeSize) !== numCols) {
                setNumCols(Math.floor((gridRef.current.clientWidth - (padding * 2)) / nodeSize));
                setNumRows(Math.floor((gridRef.current.clientHeight - (padding * 2)) / nodeSize));
                setGrid(Utils.createGrid(Math.floor((gridRef.current.clientWidth - (padding * 2)) / nodeSize), Math.floor((gridRef.current.clientHeight - (padding * 2)) / nodeSize)));
            }
        }
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
                <Typography id='input-slider' gutterBottom>
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
                defaultValue={32}
                aria-label='Node Size'
                valueLabelDisplay='auto'
                step={1}
                min={1}
                max={100}
                onChangeCommitted={(event, value) => setNodeSize(value as number)}
            />
            <Slider
                defaultValue={75}
                aria-label='Padding'
                valueLabelDisplay='auto'
                step={1}
                min={1}
                max={100}
                onChangeCommitted={(event, value) => setPadding(value as number)}
            />
        </div>
    );

    // JSX element to be returned by the Search component
    return (
        <>
            <MenuComponent content={menuContent} />
            <div className='w-full h-full flex flex-col justify-center items-center' ref={gridRef}>
                <div className='flex flex-col justify-center items-center border-2 border-black'>
                    {grid.nodes.map((row, rowIndex) => {
                        return (
                            <div className='flex' key={rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    return (
                                        <div
                                            style = {{width: `${nodeSize}px`, height: `${nodeSize}px`}}
                                            className={`border border-black flex justify-center items-center ${
                                                node.type === NodeType.Start
                                                    ? 'bg-start'
                                                    : node.type === NodeType.End
                                                    ? 'bg-end'
                                                    : node.status === NodeStatus.Visited
                                                    ? 'bg-visited'
                                                    : node.status === NodeStatus.Path
                                                    ? 'bg-path'
                                                    : node.type === NodeType.Wall
                                                    ? 'bg-wall'
                                                    : ''
                                            }`}
                                            key={nodeIndex}
                                        ></div>
                                    );
                                })}
                            </div>
                        );
                    })
                    }
                </div>
            </div>
        </>
    );
}
export default Search;

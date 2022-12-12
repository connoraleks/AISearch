import {Node, Grid} from '../types';
import * as Utils from '../utils';
import { useState, useEffect } from 'react';
import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const Search = () => {
    // Colors for the grid
    const colors = {
        start: "#4ee66c",
        end: "#e64e4e",
        wall: "#363029",
        visited: "#4e4ee6",
        path: "#e6e64e",
        default: "#ffffff"
    }
    // Algorithms for the search
    const algorithms = {
        "Dijkstra's Algorithm": Utils.dijkstra,
        "A* Search": Utils.aStar,
        "Breadth First Search": Utils.bfs,
        "Depth First Search": Utils.dfs
    }
    const drawingStates = {
        start: "start",
        end: "end",
        walls: "walls",
        none: "none"
    }
    // List of algorithms for the dropdown
    const algorithmList = Object.keys(algorithms);
    // State containing the algorithm to use
    const [algorithm, setAlgorithm] = useState<[string, (grid: Grid, startNode: Node, endNode: Node) => Node[]]>([algorithmList[2], algorithms[algorithmList[2] as keyof typeof algorithms]]);
    // State for the grid
    const [grid, setGrid] = useState<Grid>(Utils.createGrid(25, 50));
    // State for start node
    const [startNode, setStartNode] = useState<Node>();
    // State for end node
    const [endNode, setEndNode] = useState<Node>();
    // State containing nodes that are walls
    const [walls, setWalls] = useState<Node[]>([]);
    // State to trigger the search
    const [isSearching, setIsSearching] = useState<boolean>(false);
    // State to trigger the clearing of the grid
    const [isClearing, setIsClearing] = useState<boolean>(false);
    // State containing whether or not the user is drawing; and if so, what they are drawing
    const [drawing, setDrawing] = useState<string>(drawingStates.none);

    return (
        <section className='flex flex-col justify-center items-center h-full w-full relative pt-20'>
            {/* Sticky header with title, toggle buttons, and search controls */}
            <header className='flex flex-row justify-between items-center w-full h-20 bg-gray-800 fixed top-0 z-10'>
                {/* Title to match the sleek mui theme */}
                <h1 className='text-4xl text-white font-bold'>Pathfinding Visualizer</h1>
                <div className="w-full h-full" >
                    {/*Toggle button middle section, if the user clicks the same option twice, it will deselect it, include a clear button that looks like its attached to the toggle buttons */}
                    <ToggleButtonGroup
                        value={drawing}
                        exclusive
                        onChange={(event, newDrawing) => {
                            if (newDrawing !== null) {
                                setDrawing(newDrawing);
                            }
                        }}
                        aria-label="drawing"
                    >
                        {/* Toggle button for each drawing state, should look identical to the search and reset buttons, transparent background and white text with full height to match the other buttons */}
                        {Object.keys(drawingStates).map((state) => {
                            return (
                                <ToggleButton value={state} aria-label={state} sx={{ color: "white", borderColor: "white", height: "full", margin: "0" }}>
                                    {state}
                                </ToggleButton>
                            );
                        })}
                    </ToggleButtonGroup>
                    {/* Right Section, search controls, features dropdown to select algorithm and button to start search as well as buttons to completely clear the grid and reset the visualizations */}
                    <FormControl 
                        variant="outlined"
                        sx={{ color: "white", borderColor: "white", height: "full", margin: "0" }}
                    >
                        <InputLabel id="algorithm-label" sx={{ color: "white" }}>Algorithm</InputLabel>
                        {/* Dropdown to select the algorithm, should feature transparent background and white text with a white border */}
                        <Select
                            labelId="algorithm-label"
                            id="algorithm"
                            value={algorithm[0]}
                            label="Algorithm"
                            onChange={(event: SelectChangeEvent) => {
                                setAlgorithm([event.target.value as string, algorithms[event.target.value as keyof typeof algorithms]]);
                            }}
                            sx={{
                                color: "white",
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '.MuiSvgIcon-root ': {
                                    fill: "white !important",
                                },
                                height: "full",
                                margin: "0"
                            }}           
                        >
                            {algorithmList.map((algorithm) => {
                                return (
                                    <MenuItem value={algorithm}>{algorithm}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    {/* Button group for the search and reset buttons, they should look identical to the toggle buttons, transparent background and white text */}
                    <ButtonGroup variant="outlined" aria-label="search and reset" sx={{ color: "white", borderColor: "white", height: "full" }}>
                        <Button sx={{ color: "white", borderColor: "white", height: "full", ":hover": { backgroundColor: "transparent", borderColor: "gray" } }} onClick={() => {
                            setIsSearching(true);
                        }}>Search</Button>
                        <Button sx={{ color: "white", borderColor: "white",  height: "full", borderLeftColor: "gray", ":hover": { backgroundColor: "transparent",  borderColor: "gray", borderLeftColor: "gray" } }} onClick={() => {
                            setGrid(Utils.createGrid(25, 50));
                            setWalls([]);
                            setStartNode(undefined);
                            setEndNode(undefined);
                            setIsClearing(true);
                        }}>Reset</Button>
                    </ButtonGroup>
                </div>
            </header>
            {/* Grid */}
        </section>
    );
};

export default Search;

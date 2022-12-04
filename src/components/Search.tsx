import {Node, Grid} from '../types';
import * as Utils from '../utils';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const Search = () => {
    const colors = {
        start: "#4ee66c",
        end: "#e64e4e",
        wall: "#363029",
        visited: "#4e4ee6",
        path: "#e6e64e",
        default: "#ffffff"
    }
    const algorithms = {
        "Dijkstra's Algorithm": Utils.dijkstra,
        "A* Search": Utils.aStar,
        "Breadth First Search": Utils.bfs,
        "Depth First Search": Utils.dfs
    }
    const algorithmList = Object.keys(algorithms);
    const gridRef = useRef<HTMLDivElement>(null);
    const [grid, setGrid] = useState<Grid>(Utils.createGrid(25, 50));
    const [drawing, setDrawing] = useState<boolean>(false);
    const [startNode, setStartNode] = useState<Node>();
    const [isDrawingStart, setIsDrawingStart] = useState<boolean>(false);
    const [endNode, setEndNode] = useState<Node>();
    const [isDrawingEnd, setIsDrawingEnd] = useState<boolean>(false);
    const [walls, setWalls] = useState<Node[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isClearing, setIsClearing] = useState<boolean>(false);
    const [isDrawingWalls, setIsDrawingWalls] = useState<boolean>(false);
    const [continuousDrawing, setContinuousDrawing] = useState<boolean>(false);
    const [algorithm, setAlgorithm] = useState<[string, (grid: Grid, startNode: Node, endNode: Node) => Node[]]>([algorithmList[0], algorithms[algorithmList[0] as keyof typeof algorithms]]);


    useEffect(() => {
        if (isClearing) {
            setGrid(Utils.createGrid(25, 50));
            setStartNode(undefined);
            setEndNode(undefined);
            setWalls([]);
            setIsClearing(false);
        }
    }, [isClearing]);

    //When the isSearching state changes, run the search algorithm, coloring the neighbors of the start node
    useEffect(() => {
        if (isSearching && startNode && endNode) {
            // Determine which algorithm to use
            const algorithmFunction = algorithm[1];

            // Run the algorithm
            const visitedNodes = algorithmFunction(grid, startNode, endNode);

            // Color the visited nodes
            for (let i = 0; i < visitedNodes.length; i++) {
                setTimeout(() => {
                    const node = visitedNodes[i];
                    grid.nodes[node.row][node.col].isVisited = true;
                    setGrid({...grid});
                }, 10 * i);
            }

            // Color the path
            setTimeout(() => {
                const path = Utils.getPath(endNode);
                console.log(path);
                for (let i = 0; i < path.length; i++) {
                    setTimeout(() => {
                        const node = path[i];
                        grid.nodes[node.row][node.col].isPath = true;
                        setGrid({...grid});
                    }, 50 * i);
                }
            }, 10 * visitedNodes.length);
            //print all of the nodes in the grid that have the parent attribute
            console.log(grid.nodes.filter(row => row.filter(node => node.parent).length > 0));
        }
        else if (isSearching && !startNode) {
            alert("Please select a start node");
            setIsSearching(false);
        }
        else if (isSearching && !endNode) {
            alert("Please select an end node");
            setIsSearching(false);
        }
        setIsSearching(false);
    }, [algorithm, colors.path, colors.visited, endNode, grid, isSearching, startNode]);

    useEffect(() => {
        setDrawing(isDrawingStart || isDrawingEnd || isDrawingWalls);
    }, [isDrawingStart, isDrawingEnd, isDrawingWalls]);


    useEffect(() => {
        console.log('startNode', startNode);
    }, [startNode]);

    useEffect(() => {
        console.log('endNode', endNode);
    }, [endNode]);

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-row pb-4'>
                <button className='bg-[#1e243d] text-white text-lg font-bold py-2 px-4 rounded hover:text-blue-300 transition-colors duration-300'
                        onClick={() => setIsDrawingStart(!isDrawingStart)}>
                    Start
                </button>
                <button className='bg-[#1e243d] text-white text-lg font-bold py-2 px-4 rounded hover:text-red-300 transition-colors duration-300'
                        onClick={() => setIsDrawingEnd(!isDrawingEnd)}>
                    End
                </button>
                <button className='bg-[#1e243d] text-white text-lg font-bold py-2 px-4 rounded hover:text-gray-400 transition-colors duration-300'
                        onClick={() => setIsDrawingWalls(!isDrawingWalls)}>
                    Wall
                </button>
                <button className='bg-[#1e243d] text-white text-lg font-bold py-2 px-4 rounded  hover:text-red-300 transition-colors duration-300'
                        onClick={() => setIsClearing(true)}>
                    Clear
                </button>
                {/* Dropdown menu for selecting the algorithm with color/font matching the theme */}
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel 
                        id="demo-simple-select-label"
                        sx={{color: 'white'}}
                    >
                        Algorithm
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={algorithm[0]}
                        label="Algorithm"
                        onChange={(e: SelectChangeEvent) => setAlgorithm([e.target.value as string, algorithms[e.target.value as keyof typeof algorithms]])}
                        sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    >
                        {algorithmList.map((algorithm, index) => {
                            return <MenuItem key={index} value={algorithm}>{algorithm}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <button className='bg-[#1e243d] text-white text-lg font-bold py-2 px-4 rounded hover:text-blue-300 transition-colors duration-300'
                        onClick={() => {
                            // Wipe the grid of all visited and path nodes
                            grid.nodes.forEach(row => {
                                row.forEach(node => {
                                    node.isVisited = false;
                                    node.isPath = false;
                                });
                            });
                            setGrid({...grid});
                            setIsSearching(true)
                        }}>
                    Search
                </button>
            </div>
            <div ref={gridRef} className='grid grid-cols-50 grid-rows-25 gap-1 bg-black p-2 rounded-xl'>
                {grid.nodes.map((row,rindex) => (
                    <div key={rindex} className='flex flex-row gap-1'>
                        {row.map((node, cindex) => (
                            <button key={cindex}
                                    disabled={!drawing}
                                    className='w-5 h-5 enabled:hover:scale-[0.95] transition-all duration-300 ease-in-out rounded-sm' 
                                    style={{backgroundColor: node.isStart ? colors.start : node.isEnd ? colors.end : node.isWall ? colors.wall : node.isPath ? colors.path : node.isVisited ? colors.visited : colors.default}}
                                    onMouseDown={() => {
                                        if (isDrawingStart) {
                                            //Clear previous start node if it exists, without creating a new grid
                                            if (startNode) {
                                                grid.nodes[startNode.row][startNode.col].isStart = false;
                                            }
                                            node.isStart = true;
                                            setStartNode(node);
                                            setIsDrawingStart(false);
                                            setIsDrawingWalls(false);
                                        } else if (isDrawingEnd) {
                                            //Clear previous end node if it exists, without creating a new grid
                                            if (endNode) {
                                                grid.nodes[endNode.row][endNode.col].isEnd = false;
                                            }
                                            node.isEnd = true;
                                            setEndNode(node);
                                            setIsDrawingEnd(false);
                                            setIsDrawingWalls(false);
                                        } else if (isDrawingWalls) {
                                            //If the node is already a wall, remove it from the walls array
                                            if (node.isWall) {
                                                setWalls(walls.filter(wall => wall !== node));
                                                node.isWall = false;
                                            } else {
                                                node.isWall = true;
                                                setWalls([...walls, node]);
                                            }
                                            setContinuousDrawing(true);
                                        }
                                    }}
                                    //Allow user to draw walls by holding down mouse button
                                    onMouseEnter={() => {
                                        if (isDrawingWalls && continuousDrawing) {
                                            //If the node is already a wall, remove it from the walls array
                                            if (node.isWall) {
                                                setWalls(walls.filter(wall => wall !== node));
                                                node.isWall = false;
                                            } else {
                                                node.isWall = true;
                                                setWalls([...walls, node]);
                                            }
                                        }
                                    }}
                                    onMouseUp={() => {
                                        if (isDrawingWalls) {
                                            setContinuousDrawing(false);
                                        }
                                    }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;

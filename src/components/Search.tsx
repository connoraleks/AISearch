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
        default: "#ffffff",
        hover: "#1e243d"
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
    // Number of rows for the grid, and number of columns for the grid, calculated from the size of the window given that each node is 32px by 32px
    const numRows = Math.floor((window.innerHeight - 96) / 32); // 96px is the height of the header
    const numCols = Math.floor(window.innerWidth / 32);

    // List of algorithms for the dropdown
    const algorithmList = Object.keys(algorithms);
    // State containing the algorithm to use
    const [algorithm, setAlgorithm] = useState<[string, (grid: Grid, startNode: Node, endNode: Node) => Node[]]>([algorithmList[2], algorithms[algorithmList[2] as keyof typeof algorithms]]);
    // State for the grid
    const [grid, setGrid] = useState<Grid>(Utils.createGrid(numRows, numCols));
    // State for start node
    const [startNode, setStartNode] = useState<Node>();
    // State for end node
    const [endNode, setEndNode] = useState<Node>();
    // State containing nodes that are walls
    const [walls, setWalls] = useState<Node[]>([]);
    // State containing the drawing mode
    const [drawing, setDrawing] = useState<string>(drawingStates.none);
    // State containing whether or not the user is dragging while drawing
    const [isDragging, setIsDragging] = useState<boolean>(false);
    // State containing whether or not the user is erasing walls
    const [isErasing, setIsErasing] = useState<boolean>(false);

    // Function to handle the user clicking the clear button
    const handleClear = () => {
        // Reset the grid
        setGrid(Utils.createGrid(numRows, numCols));
        // Reset the start node
        setStartNode(undefined);
        // Reset the end node
        setEndNode(undefined);
        // Reset the walls
        setWalls([]);
    }

    // Function to handle the user clicking the search button
    const handleSearch = () => {
        // Remove all isVisited and isPath properties from the grid
        grid.nodes.forEach(row => {
            row.forEach(node => {
                node.isVisited = false;
                node.isPath = false;
            });
        });
        // If the start node and end node are not defined, return
        if (!startNode || !endNode) return;
        // Get the path from the algorithm
        const visitedNodesInOrder = algorithm[1](grid, startNode, endNode);
        // Get the path from the end node
        const nodesInShortestPathOrder = Utils.getPath(endNode);
        // For each node in the visited nodes in order list, flick the isVisited property to true
        visitedNodesInOrder.forEach(node => {
            setTimeout(() => {
                grid.nodes[node.row][node.col].isVisited = true;
                setGrid({...grid});
            }, 15 * visitedNodesInOrder.indexOf(node));
        });
        // For each node in the nodes in shortest path order list, flick the isPath property to true
        nodesInShortestPathOrder.forEach(node => {
            setTimeout(() => {
                grid.nodes[node.row][node.col].isPath = true;
                setGrid({...grid});
            }, 25 * nodesInShortestPathOrder.indexOf(node) + 15 * visitedNodesInOrder.length);
        }
        );
    }

        

    return (
        <section className="w-full min-h-screen flex flex-col bg-gray-300">
            {/* Header containing the title and controls for the search/drawing */}
            <nav className="flex flex-row justify-between items-center bg-gray-700 p-4 h-24 w-full">
                <a href="/" className="text-2xl text-white font-bold">AI Search</a>
                <div className="flex flex-row items-center">
                    <div id="ButtonGroup" className="hidden md:flex flex-row items-center">
                        <Button 
                            onClick={() => {
                                setDrawing(drawing === drawingStates.start ? drawingStates.none : drawingStates.start);
                            }}
                            sx={{
                                backgroundColor: drawing === drawingStates.start ? colors.start : 'transparent',
                                color: drawing === drawingStates.start ? colors.default : colors.start,
                                border: drawing === drawingStates.start ? 'none' : `1px solid white`,
                                ":hover": {
                                    border: `1px solid ${colors.start}`,
                                    backgroundColor: drawing === drawingStates.start ? colors.start : 'transparent',
                                    color: drawing === drawingStates.start ? colors.default : colors.start,
                                }
                            }}

                        >
                            Start
                        </Button>
                        <Button
                            onClick={() => {
                                setDrawing(drawing === drawingStates.end ? drawingStates.none : drawingStates.end);
                            }}
                            sx={{
                                backgroundColor: drawing === drawingStates.end ? colors.end : 'transparent',
                                color: drawing === drawingStates.end ? colors.default : colors.end,
                                border: drawing === drawingStates.end ? 'none' : `1px solid white`,
                                ":hover": {
                                    border: `1px solid ${colors.end}`,
                                    backgroundColor: drawing === drawingStates.end ? colors.end : 'transparent',
                                    color: drawing === drawingStates.end ? colors.default : colors.end,
                                }
                            }}
                        >
                            End
                        </Button>
                        <Button
                            onClick={() => {
                                setDrawing(drawing === drawingStates.walls ? drawingStates.none : drawingStates.walls);
                            }}
                            sx={{
                                backgroundColor: drawing === drawingStates.walls ? colors.wall : 'transparent',
                                color: drawing === drawingStates.walls ? colors.default : colors.wall,
                                border: drawing === drawingStates.walls ? 'none' : `1px solid white`,
                                ":hover": {
                                    border: `1px solid ${colors.wall}`,
                                    backgroundColor: drawing === drawingStates.walls ? colors.wall : 'transparent',
                                    color: drawing === drawingStates.walls ? colors.default : colors.wall,
                                }
                            }}
                        >
                            Walls
                        </Button>
                    </div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Algorithm</InputLabel>
                        <Select
                            labelId="algorithm-select-label"
                            id="algorithm-select"
                            value={algorithm[0]}
                            label="Algorithm"
                            onChange={(event: SelectChangeEvent) => {
                                setAlgorithm([event.target.value as string, algorithms[event.target.value as keyof typeof algorithms]]);
                            }}
                        >
                            {algorithmList.map((algorithm, index) => {
                                return <MenuItem key={index} value={algorithm}>{algorithm}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        sx={{
                            color: colors.default,
                            border: `1px solid ${colors.default}`,
                            ":hover": {
                                border: `1px solid ${colors.hover}`,
                                backgroundColor: colors.default,
                                color: colors.hover
                            }
                        }}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            color: colors.default,
                            border: `1px solid ${colors.default}`,
                            ":hover": {
                                border: `1px solid ${colors.hover}`,
                                backgroundColor: colors.default,
                                color: colors.hover
                            }
                        }}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </div>
            </nav>
            {/* Grid containing the nodes, should be a square that fills the screen */}
            <div className="flex flex-col justify-center items-center">
                {grid.nodes.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="flex flex-row">
                            {row.map((node, colIndex) => {
                                return(
                                    // Tile for each node, onHover should slightly rise from the grid, and onClick should change the state of the node. 
                                    //Advanced functionality: allow the user to draw walls by holding down the mouse button and dragging over the grid
                                    <button
                                        key={node.id}
                                        disabled={drawing === drawingStates.none}
                                        className='w-8 h-8 border border-gray-500' 
                                        style={{
                                            backgroundColor: node.isStart ? colors.start : node.isEnd ? colors.end : node.isWall ? colors.wall : node.isPath ? colors.path : node.isVisited ? colors.visited : colors.default,
                                            color: colors.default
                                        }}
                                        onMouseDown={() => {
                                            if (drawing === drawingStates.start) {
                                                if(startNode === node) {
                                                    setStartNode(undefined);
                                                    node.isStart = false;
                                                    return;
                                                } else if(startNode) {
                                                    startNode.isStart = false;
                                                }
                                                setStartNode(node);
                                                node.isStart = true;
                                                node.isEnd = false;
                                                node.isWall = false;
                                            } else if (drawing === drawingStates.end) {
                                                if(endNode === node) {
                                                    setEndNode(undefined);
                                                    node.isEnd = false;
                                                    return;
                                                } else if(endNode) {
                                                    endNode.isEnd = false;
                                                }
                                                setEndNode(node);
                                                node.isStart = false;
                                                node.isEnd = true;
                                                node.isWall = false;
                                            } else if(drawing === drawingStates.walls && !node.isStart && !node.isEnd && node.isWall){
                                                setWalls(walls.filter(wall => wall.id !== node.id));
                                                node.isWall = false;
                                                setIsErasing(true);
                                            } else if (drawing === drawingStates.walls && !node.isStart && !node.isEnd) {
                                                setWalls([...walls, node]);
                                                node.isStart = false;
                                                node.isEnd = false;
                                                node.isWall = true;
                                                setIsDragging(true);
                                            }
                                        }}
                                        onMouseEnter={() => {
                                            if (drawing === drawingStates.walls && isDragging && !node.isStart && !node.isEnd) {
                                                setWalls([...walls, node]);
                                                node.isStart = false;
                                                node.isEnd = false;
                                                node.isWall = true;
                                            } else if (drawing === drawingStates.walls && isErasing && !node.isStart && !node.isEnd && node.isWall) {
                                                setWalls(walls.filter(wall => wall.id !== node.id));
                                                node.isWall = false;
                                            }
                                        }}
                                        onMouseUp={() => {
                                            if (drawing === drawingStates.walls) {
                                                setIsDragging(false);
                                                setIsErasing(false);
                                            }
                                        }}
                                    >
                                        {node.isStart ? 'S' : node.isEnd ? 'E' : node.isWall ? 'W' : ''}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Search;

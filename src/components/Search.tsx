import {Grid} from '../types';
import {GiHamburgerMenu} from 'react-icons/gi';
import * as Utils from '../utils';
import { useState } from 'react';
import { Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const Search = () => {
    // Algorithms for the search
    const pathFindingAlgorithms = {
        "Dijkstra's Algorithm": Utils.dijkstra,
        "A* Search": Utils.aStar,
        "Breadth First Search": Utils.bfs,
        "Depth First Search": Utils.dfs
    }
    // List of pathFindingAlgorithms for the dropdown
    const pathFindingAlgorithmList = Object.keys(pathFindingAlgorithms);
    // Algorithms for the maze generation
    const mazeAlgorithms = {
        "Recursive Division": Utils.recursiveDivision,
        "Prim's Algorithm": Utils.prims,
        "Kruskal's Algorithm": Utils.kruskals
    }
    // List of mazeAlgorithms for the dropdown
    const mazeAlgorithmList = Object.keys(mazeAlgorithms);
    
    // Drawing states for the grid
    const drawingStates = {
        start: "start",
        end: "end",
        walls: "walls",
        none: "none"
    }
    // Number of rows for the grid, and number of columns for the grid, calculated from the size of the window given that each node is 32px by 32px
    const numRows = Math.floor((window.innerHeight - 96) / 32); // 96px is the height of the header
    const numCols = Math.floor(window.innerWidth / 32);
    // State containing the pathFindingAlgorithm to use
    const [pathFindingAlgorithm, setPathFindingAlgorithm] = useState<[string, (grid: Grid) => boolean]>([pathFindingAlgorithmList[2], pathFindingAlgorithms[pathFindingAlgorithmList[2] as keyof typeof pathFindingAlgorithms]]);
    //State containing the mazeAlgorithm to use
    const [mazeAlgorithm, setMazeAlgorithm] = useState<[string, (grid: Grid, gap: number) => boolean]>([mazeAlgorithmList[0], mazeAlgorithms[mazeAlgorithmList[0] as keyof typeof mazeAlgorithms]]);
    // State for the grid
    const [grid, setGrid] = useState<Grid>(Utils.createGrid(numRows, numCols));
    // State containing the drawing mode
    const [drawing, setDrawing] = useState<string>(drawingStates.none);
    // State containing whether or not the user is dragging while drawing
    const [isDragging, setIsDragging] = useState<boolean>(false);
    // State containing whether or not the user is erasing walls
    const [isErasing, setIsErasing] = useState<boolean>(false);
    //State for mobile menu
    const [showMenu, setShowMenu] = useState<boolean>(window.innerWidth < 768 ? false : true);
    // State containing the gap for the maze generation
    const [gap, ] = useState<number>(2);

    // Classes for the nodes to style them, the color change should be smooth and not flicker
    const node_default = `w-8 h-8 border border-black text-white rounded-sm transition-colors duration-100 ease-in-out bg-default`;
    const node_start = `w-8 h-8 border border-black text-white rounded-sm transition-colors duration-100 ease-in-out bg-start`;
    const node_end = `w-8 h-8 border border-black text-white rounded-sm transition-colors duration-100 ease-in-out bg-end`;
    const node_wall = `w-8 h-8 border border-black text-white rounded-sm transition-colors duration-100 ease-in-out bg-wall`;
    const node_visited = `w-8 h-8 border border-black text-white rounded-sm transition-colors duration-100 ease-in-out bg-visited`;
    const node_path = `w-8 h-8 border border-black text-white rounded-sm transition-colors duration-100 ease-in-out bg-path`;

    // Custom buttons for the navbar
    const CustomButton = (props: {text: string, bgColor: string, onClick: () => void}) => {
        const drawMode = () => {
            if (props.text === "Start" && drawing === drawingStates.start) return 1;
            if (props.text === "End" && drawing === drawingStates.end) return 2;
            if (props.text === "Wall" && drawing === drawingStates.walls) return 3;
            return 0;
        }
        return (
            <Button 
                variant="outlined" 
                sx={{
                    border: `1px solid black`, 
                    backgroundColor: drawMode() ? props.bgColor : 'transparent',
                    color: drawMode() ? 'white' : 'black',
                    margin: '0 5px', 
                    '&:hover': {
                        backgroundColor: props.bgColor, 
                        color: 'white'
                    }
                }} 
                onClick={props.onClick}
            >
                {props.text}
            </Button>
        );
    }

    // Function to handle the user clicking the clear button
    const handleClear = () => {
        // Reset the grid
        setGrid(Utils.createGrid(numRows, numCols));
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
        if (!grid.start || !grid.end) return;
        if (pathFindingAlgorithm[1](grid)) {
            grid.visited.forEach((node, index) => {
                setTimeout(() => {
                    console.log('visited: ', node.row, node.col, node === grid.nodes[node.row][node.col])
                    node.isVisited = true;
                    setGrid({...grid});
                }, 20 * index);
            });
            grid.path = Utils.getPath(grid.end);
            grid.path.forEach((node, index) => {
                setTimeout(() => {
                    console.log('path: ', node.row, node.col, node === grid.nodes[node.row][node.col])
                    node.isPath = true;
                    setGrid({...grid});
                }, 20 * (index + grid.visited.length));
            });
        }
    }

    // Function to handle the user clicking the generate maze button
    const handleGeneration = () => {
        // Remove all isVisited and isPath properties from the grid
        grid.nodes.flat().forEach(node => {
            node.isVisited = false;
            node.isPath = false;
            node.isWall = false;
        });
        // Generate the maze
        if(mazeAlgorithm[1](grid, gap)) {
            // A valid maze was generated and stored in grid.walls, animate the walls
            grid.walls.forEach((node, index) => {
                setTimeout(() => {
                    node.isWall = true;
                    setGrid({...grid});
                }, 35 * index);
            });
        }
        else{
            // Retry the maze generation a maximum of 10 times, if it fails every time, alert the user that the maze generation failed and reset the grid
            let count = 0;
            while(!mazeAlgorithm[1](grid, gap) && count < 10) {
                count++;
            }
            if(count === 10) {
                alert('Maze generation failed, please try again');
                setGrid(Utils.createGrid(numRows, numCols));
            }
            else{
                // A valid maze was generated and stored in grid.walls, animate the walls
                grid.walls.forEach((node, index) => {
                    setTimeout(() => {
                        node.isWall = true;
                        setGrid({...grid});
                    }, 30 * index);
                });
            }
        }
    }

    return (
        <section className="w-full min-h-screen flex flex-col bg-gray-300">
            {/*Turn the following navbar into a mobile responsive navbar, turning into a hamburger menu on mobile*/}
            <nav className="flex flex-row justify-between items-center bg-white p-4 h-24 w-full">
                {/* Title */}
                <a href="/" className="text-2xl text-black font-bold">AI Search</a>
                {/* Controls */}
                {window.innerWidth > 750 ? 
                (<div className="flex flex-row items-center">
                    {/* Draw Tools */}
                    <div id="ButtonGroup" className="hidden md:flex flex-row items-center">
                        {/* Button to draw the start node */}
                        <CustomButton text="Start" bgColor="green" onClick={() => setDrawing(drawing === drawingStates.start ? drawingStates.none : drawingStates.start)} />
                        {/* Button to draw the end node */}
                        <CustomButton text="End" bgColor="red" onClick={() => setDrawing(drawing === drawingStates.end ? drawingStates.none : drawingStates.end)} />
                        {/* Button to draw walls */}
                        <CustomButton text="Wall" bgColor="black" onClick={() => setDrawing(drawing === drawingStates.walls ? drawingStates.none : drawingStates.walls)} />
                    </div>
                    {/* Select to choose maze generation algorithm */}
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Maze Algorithm</InputLabel>
                        <Select
                            labelId="mazeAlgorithm-select-label"
                            id="mazeAlgorithm-select"
                            value={mazeAlgorithm[0]}
                            label="Algorithm"
                            onChange={(event: SelectChangeEvent) => {
                                setMazeAlgorithm([event.target.value as string, mazeAlgorithms[event.target.value as keyof typeof mazeAlgorithms]]);
                            }}
                        >
                            {mazeAlgorithmList.map((mazeAlgorithm, index) => {
                                return <MenuItem key={index} value={mazeAlgorithm}>{mazeAlgorithm}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {/* Button to generate a maze */}
                    <CustomButton
                        onClick={handleGeneration}
                        text="Generate Maze"
                        bgColor='black'
                    />
                    {/* Select to choose path finding pathFindingAlgorithm*/}
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Path Algorithm</InputLabel>
                        <Select
                            labelId="pathFindingAlgorithm-select-label"
                            id="pathFindingAlgorithm-select"
                            value={pathFindingAlgorithm[0]}
                            label="Algorithm"
                            onChange={(event: SelectChangeEvent) => {
                                setPathFindingAlgorithm([event.target.value as string, pathFindingAlgorithms[event.target.value as keyof typeof pathFindingAlgorithms]]);
                            }}
                        >
                            {pathFindingAlgorithmList.map((pathFindingAlgorithm, index) => {
                                return <MenuItem key={index} value={pathFindingAlgorithm}>{pathFindingAlgorithm}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {/* Button to initiate the path finding pathFindingAlgorithm */}
                    <CustomButton
                        onClick={handleSearch}
                        text="Find Path"
                        bgColor='black'
                    />
                    {/* Button to clear the grid */}
                    <CustomButton
                        onClick={handleClear}
                        text="Clear"
                        bgColor='black'
                    />
                </div>) :
                (showMenu ?
                (<div className="absolute top-0 right-0 w-full h-full bg-white flex flex-col justify-center items-center">
                    {/* Close button positioned at the top right of the menu absolute */}
                    <div className="absolute top-0 right-0">
                        <CustomButton text="X" bgColor="black" onClick={() => setShowMenu(false)} />
                    </div>
                    {/* Button to draw the start node */}
                    <CustomButton text="Start" bgColor="green" onClick={() => {
                        setShowMenu(false);
                        setDrawing(drawing === drawingStates.start ? drawingStates.none : drawingStates.start)}
                    } />
                    {/* Button to draw the end node */}
                    <CustomButton text="End" bgColor="red" onClick={() => {
                        setShowMenu(false);
                        setDrawing(drawing === drawingStates.end ? drawingStates.none : drawingStates.end)}
                    } />
                    {/* Button to draw walls */}
                    <CustomButton text="Wall" bgColor="black" onClick={() => {
                        setShowMenu(false);
                        setDrawing(drawing === drawingStates.walls ? drawingStates.none : drawingStates.walls)}
                    } />
                    {/* Select to choose maze generation algorithm */}
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Maze Algorithm</InputLabel>
                        <Select
                            labelId="mazeAlgorithm-select-label"
                            id="mazeAlgorithm-select"
                            value={mazeAlgorithm[0]}
                            label="Algorithm"
                            onChange={(event: SelectChangeEvent) => {
                                setMazeAlgorithm([event.target.value as string, mazeAlgorithms[event.target.value as keyof typeof mazeAlgorithms]]);
                            }}
                        >
                            {mazeAlgorithmList.map((mazeAlgorithm, index) => {
                                return <MenuItem key={index} value={mazeAlgorithm}>{mazeAlgorithm}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {/* Button to generate a maze */}
                    <CustomButton
                        onClick={() => {
                            setShowMenu(false);
                            handleGeneration();
                        }}
                        text="Generate Maze"
                        bgColor='black'
                    />
                    {/* Select to choose path finding pathFindingAlgorithm*/}
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Path Algorithm</InputLabel>
                        <Select
                            labelId="pathFindingAlgorithm-select-label"
                            id="pathFindingAlgorithm-select"
                            value={pathFindingAlgorithm[0]}
                            label="Algorithm"
                            onChange={(event: SelectChangeEvent) => {
                                setPathFindingAlgorithm([event.target.value as string, pathFindingAlgorithms[event.target.value as keyof typeof pathFindingAlgorithms]]);
                            }}
                        >
                            {pathFindingAlgorithmList.map((pathFindingAlgorithm, index) => {
                                return <MenuItem key={index} value={pathFindingAlgorithm}>{pathFindingAlgorithm}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {/* Button to initiate the path finding pathFindingAlgorithm */}
                    <CustomButton
                        onClick={() => {
                            setShowMenu(false);
                            handleSearch();
                        }}
                        text="Find Path"
                        bgColor='black'
                    />
                    {/* Button to clear the grid */}
                    <CustomButton
                        onClick={() => {
                            setShowMenu(false);
                            handleClear();
                        }}
                        text="Clear"
                        bgColor='black'
                    />
                </div>) :
                (<div className="h-full flex justify-center items-center">
                    <GiHamburgerMenu className="text-3xl" fill='black' onClick={() => setShowMenu(true)} />
                </div>))}
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
                                        className={node.isStart ? node_start : node.isEnd ? node_end : node.isWall ? node_wall : node.isPath ? node_path : node.isVisited ? node_visited : node_default}
                                        onMouseDown={() => {
                                            if (drawing === drawingStates.start) {
                                                if(grid.start === node) {
                                                    setGrid({
                                                        ...grid,
                                                        start: null
                                                    });
                                                    node.isStart = false;
                                                    return;
                                                } else if(grid.start) {
                                                    grid.start.isStart = false;
                                                }
                                                setGrid({
                                                    ...grid,
                                                    start: node
                                                });
                                                node.isStart = true;
                                                node.isEnd = false;
                                                node.isWall = false;
                                            } else if (drawing === drawingStates.end) {
                                                if(grid.end === node) {
                                                    setGrid({
                                                        ...grid,
                                                        end: null
                                                    });
                                                    node.isEnd = false;
                                                    return;
                                                } else if(grid.end) {
                                                    grid.end.isEnd = false;
                                                }
                                                setGrid({
                                                    ...grid,
                                                    end: node
                                                });
                                                node.isStart = false;
                                                node.isEnd = true;
                                                node.isWall = false;
                                            } else if(drawing === drawingStates.walls && !node.isStart && !node.isEnd && node.isWall){
                                                setGrid({
                                                    ...grid,
                                                    walls: grid.walls.filter(wall => wall !== node)
                                                });
                                                node.isWall = false;
                                                setIsErasing(true);
                                            } else if (drawing === drawingStates.walls && !node.isStart && !node.isEnd) {
                                                setGrid({
                                                    ...grid,
                                                    walls: [...grid.walls, node]
                                                });
                                                node.isStart = false;
                                                node.isEnd = false;
                                                node.isWall = true;
                                                setIsDragging(true);
                                            }
                                        }}
                                        onMouseEnter={() => {
                                            // If the drawing state is walls, and the user is dragging, then the node should be a wall if it is not the start or end node
                                            if (drawing === drawingStates.walls && isDragging && !node.isStart && !node.isEnd) {
                                                setGrid({
                                                    ...grid,
                                                    walls: [...grid.walls, node]
                                                });
                                                node.isStart = false;
                                                node.isEnd = false;
                                                node.isWall = true;
                                            } 
                                            // Else if the drawing state is walls, and the user is erasing, then the node should not be a wall if it is not the start or end node
                                            else if (drawing === drawingStates.walls && isErasing && !node.isStart && !node.isEnd && node.isWall) {
                                                setGrid({
                                                    ...grid,
                                                    walls: grid.walls.filter(wall => wall !== node)
                                                });
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

import {Node, Grid} from '../types';
import {getNeighbors, createGrid} from '../utils';
import { useState, useEffect, useRef } from 'react';
const Search = () => {
    const colors = {
        start: "#4ee66c",
        end: "#e64e4e",
        wall: "#363029",
        visited: "#4e4ee6",
        path: "#e6e64e",
        default: "#ffffff"
    }
    const gridRef = useRef<HTMLDivElement>(null);
    const [grid, setGrid] = useState<Grid>(createGrid(15, 15));
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


    useEffect(() => {
        if (isClearing) {
            setGrid(createGrid(15, 15));
            setIsClearing(false);
        }
    }, [isClearing]);

    useEffect(() => {
        if (isSearching) { 
            // TODO: Implement search algorithm
            setIsSearching(false);
        }
    }, [isSearching]);

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
                <button className='bg-[#1e243d] text-white text-lg font-bold py-2 px-4 rounded hover:text-blue-300 transition-colors duration-300'
                        onClick={() => setIsSearching(true)}>
                    Search
                </button>
            </div>
            <div ref={gridRef} className='grid grid-cols-50 grid-rows-25 gap-1 bg-black p-2 rounded-xl'>
                {grid.nodes.map((row,rindex) => (
                    <div key={rindex} className='flex flex-row gap-1'>
                        {row.map((node, cindex) => (
                            <button key={cindex}
                                    disabled={!drawing}
                                    className='w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 enabled:hover:scale-[0.95] transition-all duration-300 ease-in-out rounded-sm' 
                                    style={{backgroundColor: node.color}}
                                    onMouseDown={() => {
                                        if (isDrawingStart) {
                                            //Clear previous start node if it exists, without creating a new grid
                                            if (startNode) {
                                                grid.nodes[startNode.row][startNode.col].color = colors.default;
                                                grid.nodes[startNode.row][startNode.col].isStart = false;
                                            }
                                            node.color = colors.start;
                                            node.isStart = true;
                                            setStartNode(node);
                                            setIsDrawingStart(false);
                                            setIsDrawingWalls(false);
                                        } else if (isDrawingEnd) {
                                            //Clear previous end node if it exists, without creating a new grid
                                            if (endNode) {
                                                grid.nodes[endNode.row][endNode.col].color = colors.default;
                                                grid.nodes[endNode.row][endNode.col].isEnd = false;
                                            }
                                            node.color = colors.end;
                                            node.isEnd = true;
                                            setEndNode(node);
                                            setIsDrawingEnd(false);
                                            setIsDrawingWalls(false);
                                        } else if (isDrawingWalls) {
                                            //If the node is already a wall, remove it from the walls array
                                            if (node.isWall) {
                                                setWalls(walls.filter(wall => wall !== node));
                                                node.isWall = false;
                                                node.color = colors.default;
                                            } else {
                                                node.color = colors.wall;
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
                                                node.color = colors.default;
                                            } else {
                                                node.color = colors.wall;
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

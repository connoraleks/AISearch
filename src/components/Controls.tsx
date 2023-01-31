import Slider from '@mui/material/Slider';
export const Controls = ({size, setSize}: {size: number, setSize: (size: number) => void}) : JSX.Element => {
    return (
        <div className='max-w-[300px] flex flex-col items-center mx-auto mb-8 w-full'>
            <Slider
                value={size}
                onChange={(e, value) => setSize(value as number)}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                min={20}
                max={100}
            />
        </div>
    )
}


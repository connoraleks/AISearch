import { useState, useEffect, useRef } from 'react'
import { Grid } from './components/Grid'
import { Controls } from './components/Controls'
import { MenuComponent } from './components/MenuComponent'
import { DrawMode } from './utils/types'
import { ToggleButtonGroup, ToggleButton, Button } from '@mui/material'

function App() {
  const [size, setSize] = useState(50)
  const [drawMode, setDrawMode] = useState<DrawMode>('default')
  const [findPath, setFindPath] = useState(false)
  const constraintRef = useRef<HTMLDivElement>(null)

  const menuContent = [
    <Controls size={size} setSize={setSize} />,
    <ToggleButtonGroup
      value={drawMode}
      exclusive
      onChange={(e, value) => {
        setDrawMode(value ? value : 'default')
      }}
    >
      <ToggleButton value='start'>Start</ToggleButton>
      <ToggleButton value='end'>End</ToggleButton>
      <ToggleButton value='wall'>Wall</ToggleButton>
    </ToggleButtonGroup>,
    <Button variant='outlined' color='primary' onClick={() => setFindPath(true)}>
      Find Path
    </Button>,

  ]

  return (
    <div ref={constraintRef} className='w-full h-full flex flex-col justify-center items-center bg-gray-700 p-[10%]'>
      <MenuComponent constraintRef={constraintRef} content={menuContent} />
      <Grid size={size} drawMode={drawMode} findPath={findPath} setFindPath={setFindPath} />
    </div>
  )
}

export default App

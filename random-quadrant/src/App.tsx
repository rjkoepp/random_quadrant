import { useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'

type QuadrantColor = 'red' | 'blue' | 'orange' | 'green';

function App() {
  const [colors, setColors] = useState<QuadrantColor[]>(['red', 'blue', 'orange', 'green']);

  const randomizeColors = () => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    setColors(shuffled);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <div data-testid="quadrant-grid" className="grid grid-cols-2 gap-4 mb-4">
          {colors.map((color, index) => (
            <div
              key={index}
              data-testid="color-quadrant"
              className="aspect-square rounded-lg"
              style={{
                backgroundColor: color,
                minHeight: '200px'
              }}
            />
          ))}
        </div>
        <Button 
          onClick={randomizeColors}
          className="w-full"
        >
          Randomize Colors
        </Button>
      </div>
    </div>
  )
}

export default App

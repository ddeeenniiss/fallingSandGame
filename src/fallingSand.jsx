// fallingSand.js
import React, { useRef, useEffect, useState } from 'react';

//Startwerte
const width = 600;
const height = 600;
const cellSize = 8;
const cols = width / cellSize;
const rows = height / cellSize;

export default function SandCanvas() {
  const canvasRef = useRef();
  const gridRef = useRef(createGrid());
  const [spacePressed, setSpacePressed] = useState(false);
 
  //create 2D- Array with filled 0 values
  function createGrid() {
      //Array mit cols Elementen wird angelegt und mit Nullen gefüllt
    return Array.from({ length: cols }, () => Array(rows).fill(0));
  }

  function drawCell(ctx, x, y, value) {
    ctx.fillStyle = value > 0 ? `hsl(${value}, 100%, 50%)` : 'black';
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }

  function updateGrid(oldGrid) {
    const newGrid = createGrid();
    for (let x = 0; x < cols; x++) {
      for (let y = rows - 1; y >= 0; y--) {
        const value = oldGrid[x][y];
        if (value > 0) {
          if (y + 1 < rows && oldGrid[x][y + 1] === 0) {
            newGrid[x][y + 1] = value;
          } else if (x > 0 && y + 1 < rows && oldGrid[x - 1][y + 1] === 0) {
            newGrid[x - 1][y + 1] = value;
          } else if (x < cols - 1 && y + 1 < rows && oldGrid[x + 1][y + 1] === 0) {
            newGrid[x + 1][y + 1] = value;
          } else {
            newGrid[x][y] = value;
          }
        }
      }
    }
    return newGrid;
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let animationFrameId;

    const render = () => {
      const newGrid = updateGrid(gridRef.current);
      gridRef.current = newGrid;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          drawCell(ctx, x, y, newGrid[x][y]);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Spacebar-Events
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!spacePressed) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x >= 0 && x < cols && y >= 0 && y < rows && gridRef.current[x][y] === 0) {
      gridRef.current[x][y] = (Date.now() / 10) % 360;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      style={{ border: '1px solid white', backgroundColor: 'black', cursor: 'crosshair' }}
    />
  );
}

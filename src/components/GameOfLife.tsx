import React, { useState, useCallback, useRef } from 'react';
import { Play, Pause, RefreshCw, Trash2 } from 'lucide-react';

const numRows = 25;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  return Array.from({ length: numRows }).map(() => Array.from({ length: numCols }).fill(0));
};

export default function GameOfLife() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      const newGrid = g.map(row => [...row]);
      
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ] as number;
            }
          });

          if (g[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
            newGrid[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }
      return newGrid;
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
          <span>{running ? 'Tạm dừng' : 'Bắt đầu'}</span>
        </button>
        
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
            }
            setGrid(rows);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          <span>Ngẫu nhiên</span>
        </button>
        
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
            setRunning(false);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 border border-gray-200 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
        >
          <Trash2 size={18} />
          <span>Xóa</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto max-w-full">
        <div 
          className="grid gap-[1px] bg-gray-200 border border-gray-200"
          style={{
            gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = grid.map(row => [...row]);
                  newGrid[i][k] = grid[i][k] ? 0 : 1;
                  setGrid(newGrid);
                }}
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer transition-colors duration-300 ${
                  grid[i][k] ? 'bg-blue-600' : 'bg-white hover:bg-gray-100'
                }`}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="text-gray-500 text-sm max-w-lg text-center leading-relaxed">
        <strong>Conway's Game of Life:</strong> Một mô phỏng toán học về sự phát triển của quần thể. Bấm vào các ô để tạo mẫu ban đầu hoặc chọn "Ngẫu nhiên". Nhấn "Bắt đầu" để xem quy luật sinh tồn.
      </div>
    </div>
  );
}

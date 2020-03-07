import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from "react";
import "./App.css";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [cell, setCell] = useState(
    new Array(100).fill(null).map(() => new Array(100).fill(0))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState(1000);
  const direction = useMemo(() => {
    return [
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0]
    ];
  }, []);
  const handleChangeCellState = useCallback(
    (i, j) => {
      if (isEditing) {
        let tempArr = [...cell];

        tempArr[i][j] = tempArr[i][j] ? 0 : 1;
        setCell(tempArr);
      }
    },
    [cell, isEditing]
  );
  const handleRandomCellState = useCallback(() => {
    let tempArr = new Array(100).fill(null).map(() => new Array(100).fill(0));
    for (let i = 0; i < 100; i++) {
      let x = (Math.random() * 100) | 0;
      let y = (Math.random() * 100) | 0;

      tempArr[x][y] = tempArr[x][y] ? 0 : 1;
    }
    setCell(tempArr);
  }, []);
  const handleResetCellState = useCallback(() => {
    setIsRunning(false);
    setCell(new Array(100).fill(null).map(() => new Array(100).fill(0)));
  }, []);
  const begin = useCallback(() => {
    let tempArr = [...cell];
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        let around = 0;
        direction.forEach(([x, y]) => {
          if (0 <= i + x && i + x < 100 && 0 <= j + y && j + y < 100)
            if (tempArr[i + x][j + y] === 1) around++;
        });
        switch (around) {
          case 3:
            tempArr[i][j] = 1;
            break;
          case 2:
            break;
          default:
            tempArr[i][j] = 0;
            break;
        }
      }
    }
    setCell(tempArr);
  }, [cell, direction]);

  useInterval(
    () => {
      begin();
    },
    isRunning ? delay : null
  );
  return (
    <div className="App">
      <section className="container">
        {cell.map((item, i) =>
          item.map((it, j) => (
            <div
              onClick={() => {
                handleChangeCellState(i, j);
              }}
              style={{
                backgroundColor: it === 0 ? `#fff` : `#000`,
                border: ` solid #000`,
                width: 10,
                height: 10,
                borderWidth: isEditing ? `0.5px` : `0`
              }}
              key={`${i}-${j}`}
            ></div>
          ))
        )}
      </section>
      <section className="control-panel">
        <button onClick={() => setIsEditing(e => !e)}>手动设置点位状态</button>
        <button onClick={() => handleRandomCellState()}>随机点位状态</button>
        <button onClick={() => setIsRunning(true)}>开始</button>
        <div>
          速度：
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={delay}
            onChange={e => setDelay(e.target.value)}
          />
          {delay}ms
        </div>

        <button onClick={() => setIsRunning(false)}>暂停</button>
        <button onClick={() => handleResetCellState()}>重置</button>
      </section>
    </div>
  );
}

export default App;

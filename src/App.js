import React, {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useEffect
} from "react";
import { useInterval, createTwoDimensionalArray } from "./utils";
import { AppContext, reducer } from "./reducer";
import ControlPanel from "./control-panel";
import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {
    isEditing: false,
    isRunning: false,
    delay: 1000,
    cellSize: [50, 50]
  });

  const [cell, setCell] = useState(
    createTwoDimensionalArray(state.cellSize[0], state.cellSize[1])
  );

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

  useEffect(() => {
    setCell(createTwoDimensionalArray(state.cellSize[0], state.cellSize[1]));
  }, [state.cellSize]);

  useInterval(
    () => {
      begin();
    },
    state.isRunning ? state.delay : null
  );
  const handleChangeCellState = useCallback(
    (i, j) => {
      if (state.isEditing) {
        let tempArr = [...cell];
        tempArr[i][j] = tempArr[i][j] ? 0 : 1;
        setCell(tempArr);
      }
    },
    [cell, state.isEditing]
  );

  const begin = useCallback(() => {
    let tempArr = [...cell];
    for (let i = 0; i < state.cellSize[0]; i++) {
      for (let j = 0; j < state.cellSize[1]; j++) {
        let around = 0;
        direction.forEach(([x, y]) => {
          if (
            0 <= i + x &&
            i + x < state.cellSize[0] &&
            0 <= j + y &&
            j + y < state.cellSize[1]
          )
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
  }, [cell, direction, state.cellSize]);

  const { isEditing } = state;

  return (
    <AppContext.Provider value={state}>
      <div className="App">
        <section
          className="container"
          style={{
            gridTemplateColumns: `repeat(${state.cellSize[1]}, 10px)`,
            gridTemplateRows: `repeat(${state.cellSize[0]}, 10px)`,
            width: state.cellSize[1] * 10 + 2,
            height: state.cellSize[0] * 10 + 2
          }}
        >
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
        <ControlPanel {...{ dispatch, setCell }} />
      </div>
    </AppContext.Provider>
  );
}

export default App;

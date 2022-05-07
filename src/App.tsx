import { useEffect, useRef, useState } from "react";
import "./App.css";
import styled from "styled-components";
import renderGrid from "./hooks/renderGrid";
import Cell from "./components/Cell";
import randomColorForCell from "./hooks/randomColorForCell";
import neighborScore from "./hooks/neighborScore";

interface AppState {
  days?: number;
  chanceOfLive?: number;
  speed?: number;
  sideLength?: number;
  world?: string[];
  timer?: NodeJS.Timeout | number;
}

const App: React.FC<AppState> = () => {
  const [days, setDays] = useState(0);
  const [chanceOfLive, setChanceOfLive] = useState(50);
  const [speed, setSpeed] = useState(700);
  const [sideLength, setSideLength] = useState(5);
  const [world, setWorld] = useState(renderGrid(sideLength, chanceOfLive));
  const [colorCell, setColorCell] = useState(randomColorForCell());

  const timerInteval = useRef<NodeJS.Timeout | null | undefined>(null);
  const timerTimeout = useRef<NodeJS.Timeout | null | undefined>(null);

  useEffect(() => {
    setWorld(renderGrid(sideLength, chanceOfLive));
  }, [sideLength, chanceOfLive]);

  const handleStart = () => {
    if (timerInteval.current) return;
    timerInteval.current = setInterval(checkGame, speed);
  };

  useEffect(() => {
    if (timerInteval) {
      handleStop();
      timerTimeout.current = setTimeout(() => {
        handleStart();
      }, 0);
    }

    return () => {
      if (timerTimeout.current) clearTimeout(timerTimeout.current);
    };
  }, [timerInteval.current, timerInteval]);

  const handleStop = () => {
    if (timerInteval.current && timerTimeout.current) {
      console.log("run stop");
      clearInterval(timerInteval.current);
      clearTimeout(timerTimeout.current);
      timerInteval.current = null;
      timerTimeout.current = null;
    } else return;
  };

  const checkGame = () => {
    const newWorld = world.map((row: number[], rowIndex: number) => {
      let newRow = row.map((cell, cellIndex) => {
        const score = neighborScore(world, rowIndex, cellIndex);
        let status = 0;

        if (cell === 1 && (score === 2 || score === 3)) {
          status = 1;
        }

        if (cell === 0 && score === 3) {
          status = 1;
        }
        return status;
      });

      return newRow;
    });

    if (JSON.stringify(newWorld) === JSON.stringify(world)) {
      handleStop();
    } else {
      setWorld(newWorld);
      setDays((pre) => pre + 1);
    }
  };

  return (
    <div className="App mb-5">
      <div className="container">
        <div className="row mt-4">
          <div className="col col-11">
            <h1>Game of life</h1>
            <TableGame>
              <tbody>
                {world?.map((row: [], rowIndex: number) => {
                  return (
                    <tr key={rowIndex}>
                      {row?.map((cellValue: number, cellIndex: number) => {
                        return (
                          <Cell
                            key={cellIndex}
                            cellValue={cellValue}
                            cellIndex={cellIndex}
                            rowIndex={rowIndex}
                            colorCell={colorCell}
                            world={world}
                            setWorld={setWorld}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </TableGame>
          </div>

          {/* Control game */}
          <div className="col col-1">
            <Control>
              <div className="day-life">
                Days: <strong>{days}</strong>
              </div>

              {/* Change of life */}
              <ControlElement className="chance-of-live">
                <label>
                  Chance of live(%): <strong>{chanceOfLive}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={chanceOfLive}
                  onChange={(e) =>
                    setChanceOfLive(Number.parseInt(e.target.value))
                  }
                />
              </ControlElement>
              {/* Speed change */}
              <ControlElement className="speed-change">
                <label>
                  Speed (ms): <strong>{speed}</strong>
                </label>
                <input
                  type="range"
                  min={10}
                  max={3000}
                  step={100}
                  value={speed}
                  onChange={(e) => setSpeed(Number.parseInt(e.target.value))}
                />
              </ControlElement>

              <ControlElement className="side-length">
                <label>
                  Size: <strong>{sideLength}</strong>
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={sideLength}
                  onChange={(e) =>
                    setSideLength(Number.parseInt(e.target.value))
                  }
                />
              </ControlElement>

              <ControlButtonGroup>
                <ControlButton onClick={handleStart}>
                  <i className="fa-solid fa-play"></i> Start
                </ControlButton>
                <ControlButton onClick={handleStop}>
                  <i className="fa-solid fa-stop"></i> Stop
                </ControlButton>
                <ControlButton>
                  <i className="fa-solid fa-rotate"></i> Reset
                </ControlButton>
              </ControlButtonGroup>
            </Control>
          </div>
        </div>
      </div>
    </div>
  );
};

const Control = styled.div`
  text-align: left;
  margin-bottom: 100px;
`;

const ControlElement = styled.div`
  margin-top: 10px;
`;

const TableGame = styled.table`
  display: flex;
  justify-content: center;
`;

const ControlButtonGroup = styled.div``;
const ControlButton = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  padding: 2px 20px;
  min-width: 100px;
`;

export default App;

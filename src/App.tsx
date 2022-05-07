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
  isRuningGame?: boolean;
}

const initGameSetting = {
  days: 0,
  chanceOfLive: 0,
  speed: 500,
  sideLength: 10,
};

const App: React.FC<AppState> = () => {
  const [days, setDays] = useState(initGameSetting.days);
  const [chanceOfLive, setChanceOfLive] = useState(
    initGameSetting.chanceOfLive
  );
  const [speed, setSpeed] = useState(initGameSetting.speed);
  const [sideLength, setSideLength] = useState(initGameSetting.sideLength);
  const [world, setWorld] = useState(renderGrid(sideLength, chanceOfLive));
  const [colorCell, setColorCell] = useState(randomColorForCell());

  const [isRuningGame, setIsRunningGame] = useState(false);

  const timerInteval = useRef<NodeJS.Timeout | null | undefined>(undefined);

  useEffect(() => {
    setWorld(renderGrid(sideLength, chanceOfLive));
  }, [sideLength, chanceOfLive, speed]);

  const handleStart = () => {
    if (timerInteval.current) return;
    setIsRunningGame(!isRuningGame);
  };

  const handleStop = () => {
    if (timerInteval.current) {
      clearInterval(timerInteval.current);

      timerInteval.current = undefined;
    } else return;
  };

  useEffect(() => {
    timerInteval.current = setInterval(checkGame, speed);
    // eslint-disable-next-line
  }, [isRuningGame]);

  useEffect(() => {
    if (timerInteval.current) {
      handleStop();
      setTimeout(() => {
        handleStart();
      }, 0);
    }
    // eslint-disable-next-line
  }, [timerInteval.current]);

  const checkGame = () => {
    const newWorld = world.map((row: number[], rowIndex: number) => {
      let newRow = row.map((cell, cellIndex) => {
        const score = neighborScore(world, rowIndex, cellIndex);
        let status = 0;
        if (cell === 1 && (score === 2 || score === 3)) {
          status = 1;
        } else if (cell === 0 && score === 3) {
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

  function handleResetGame() {
    setDays(0);
    setSpeed(0);
    setSideLength(10);
    setChanceOfLive(0);

    setWorld(renderGrid(sideLength, chanceOfLive));
    setColorCell(randomColorForCell());

    setIsRunningGame(false);
  }

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

                <ControlButton onClick={handleResetGame}>
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

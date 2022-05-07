import { useEffect, useRef, useState } from "react";
import "./App.css";
import styled from "styled-components";
import renderGrid from "./hooks/renderGrid";
import Cell from "./components/Cell";
import randomColorForCell from "./hooks/randomColorForCell";
import neighborScore from "./hooks/neighborScore";

import imageBg from "./assets/img/bg.jpg";

interface AppState {
  days?: number;
  chanceOfLive?: number;
  speed?: number;
  sideLength?: number;
  world?: string[];
  timer?: NodeJS.Timeout | number;
  isRuningGame?: boolean;
  cellSize?: number | undefined;
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
  const tableRef = useRef<HTMLTableElement>(null);
  const [cellSize, setCellSizer] = useState(20);

  useEffect(() => {
    if (chanceOfLive === 0) {
      const oldWorl = [...world];

      const tempWorld = renderGrid(sideLength, 0);

      let newWorld = tempWorld.map((row: number[], rowIndex: number) => {
        let oldRow = oldWorl[rowIndex];

        row.map((col, colIndex) => {
          let oldCol = oldRow ? oldRow[colIndex] : 0;

          if (col !== oldCol && oldCol) {
            return (tempWorld[rowIndex][colIndex] = oldCol);
          } else return col;
        });
        return row;
      });

      setWorld(newWorld);
    } else {
      setWorld(renderGrid(sideLength, chanceOfLive));
    }
  }, [sideLength, chanceOfLive]);

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

  useEffect(() => {
    const tableBounding = tableRef.current?.getBoundingClientRect();
    if (tableBounding) {
      let tableHeight = window.innerHeight - 50 - tableBounding.top;
      setCellSizer(tableHeight / sideLength);
    }
  }, [sideLength]);

  return (
    <div className="App mb-5">
      <Image src={imageBg}></Image>

      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col col-10">
            <h1>Game of life</h1>
            <TableGame>
              <TableBody ref={tableRef}>
                {world?.map((row: [], rowIndex: number) => {
                  return (
                    <tr key={rowIndex}>
                      {row?.map((cellValue: number, cellIndex: number) => {
                        return (
                          <Cell
                            cellSize={cellSize}
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
              </TableBody>
            </TableGame>
          </div>

          {/* Control game */}
          <div className="col col-2 pe-5">
            <h3 className="text-start mt-5">Game setting</h3>
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
                  max={1000}
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

              <ControlButtonGroup className="d-flex flex-column mt-4">
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

const Image = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 100vh;

  object-fit: cover;
  onject-position: center;

  filter: blur(5px);
`;

const Control = styled.div`
  text-align: left;
  margin-bottom: 100px;
`;

const ControlElement = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const TableGame = styled.table`
  display: flex;
  justify-content: center;
`;

const TableBody = styled.tbody`
  background: rgba(0,0,0,0.3);
  box-shadow: 1px 1px 10px white;
  height: 100%
}`;

const ControlButtonGroup = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 10px;
`;

const ControlButton = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  padding: 2px 20px;
  min-wi
  dth: 100px;
`;

export default App;

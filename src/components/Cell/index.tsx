import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface CellProps {
  cellValue: number;
  rowIndex: number;
  cellIndex: number;
  colorCell: string;
  world: number[][];
  setWorld: (world: number[][]) => void;
}

const Cell: React.FC<CellProps> = ({
  cellIndex,
  cellValue,
  rowIndex,
  colorCell,
  world,
  setWorld,
}) => {
  function handleToggleCell(value: number) {
    let tempWorld: number[][] = [...world];
    tempWorld[rowIndex][cellIndex] = value === 1 ? 0 : 1;
    setWorld(tempWorld);
  }

  return (
    <CellTd
      colorCell={cellValue === 1 ? colorCell : ""}
      onClick={() => handleToggleCell(cellValue)}
    ></CellTd>
  );
};

export default Cell;

const CellTd = styled.td`
  border: 1px solid #888;
  width: 20px;
  height: 20px;

  background-color: ${(props: any) => props.colorCell};
`;

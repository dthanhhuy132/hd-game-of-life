const neighborScore = (world:number[][], rowIndex: number, cellIndex: number):number => {
  const rightNeighbor = [rowIndex, cellIndex + 1];
    const leftNeighbor = [rowIndex, cellIndex - 1];
    const topNeighbor = [rowIndex - 1, cellIndex];
    const topLeftNeighbor = [rowIndex - 1, cellIndex - 1];
    const topRightNeighbor = [rowIndex - 1, cellIndex + 1];
    const bottomNeighbor = [rowIndex + 1, cellIndex];
    const bottomLeftNeighbor = [rowIndex + 1, cellIndex - 1];
    const bottomRightNeighbor = [rowIndex + 1, cellIndex + 1];
  
  const positions = [
    rightNeighbor,
    leftNeighbor,
    topNeighbor,
    topLeftNeighbor,
    topRightNeighbor,
    bottomNeighbor,
    bottomLeftNeighbor,
    bottomRightNeighbor,
  ];

  const score = positions
  .map(position => {
    let count = 0;
    const rowInWorld = world[position[0]]

    if(rowInWorld) {
      count = rowInWorld[position[1]] || 0
    }

    return count
  }).reduce((acc, cur) => acc + cur, 0);

  return score;
};

export default neighborScore;
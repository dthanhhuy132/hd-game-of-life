import chunk from 'lodash.chunk'

const renderGrid = (length: number, chanceOfLife:number) => {
  const world = [];
  for(let i = 0; i < length**2; i++) {
    const randomLive = Number(Math.random() < chanceOfLife/100)
    world.push(randomLive)
  }


  return chunk(world, length)
}

export default renderGrid
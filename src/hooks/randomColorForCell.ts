const colorArr = [
  '#e6e6fa',
  '#d8bfd8',
  '#dda0dd',
  '#ee82ee',
  '#da70d6',
  '#ff00ff',
  '#ff00ff',
  '#ba55d3',
  '#9370db',
  '#8a2be2',
  '#9400d3',
  '#9932cc',
  '#8b008b',
  '#800080',
  '#4b0082',
];

const randomColorForCell = () => {
  return colorArr[Math.floor(Math.random()*colorArr.length)]
}

export default randomColorForCell
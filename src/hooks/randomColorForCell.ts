const colorArr = [
  'green',
  'red',
  'yellow',
  'cyan',
  'white',
  "orange",
  "pink"
  
];

const randomColorForCell = () => {
  return colorArr[Math.floor(Math.random()*colorArr.length)]
}

export default randomColorForCell
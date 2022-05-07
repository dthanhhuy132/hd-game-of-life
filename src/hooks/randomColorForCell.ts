const colorArr = [
  'green',
  'red',
  'blue',
  'cyan',
  'purple',
  "orange",
  "pink"
  
];

const randomColorForCell = () => {
  return colorArr[Math.floor(Math.random()*colorArr.length)]
}

export default randomColorForCell
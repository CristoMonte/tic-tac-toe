export default function isWinner (squares) {
  if (squares.length < 3) {
    return false
  }
  const winnerResult = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
  ]
  for(let item of winnerResult) {
    if (
      squares.includes(item[0]) &&
      squares.includes(item[1]) &&
      squares.includes(item[2])
      ) {
      return item
    }
  }
  return false
}

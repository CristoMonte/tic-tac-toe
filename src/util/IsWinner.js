//   const winnerResult = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [2, 4, 6],
//     [0, 4, 8]
//   ]
export default function isWinner (list) {
  for (let i = 0; i < 9; i+=3) {
    if (list[i] && list[i] === list[i+1] && list[i] === list[i+2]) {
      return [i, i+1, i+2]
    }
  }
  for (let i = 0; i < 3; i++) {
    if (list[i] && list[i] === list[i+3] && list[i] === list[i+6]) {
      return [i, i+3, i+6]
    }
  }
  for (let i = 0, b = 4; i < 3; i += 2, b -= 2) {
    if (list[i] && list[i] === list[i+b] && list[i] === list[i+b+b]) {
      return [i, i+b, i+b+b]
    }
  }
  return false
}

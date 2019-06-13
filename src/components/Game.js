import React from 'react'
import Board from './Board'

class Game extends React.Component {
  constructor () {
    super()

    this.state = {
      boardRow: 3,
      boardCloumn: 3,
      squareList: [],
      chessPiecesObj: {
        '': 'X',
        'X': 'O',
        'O': 'X'
      },
      currentPlayer: '',
      nextPlayer: '',
      history: [],
      isNext: true,
      steps: [],
      wantJumpStep: '',
      winner: '',
      winnerCheers: [],
      isAsc: true,
      asc_index: -1,
      dsc_index: -1
    };
    this.state.squareList = Array(this.state.boardRow * this.state.boardCloumn).fill('')
    this.restartGame = this.restartGame.bind(this)
  }
  createGameProgress () {
    const progressList = this.state.steps.map((stepsItems, index, arr) => {
      return (
        <li
          key={index}
          className="game-history-item"
          onClick={this.jumpTo.bind(this, stepsItems, index)}
          style={{color: (this.state.isAsc ? this.state.asc_index : this.state.dsc_index) === index ? 'blue' : 'black'}}
          >
          {this.state.isAsc ? (index + 1) : (arr.length - index)}、move ({Math.floor(stepsItems / 3) + 1}, {(stepsItems % 3) + 1})
        </li>
      )
    })
    return progressList
  }

  async handleSquareClick(i) {
    if (this.state.winner) {
      return
    }
  
    if (this.assertNext(this.state.squareList[i])) {
      return
    }

    // this.defineCurrentChess()
    // 决定棋子是白棋还是黑棋
    // 异步更新
    await this.assertNextChess()

    // 将棋子填充到棋盘对应位置
    this.moveChess(i)

    // 记录棋盘步骤
    this.recordHistory ()

    // 记录当前步骤的index
    this.recordSteps(i)

    // assert winner
    this.assertWinner()

    console.log(this.state.history, 'history')
  }

  assertNext (i) {
    return !!i
  }

  recordSteps (i) {
    let end = ''
    if (this.state.wantJumpStep) {
      // slice [ )
      end = this.state.wantJumpStep + 1
      this.setState({
        wantJumpStep: ''
      })
    }
    const tempSteps = this.state.steps.slice(0, end || this.state.steps.length)
    this.state.isAsc ? tempSteps.push(i) : tempSteps.unshift(i)
    this.setState({
      steps: tempSteps
    })
  }

  async assertNextChess () {
    await this.setState((state) => {
      return {
        nextPlayer: state.nextPlayer === 'O' ? 'X': 'O'
      }
    })
  }

  moveChess (i) {
    let tempSquareList = this.state.squareList.slice(0)
    tempSquareList[i] = this.state.chessPiecesObj[this.state.nextPlayer]
    this.setState(state => {
      return {
        squareList: tempSquareList
      }
    })
  }

  recordHistory () {
    let tempGameHistory = this.state.squareList.slice(0)
    this.setState({
      history: tempGameHistory
    })
  }

  jumpTo (step, index) {
    console.log(index, 'index')
    console.log(this.state.steps, 'step')
    let tempList = this.state.history.slice(0)
    if (this.state.isAsc) {
      for(let i = index + 1, len = this.state.steps.length; i < len; i++) {
        tempList[this.state.steps[i]] = ''
      }
    } else {
      // 降序的时候，steps已经被reverse了
      for(let i = 0; i < index; i++) {
        tempList[this.state.steps[i]] = ''
      }
    }

    // 记录升序情况下当前要去往哪一个历史记录
    if (this.state.isAsc) {
      this.setState({
        asc_index: index
      })
      this.setState({
        dsc_index: this.state.steps.length - index - 1
      })
    } else {
      // 记录降序情况下当前要去往哪一个历史记录
      this.setState({
        dsc_index: index
      })
      this.setState({
        asc_index: this.state.steps.length - index - 1
      })
    }


    this.setState({
      squareList: tempList
    })

    this.setState({
      wantJumpStep: index
    })
  }

  assertWinner () {
    if (this.state.steps.length < 5) {
      return false
    }

    let squares = []
    const currentPlayer = this.state.chessPiecesObj[this.state.nextPlayer]
    this.state.squareList.forEach((item, index) => {
      if (item === currentPlayer) {
        squares.push(index)
      }
    })
    if (isWinner(squares)) {
      this.assertNext(false)
      this.setState({
        winner: currentPlayer
      })
      this.setState({
        winnerCheers: isWinner(squares)
      })
    }
  }

  componentDidUpdate () {
    if ((this.state.steps.length === this.state.boardRow * this.state.boardCloumn) && !this.state.winner) {
      alert('平局')
    }
  }

  restartGame () {
    this.setState({
      squareList: [],
      history: [],
      currentPlayer: '',
      nextPlayer: '',
      isNext: true,
      steps: [],
      wantJumpStep: '',
      winner: '',
      winnerCheers: [],
      isAsc: true,
      asc_index: -1,
      dsc_index: -1
    })
  }

  async handleSort () {
    await this.setState(state => {
      return {
        isAsc: !state.isAsc
      }
    })
    const tempArray = this.state.steps.slice(0)
    tempArray.reverse()
    this.setState({
      steps: tempArray
    })
  }

  render () {
    let sortBtnEle = ''
    if (this.state.steps.length) {
      sortBtnEle = (<div className="history-btn" onClick={this.handleSort.bind(this)}>{this.state.isAsc ? '升序' : '降序'}</div>)
    }
    return (
      <div className="">
        <button className="start" onClick={this.restartGame}>restart game</button>
        <div className="board-wrapper">
          <Board
          squareList={this.state.squareList}
          boardRow={this.state.boardRow}
          boardCloumn={this.state.boardCloumn}
          winnerCheers={this.state.winnerCheers}
          squareItemClick={this.handleSquareClick.bind(this)}/>
        </div>
        <div className="game-info">
          <div>{this.state.winner ? 'Winner' + this.state.winner : 'next Player: ' + (this.state.nextPlayer || 'X')}</div>
          <ul className="history-ul">
            {sortBtnEle}
            {this.createGameProgress()}
          </ul>
        </div>
      </div>
    )
  }
}

function isWinner (squares) {
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

export default Game

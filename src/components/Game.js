import React from 'react'
import Board from './Board'
import HistoryFunctional from './HistoryFunctional'
import util from '../util'

// let id = 1;
class Game extends React.Component {
  constructor () {
    super()

    this.state = {
      boardRow: 3,
      boardCloumn: 3,
      winner: '',
      gameOver: false,
      winnerCheers: [],
      isAsc: true,
      history: [],
      stepNumber: 0,
      xIsNext: true
    };
    // 初始化构造棋盘
    this.state.history = [{ squares: Array(this.state.boardRow * this.state.boardCloumn).fill('') }]
    // 记录steps
    this.state.stepNumber = 0
  }

  render () {
    // 使用解构，可以简化模版
    const { stepNumber, history } = this.state
    const current = history[stepNumber]

    return (
      <div className="">
        <button className="start" onClick={this.restartGame}>restart game</button>
        <div className="board-wrapper">
          <Board
            squareList={current.squares}
            boardRow={this.state.boardRow}
            boardCloumn={this.state.boardCloumn}
            winnerCheers={this.state.winnerCheers}
            squareItemClick={this.handleSquareClick}
          />
        </div>
        <div className="game-info">
          <div>{this.state.winner ? 'Winner: ' + this.state.winner : 'next Player: ' + (this.state.xIsNext ? 'X' : 'O')}</div>
          <HistoryFunctional
            history={this.state.history}
            stepNumber={this.state.stepNumber}
            isAsc={this.state.isAsc}
            jumpTo={this.jumpTo}
            handleSort={this.handleSort}
          />
        </div>
      </div>
    )
  }

  handleSquareClick = async i => {
    // 如果游戏已经结果，玩家不能再落子操作了
    if (this.state.gameOver) {
      return
    }
    this.updateHistory(i)
  }

  updateHistory = (i) => {
    // 使用浅拷贝将上一步的记录拷贝下来
    let currentSquares = this.state.history[this.state.stepNumber].squares.slice()
    // 判断当前的角色
    const currentPlayer = this.state.xIsNext ? 'X' : 'O'
    // 只有当玩家落子的地方之前是空白的才需要去更新和判断
    if (!currentSquares[i]) {
      // 更新记录
      currentSquares[i] = currentPlayer
      // 判断是否有赢家
      this.checkWinner(currentSquares, currentPlayer)
      // 如果是从某条历史记录重新开始,则拷贝history， 之后再concat新纪录
      const tempHistory = this.state.history[this.state.stepNumber + 1] ?
        this.state.history.slice(0, this.state.stepNumber + 1) :
        this.state.history
      this.setState({
        history: tempHistory.concat({
          squares: currentSquares
        }),
        xIsNext: !((this.state.stepNumber + 1) % 2),
        stepNumber: this.state.stepNumber + 1
      })
    }
  }

 checkWinner (squares, player) {
    const winner = util.isWinner(squares)
    if (winner) {
      this.setState({
        winner: player,
        winnerCheers: winner,
        gameOver: true,
      })
    } else {
      if (squares.every(item => item)) {
        this.setState({
          gameOver: true
        })
        setTimeout(() => {
          alert('平局')
        })
      }
    }
  }

  jumpTo = (index) => {
    /** 只需要更新当前进行到哪一步即可，这样保留了整个历史记录 */
    /** 只有在添加棋子的时候，才需要更新历史记录，跳转历史记录，只需要传索引就好，因为每个元素都包含那一个时刻的副本。 */
    // 因为每一条历史记录都是可以重新开始的，所以也需要对应更新player
    this.setState({
      stepNumber: index,
      xIsNext: !(index % 2)
    })

  }

  handleSort = () => {
    this.setState(state => {
      return {
        isAsc: !state.isAsc
      }
    })
  }

  restartGame = () => {
    this.setState({
      stepNumber: 0,
      history: [{ squares: Array(this.state.boardRow * this.state.boardCloumn).fill('') }],
      winner: '',
      winnerCheers: [],
      isAsc: true,
      xIsNext: true
    })
  }
}

export default Game

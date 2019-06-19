import React from 'react'
import Board from './Board'
import History from './History'
import HistoryFunctional from './HistoryFunctional'
import util from '../util'

let id = 1;
class Game extends React.Component {
  constructor () {
    super()

    this.state = {
      boardRow: 3,
      boardCloumn: 3,
      squareList: [],
      currentPlayer: '',
      steps: [],
      wantJumpStep: '',
      winner: '',
      winnerCheers: [],
      isAsc: true,
      stepId: '',
      history: [],
      stepNumber: 0,
      xIsNext: true
    };
    this.state.squareList = Array(this.state.boardRow * this.state.boardCloumn).fill('')
    this.restartGame = this.restartGame.bind(this)
    this.jumpTo = this.jumpTo.bind(this)

    this.state.history = [{ squares: this.state.squareList }]
    this.state.stepNumber = 0
  }

  render () {
    const { stepNumber, history } = this.state
    const current = history[stepNumber]
    console.log(current, 'current')

    return (
      <div className="">
        <button className="start" onClick={this.restartGame}>restart game</button>
        <div className="board-wrapper">
          <Board
            squareList={current.squares}
            boardRow={this.state.boardRow}
            boardCloumn={this.state.boardCloumn}
            winnerCheers={this.state.winnerCheers}
            squareItemClick={this.handleSquareClick.bind(this)}
          />
        </div>
        <div className="game-info">
          <div>{this.state.winner ? 'Winner' + this.state.winner : 'next Player: ' + (this.state.nextPlayer || 'X')}</div>
          <HistoryFunctional
            history={this.state.history}
            isAsc={this.state.isAsc}
            jumpTo={this.jumpTo}
            handleSort={this.handleSort.bind(this)}
          />
        </div>
      </div>
    )
  }

  async handleSquareClick(i) {
    // 如果上一步存在赢家，游戏已经结果，玩家不能再落子操作了
    if (this.state.winner) {
      return
    }

    // 将棋子填充到棋盘对应位置
    this.updateHistory(i)

    // do winnerCheck? or before?
  }

  updateHistory = (i) => {
    let currentSquares = this.state.history[this.state.stepNumber].squares.slice()
    const currentPlayer = this.state.xIsNext ? 'X' : 'O'
    currentSquares[i] = currentPlayer
    
    this.setState({
      history: this.state.history.concat({
        squares: currentSquares
      }),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
    })
  }

  gameCallBack (status) {
    const defaultCallBack = function () {
      return
    }
    // callback
    const statusCallBackObj = {
      'continue': this.assertNextChess,
      'win': this.saveWinner,
      'tie': this.notifyMessage
    }
    // params
    const statusCallBackPramsObj = {
      'continue': [],
      'win': [],
      'tie': ['平局']
    }
    const params = statusCallBackPramsObj[status]
    return (statusCallBackObj[status] || defaultCallBack).call(this, ...params)
  }

  saveWinner () {
    // 玩家落子之后的判断，之前预判的下一步黑棋/白棋就是当前的棋子
    const currentPlayer = this.state.nextPlayer
    this.setState({
      winner: currentPlayer
    })
  }

  notifyMessage (message) {
    // 一个简单的平局消息展示
    alert(message)
  }

  jumpTo = (index) => {
    console.log(index, 'index jumpTo')
    /** 只需要更新当前进行到哪一步即可，这样保留了整个历史记录 */
    /** 只有在添加棋子的时候，才需要更新历史记录，跳转历史记录，只需要传索引就好，因为每个元素都包含那一个时刻的副本。 */
    this.setState({
      stepNumber: index
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

  restartGame () {
    this.setState({
      squareList: [],
      history: [],
      currentPlayer: '',
      nextPlayer: 'X',
      steps: [],
      wantJumpStep: '',
      winner: '',
      winnerCheers: [],
      isAsc: true,
      asc_index: -1,
      dsc_index: -1
    })
  }
}

export default Game

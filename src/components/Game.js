import React from 'react'
import Board from './Board'
import History from './History'
import util from '../util'

class Game extends React.Component {
  constructor () {
    super()

    this.state = {
      boardRow: 3,
      boardCloumn: 3,
      squareList: [],
      currentPlayer: '',
      nextPlayer: 'X',
      history: [],
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
    this.jumpTo = this.jumpTo.bind(this)
  }

  render () {
    return (
      <div className="">
        <button className="start" onClick={this.restartGame}>restart game</button>
        <div className="board-wrapper">
          <Board
            squareList={this.state.squareList}
            boardRow={this.state.boardRow}
            boardCloumn={this.state.boardCloumn}
            winnerCheers={this.state.winnerCheers}
            squareItemClick={this.handleSquareClick.bind(this)}
          />
        </div>
        <div className="game-info">
          <div>{this.state.winner ? 'Winner' + this.state.winner : 'next Player: ' + (this.state.nextPlayer || 'X')}</div>
          <History
            steps={this.state.steps}
            isAsc={this.state.isAsc}
            asc_index={this.state.asc_index}
            dsc_index={this.state.dsc_index}
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
    await this.addChess(i)

    // 更新历史记录
    this.recordHistory (i)

    // 判断游戏状态,执行回调方法
    this.assertGameStatus()
    .then((status) => {
      this.gameCallBack(status)
    })
  }

  async addChess (i) {
    let tempSquareList = this.state.squareList.slice(0)
    // 玩家落子之后，之前预判的黑棋/白旗就是当前的棋子
    const currentPlayer = this.state.nextPlayer
    tempSquareList[i] = currentPlayer
    await this.setState(state => {
      return {
        squareList: tempSquareList
      }
    })
  }

  async assertNextChess () {
    await this.setState((state) => {
      return {
        nextPlayer: state.nextPlayer === 'O' ? 'X': 'O'
      }
    })
  }

  assertGameStatus () {
    return new Promise (resolve => {
      // 游戏继续
      if (this.state.steps.length < 5) {
        resolve('continue')
        return
      }

      let squares = []
      // 玩家落子之后的判断，之前预判的下一步黑棋/白棋就是当前的棋子
      const currentPlayer = this.state.nextPlayer
      this.state.squareList.forEach((item, index) => {
        if (item === currentPlayer) {
          squares.push(index)
        }
      })
      // 出现赢家
      if (util.isWinner(squares)) {
        this.setState({
          winnerCheers: util.isWinner(squares)
        })
        resolve('win')
        return
      }
      
      // 平局也需要结束游戏
      if ((this.state.steps.length === this.state.boardRow * this.state.boardCloumn) && !this.state.winner) {
        resolve('tie')
        return
      }
      // 游戏继续
      resolve('continue')
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

  recordHistory (i) {
    // 更新历史记录
    let tempGameHistory = this.state.squareList.slice(0)
    this.setState({
      history: tempGameHistory
    })

    // 记录当前步骤的index
    let end = ''
    if (this.state.wantJumpStep) {
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

  jumpTo (step, index) {
    console.log(index, 'index jumpTo')
    // console.log(this.state.steps, 'step')
    let tempList = this.state.history.slice(0)
    const start  = this.state.isAsc ? index + 1 : 0
    const end = this.state.isAsc ? this.state.steps.length : index
    // 升序情况，清空[index + 1, length]
    // 降序情况，清空[0, index)
    for(let i = start; i < end; i++) {
      tempList[this.state.steps[i]] = ''
    }

    // 记录升序/降序情况下当前要去往哪一个历史记录
    const asc = this.state.isAsc ? index : this.state.steps.length - index - 1
    const dsc = this.state.isAsc ? this.state.steps.length - index - 1 : index
    this.setState({
      asc_index: asc
    })
    this.setState({
      dsc_index: dsc
    })

    this.setState({
      squareList: tempList
    })

    this.setState({
      wantJumpStep: index
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

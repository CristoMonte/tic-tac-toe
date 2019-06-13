import React from "react";
import Square from "./Square";

class Board extends React.Component {

  renderSquare(i, isWinnerCheers) {
    return <Square
      value={this.props.squareList[i]}
      key={i}
      isWinnerCheers={isWinnerCheers}
      squareClick={this.handleClick.bind(this, i)} />;
  }

  renderBoardRow(start) {
    // start 0 3 6   0 4 8
    let squareElementList = new Array(this.props.boardRow).fill(1);
    return squareElementList.map((arr, index) => {
      const value = start + index;
      const isWinnerCheers = this.props.winnerCheers.includes(value)
      return this.renderSquare(value, isWinnerCheers);
    });
  }

  renderBoardCloumn() {
    let boardCloumnList = new Array(this.props.boardCloumn).fill(1);
    boardCloumnList = boardCloumnList.map((arr, index) => {
      return (
        <li className="board-row" key={index}>
          {this.renderBoardRow(index * this.props.boardRow)}
        </li>
      );
    });
    return boardCloumnList;
  }

  handleClick (i) {
    this.props.squareItemClick(i)
  }

  render() {
    return <ul className="board">{this.renderBoardCloumn()}</ul>;
  }
}

export default Board;

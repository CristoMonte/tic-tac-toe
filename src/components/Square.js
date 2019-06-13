import React from "react";

class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={this.props.squareClick}
        style={{color: this.props.isWinnerCheers? 'red': 'black'}}
      >
        {this.props.value}
      </button>
    );
  }
}

export default Square;

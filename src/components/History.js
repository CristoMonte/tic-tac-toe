import React, { Component } from 'react'

class History extends Component {
  jumpTo (item, index) {
    this.props.jumpTo(item, index)
  }
  render () {
    const progressList = this.props.steps.map((stepsItems, index, arr) => {
      return (
        <li
          key={index}
          className="game-history-item"
          onClick={this.jumpTo.bind(this, stepsItems, index)}
          style={{color: (this.props.isAsc ? this.props.asc_index : this.props.dsc_index) === index ? 'blue' : 'black'}}
          >
          {this.props.isAsc ? (index + 1) : (arr.length - index)}、move ({Math.floor(stepsItems / 3) + 1}, {(stepsItems % 3) + 1})
        </li>
      )
    })
    // 排序按钮
    let sortBtnEle = ''
    if (this.props.steps.length) {
      sortBtnEle = <div className="history-btn" onClick={this.props.handleSort}>{this.props.isAsc ? '升序' : '降序'}</div>
    }

    return (
      <ul className="history-ul">
        {sortBtnEle}
        {progressList}
      </ul>
    )
  }
}

export default History

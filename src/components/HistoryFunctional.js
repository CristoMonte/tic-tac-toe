import React, { useState } from "react";

function History(props) {
  const { history, isAsc, handleSort, jumpTo } = props;
  const [activeIndex, setIndex] = useState(0);

  const progressList = history.map((historyItems, index, arr) => {
    return (
      <li
        key={index}
        className="game-history-item"
        onClick={() => {
          setIndex(index)
          jumpTo(index);
        }}
        style={{
          color: activeIndex === index ? "blue" : "black"
        }}
      >
        {index ? `go to move #${index}` : "go Game start"}
      </li>
    );
  });
  // 排序按钮
  let sortBtnEle = "";
  if (history.length) {
    sortBtnEle = (
      <div className="history-btn" onClick={handleSort}>
        {isAsc ? "升序" : "降序"}
      </div>
    );
  }

  return (
    <>
      {sortBtnEle}
      <ol className="history-ul">
        {isAsc ? progressList : progressList.reverse()}
      </ol>
    </>
  );
}

export default History;

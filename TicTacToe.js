const board = document.querySelector('.board');
const currPlayer = document.querySelector('.curr-player');

const players = ['x', 'o'];
const aiPlayer = players[Math.round(Math.random())];

const winBoard = {
  x: {
    coords: [],
    mapCoords:{
      x: [],
      y: [],
      diag: [],
      antiDiag: []
    }
  },
  o: {
    coords: [],
  },
};

let winLength = 3;
let boardFieldsCount = 0;
let filledBoardFieldsCount = 0;

const showModal = (text) => {
  const modal = document.querySelector('[data-modal]');
  const message = document.querySelector('[data-message]');
  const resetBtn = document.querySelector('[data-reset]');
  modal.classList.remove('hide');
  message.textContent = `${text}`;
  resetBtn.addEventListener('click', () => location.reload());
}

const endGame = (winner) => {
  const modalMessage = winner ? `Player ${winner} win!` : `Draw!`;
  board.removeEventListener('click', handleGame);
  showModal(modalMessage);
};

//chain searching for every direction, 
const isWin = (obj) => {
  const coords = [...obj.coords].sort((a, b) => a.col - b.col);

  for (const coord of coords) {
    const matchUp = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === 1);
    const matchDown = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === -1);
    const matchRow = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) === Number(item.row));
    const matchCol = coords.find((item) => Number(item.col) === Number(coord.col) && (Number(coord.row) - Number(item.row) === 1 || Number(coord.row) - Number(item.row) === -1));

    if (matchUp || matchDown || matchRow || matchCol) {
      let prevUp = matchUp;
      let prevDown = matchDown;
      let prevInRow = matchRow;
      let prevInCol = matchCol;
      const checkedInCol = matchCol ? [Number(matchCol.row), Number(coord.row)] : [];

      for (let i = 2; i < winLength; i++) {
        if (prevInRow) {
          const newMatchRow = coords.find((item) => Number(item.col) - Number(prevInRow.col) === 1 && Number(prevInRow.row) === Number(item.row));
          prevInRow = newMatchRow;
        }

        if (prevInCol) {
          const newMatchCol = coords.find((item) => Number(item.col) === Number(prevInCol.col) && (Number(prevInCol.row) - Number(item.row) === 1 || Number(prevInCol.row) - Number(item.row) === -1) && !checkedInCol.includes(Number(item.row)));
          if (newMatchCol) checkedInCol.push(Number(newMatchCol.row));
          prevInCol = newMatchCol
        }

        if (prevUp) {
          const newMatchUp = coords.find((item) => Number(item.col) - Number(prevUp.col) === 1 && Number(prevUp.row) - Number(item.row) === 1);
          prevUp = newMatchUp;
        }

        if (prevDown) {
          const newMatchDown = coords.find((item) => Number(item.col) - Number(prevDown.col) === 1 && Number(prevDown.row) - Number(item.row) === -1);
          prevDown = newMatchDown;
        }
      }
      if (prevUp || prevDown || prevInRow || prevInCol) return true;
    }
  }

  return false;
}

const aiPlayerMove = (coords) => {
  const emptyFields = [...document.querySelectorAll('.box')].filter((item) => !item.getAttribute('data-clicked'));
  let bestMove = null;

  if (!emptyFields.length) return;
  if (aiPlayer !== players[0]) return;
  if (winBoard[aiPlayer].coords.length === 0) {
    const randomField = emptyFields[Math.floor(Math.random() * emptyFields.length)];
    return randomField.click();
  }
  //const aiCoords = [...winBoard[aiPlayer].coords].sort((a, b) => a.col - b.col);

  const findNextMove = (obj) => {
    const coords = [...obj.coords].sort((a, b) => a.col - b.col);
    let probablyBestMove = {
      row: {
        chainLength: 0,
        nextMove: null
      },
      col: {
        chainLength: 0,
        nextMove: null
      },
      diag: {
        chainLength: 0,
        nextMove: null
      },
      antiDiag: {
        chainLength: 0,
        nextMove: null
      },
    };

    for (const coord of coords) {
      const matchAntiDiag = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === 1);
      const matchDiag = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === -1);
      const matchRow = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) === Number(item.row));
      const matchCol = coords.find((item) => Number(item.col) === Number(coord.col) && (Number(coord.row) - Number(item.row) === 1 || Number(coord.row) - Number(item.row) === -1));
  
      if (matchAntiDiag || matchDiag || matchRow || matchCol) {
        let prevAntiDiag = matchAntiDiag;
        let prevDiag = matchDiag;
        let prevInRow = matchRow;
        let prevInCol = matchCol;
        const checkedInCol = matchCol ? [Number(matchCol.row), Number(coord.row)] : [];
  
        for (let i = 2; i < winLength; i++) {
          if (prevInRow) {
            const newMatchRow = coords.find((item) => Number(item.col) - Number(prevInRow.col) === 1 && Number(prevInRow.row) === Number(item.row));
            prevInRow = newMatchRow;
            
          }
  
          if (prevInCol) {
            const newMatchCol = coords.find((item) => Number(item.col) === Number(prevInCol.col) && (Number(prevInCol.row) - Number(item.row) === 1 || Number(prevInCol.row) - Number(item.row) === -1) && !checkedInCol.includes(Number(item.row)));
            if (newMatchCol) checkedInCol.push(Number(newMatchCol.row));
            prevInCol = newMatchCol
          }
  
          if (prevAntiDiag) {
            const newAntiDiag = coords.find((item) => Number(item.col) - Number(prevAntiDiag.col) === 1 && Number(prevAntiDiag.row) - Number(item.row) === 1);
            prevAntiDiag = newAntiDiag;
          }
  
          if (prevDiag) {
            const newMatchDiag = coords.find((item) => Number(item.col) - Number(prevDiag.col) === 1 && Number(prevDiag.row) - Number(item.row) === -1);
            prevDiag = newMatchDiag;
          }
        }
        if (prevAntiDiag || prevDiag || prevInRow || prevInCol) return true;
      }
    }
  
    return false;
  }
  
  // const findEmptyField = (series, direction) => {
  //   const deltas = {
  //     row: [0, 1],
  //     col: [1, 0],
  //     diag: [1, 1],
  //     antiDiag: [1, 1]
  //   };

  //   const [deltaRow,deltaCol] = deltas[direction];

  //   const prevEmptyField = emptyFields.find((item) => 
  //     Number(item.getAttribute('data-column')) === Number(series[0].col) - deltaCol && 
  //     Number(item.getAttribute('data-row')) === Number(series[0].row) - deltaRow
  //   );

  //   const nextEmptyField = emptyFields.find((item) => 
  //     Number(item.getAttribute('data-column')) === Number(series[series.length - 1].col) + deltaCol && 
  //     Number(item.getAttribute('data-row')) === Number(series[series.length - 1].row) + deltaRow
  //   );
    
  //   if (prevEmptyField && nextEmptyField)  return Math.random() < 0.5 ? prevEmptyField : nextEmptyField;
    
  //   return prevEmptyField || nextEmptyField || null;
  // };

// function findLongestSeries(moves, direction) {
//   let longest = [];
//   let tempSeries = [];
//   let move = null;
//   let longestSeries = {
//     row: [],
//     col: [],
//     diag: [],
//     antiDiag: []
//   };
//   let tempLongestSeries = {
//     row: [],
//     col: [],
//     diag: [],
//     antiDiag: []
//   };

//   if(!moves.length) return { seriesLength: 0, nextMove: null };
//   // Assuming moves are sorted, if not, sort them based on direction
//   moves.forEach((coord, index, arr) => {
//     const nextCoord = moves[index + 1];
//     let isConsecutive = false;
//     tempLongestSeries[direction].push(coord);

//     switch (direction) {
//       case 'row':
//         isConsecutive =  arr.find((item)=> Number(item.col) - Number(coord.col) === 1 && Number(item.row) === Number(coord.row)) ;
//         break;
//       case 'col':
//         isConsecutive =  arr.find((item)=> Number(item.row) - Number(coord.row) === 1 && Number(item.col) === Number(coord.col)) ;
//         break;
//       case 'diag':
//         isConsecutive =  arr.find((item)=> Number(item.row) - Number(coord.row) === 1 && Number(item.col) - Number(coord.col) === 1) ;
//         break;
//       case 'antiDiag':
//         isConsecutive =  arr.find((item)=> Number(item.row) - Number(coord.row) === 1 && Number(item.col) - Number(coord.col) === -1) ;
//         break;
//     }

//     if(!isConsecutive) {
//       if (tempLongestSeries[direction].length > longestSeries[direction].length) {
//         longestSeries[direction] = [...tempLongestSeries[direction]];
//         move = findEmptyField(tempLongestSeries[direction], direction);
//         tempLongestSeries[direction] = [];
//         if (!move) longestSeries[direction] = [];
//       }
//     }
//     //console.log(isConsecutive, direction, coord);
//     // if (isConsecutive) {
//     //   tempLongestSeries[direction].push(coord);
//     // } else if( !nextCoord && arr.length === 1) {
//     //  // console.log('only one move', coord, direction);
//     //  longestSeries[direction].push(coord);
//     //   move = findEmptyField([coord], direction);
//     //   //console.log('move', move);
//     // }else{
//     //   if (tempLongestSeries[direction].length > longestSeries[direction].length) {
//     //     longestSeries[direction] = [...tempLongestSeries[direction]];
//     //     // Assuming findEmptyField returns the next potential move
//     //     move = findEmptyField(tempLongestSeries[direction], direction);
//     //     tempLongestSeries[direction] = [];
//     //   }
//     // }
//   });
//   console.log('longestSeries', longestSeries, direction);
//   return { seriesLength: longestSeries[direction].length, nextMove: move };
// }
  // Check in all directions
  // bestMove = [
  //   findLongestSeries(aiCoords, 'row'),
  //   findLongestSeries(aiCoords, 'col'),
  //   findLongestSeries(aiCoords, 'diag'),
  //   findLongestSeries(aiCoords, 'antiDiag')
  // ].reduce((acc, curr) => {
  //   if (curr.seriesLength > acc.seriesLength) return curr;
  //   return acc;
  // }, {seriesLength: 0, nextMove: null}).nextMove;
// console.log([
//   findLongestSeries(aiCoords, 'row'),
//   findLongestSeries(aiCoords, 'col'),
//   findLongestSeries(aiCoords, 'diag'),
//   findLongestSeries(aiCoords, 'antiDiag')
// ]);

  // Perform the best move
  
  //if (bestMove) return bestMove.click();

  // Fallback to random move if no best move found
  const randomField = emptyFields[Math.floor(Math.random() * emptyFields.length)];
  console.log('randomField', randomField);
  return randomField.click();


  // let longestSeries = [];
  // let tempLongestSeries = [];
  // const deltas = {
  //   row: [0, 1],
  //   col: [1, 0],
  //   diag: [1, 1],
  //   antiDiag: [1, -1]
  // };
  
  // for (let i = 0; i < aiCoords.length; i++) {
  //   const coord = aiCoords[i];
  //   const nextCoord = aiCoords[i + 1];
  //   const colNum = coord?.col;
  //   const rowNum = coord?.row;
  //   const nextColNum = nextCoord?.col;
  //   const nextRowNum = nextCoord?.row;

  //   tempLongestSeries.push(aiCoords[i]);

  //   if (!nextColNum || Number(nextColNum) - Number(colNum) !== 1) {
  //     const prevEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-column')) === Number(tempLongestSeries[0].col) - 1 && Number(item.getAttribute('data-row')) === Number(tempLongestSeries[0].row));
  //     const nextEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-column')) === Number(tempLongestSeries[tempLongestSeries.length - 1].col) + 1 && Number(item.getAttribute('data-row')) === Number(tempLongestSeries[tempLongestSeries.length - 1].row));

  //     if (tempLongestSeries.length > longestSeries.length && (prevEmptyField || nextEmptyField)) {
  //       longestSeries = [...tempLongestSeries];
  //     }
  //     tempLongestSeries = [];
  //   }

  //   if (!nextRowNum || Number(nextRowNum) - Number(rowNum) !== 1) {
  //     const prevEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-row')) === Number(tempLongestSeries[0].row) - 1 && Number(item.getAttribute('data-column')) === Number(tempLongestSeries[0].col));
  //     const nextEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-row')) === Number(tempLongestSeries[tempLongestSeries.length - 1].row) + 1 && Number(item.getAttribute('data-column')) === Number(tempLongestSeries[tempLongestSeries.length - 1].col));

  //     if (tempLongestSeries.length > longestSeries.length && (prevEmptyField || nextEmptyField)) {
  //       longestSeries = [...tempLongestSeries];
  //     }
  //     tempLongestSeries = [];
  //   }

  //   if (!nextColNum || !nextRowNum || Number(nextColNum) - Number(colNum) !== 1 || Number(nextRowNum) - Number(rowNum) !== 1) {
  //     const prevEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-row')) === Number(tempLongestSeries[0].row) - 1 && Number(item.getAttribute('data-column')) === Number(tempLongestSeries[0].col) - 1);
  //     const nextEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-row')) === Number(tempLongestSeries[tempLongestSeries.length - 1].row) + 1 && Number(item.getAttribute('data-column')) === Number(tempLongestSeries[tempLongestSeries.length - 1].col) + 1);

  //     if (tempLongestSeries.length > longestSeries.length && (prevEmptyField || nextEmptyField)) {
  //       longestSeries = [...tempLongestSeries];
  //     }
  //     tempLongestSeries = [];
  //   }

  //   if (!nextColNum || !nextRowNum || Number(nextColNum) - Number(colNum) !== 1 || Number(nextRowNum) - Number(rowNum) !== -1) {
  //     const prevEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-row')) === Number(tempLongestSeries[0].row) + 1 && Number(item.getAttribute('data-column')) === Number(tempLongestSeries[0].col) - 1);
  //     const nextEmptyField = emptyFields.find((item) => Number(item.getAttribute('data-row')) === Number(tempLongestSeries[tempLongestSeries.length - 1].row) - 1 && Number(item.getAttribute('data-column')) === Number(tempLongestSeries[tempLongestSeries.length - 1].col) + 1);

  //     if (tempLongestSeries.length > longestSeries.length && (prevEmptyField || nextEmptyField)) {
  //       longestSeries = [...tempLongestSeries];
  //     }
  //     tempLongestSeries = [];
  //   }

  // }

  
}

const game = (e) => {
  const boardField = e.target;
  let winner = null;

  if (!boardField.classList.contains('box')) return;
  if (boardField.getAttribute('data-clicked')) return;

  currPlayer.classList.remove(players[0]);
  currPlayer.classList.add(players[1]);

  boardField.classList.add(players[0]);
  boardField.setAttribute('data-clicked', true);


  const cValue = boardField.getAttribute('data-column');
  const rValue = boardField.getAttribute('data-row');

  winBoard[players[0]].coords.push({ col: cValue, row: rValue });
  if (isWin(winBoard[players[0]])) winner = players[0];

  filledBoardFieldsCount++;

  if (winner || filledBoardFieldsCount >= boardFieldsCount) return endGame(winner);
  players.reverse();
  if (aiPlayer === players[0]) return aiPlayerMove(winBoard[players[0]]);
}

const handleGame = (e) => {
  return game(e);
}

const startGame = ({ boardSizeInput, winLengthInput, startScreen, gameScreen }) => {
  const boardSize = Number(boardSizeInput.value);
  winLength = Number(winLengthInput.value);
  boardFieldsCount = boardSize ** 2;

  if (isNaN(boardSize) || boardSize > 9 || boardSize < 3) showModal('Board size must be higher or equal 3 and lower than 9.');
  if (isNaN(winLength) || winLength > boardSize || winLength < 3) showModal('Win length must be higher or equal 3 and lower than board size.');

  startScreen.classList.add('hide');
  gameScreen.classList.add('show');
  document.documentElement.style.setProperty('--grid-columns-count', boardSize);

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const elem = document.createElement('div');
      elem.classList.add('box');
      elem.setAttribute('data-row', i);
      elem.setAttribute('data-column', j);
      board.append(elem);
    }
  }

  board.addEventListener('click', handleGame);
  if (aiPlayer === 'x') aiPlayerMove();
}

const handleConfigGame = (startGame) => {
  const boardSizeInput = document.querySelector('[data-board-size]');
  const winLengthInput = document.querySelector('[data-win-length]');
  const playBtn = document.querySelector('[data-play-btn]');
  const startScreen = document.querySelector('[data-start-screen]');
  const gameScreen = document.querySelector('[data-game]');

  playBtn.addEventListener('click', () => startGame({ boardSizeInput, winLengthInput, startScreen, gameScreen }));
}

window.addEventListener('load', () => handleConfigGame(startGame));
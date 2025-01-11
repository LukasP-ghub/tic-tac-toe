const board = document.querySelector('.board');
const currPlayer = document.querySelector('.curr-player');

const players = ['x', 'o'];
const aiPlayer = players[Math.round(Math.random())];

const winBoard = {
  x: {
    coords: [],
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

  const findNextMove = (obj,emptyFields) => {
    const coords = [...obj.coords].sort((a, b) => a.col - b.col);
    let moveChains = [];

    for (const coord of coords) {
      const matchAntiDiag = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === 1);
      const matchDiag = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === -1);
      const matchRow = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) === Number(item.row));
      const matchCol = coords.find((item) => Number(item.col) === Number(coord.col) && (Number(coord.row) - Number(item.row) === 1 || Number(coord.row) - Number(item.row) === -1));
      
      const chainRow = {
        chainLength: 1,
        firstMove: coord,
        lastMove: coord,
        direction: 'row',      
      };
      const chainCol = {
        chainLength: 1,
        firstMove: coord,
        lastMove: coord,
        direction: 'col',
      };
      const chainDiag = {
        chainLength: 1,
        firstMove: coord,
        lastMove: coord,
        direction: 'diag',
      };
      const chainAntiDiag = {
        chainLength: 1,
        firstMove: coord,
        lastMove: coord,
        direction: 'antiDiag',
      };

      if (matchAntiDiag || matchDiag || matchRow || matchCol) {
        let prevAntiDiag = matchAntiDiag;
        let prevDiag = matchDiag;
        let prevInRow = matchRow;
        let prevInCol = matchCol;
        const checkedInCol = matchCol ? [Number(matchCol.row), Number(coord.row)] : [];
  
        for (let i = 1; i < winLength; i++) {
          if (prevInRow) {
            chainRow.chainLength++;
            chainRow.lastMove = prevInRow;
            const newMatchRow = coords.find((item) => Number(item.col) - Number(prevInRow.col) === 1 && Number(prevInRow.row) === Number(item.row));
            prevInRow = newMatchRow;
          }
  
          if (prevInCol) {
            chainCol.chainLength++;
            chainCol.lastMove = prevInCol;
            const newMatchCol = coords.find((item) => Number(item.col) === Number(prevInCol.col) && (Number(prevInCol.row) - Number(item.row) === 1 || Number(prevInCol.row) - Number(item.row) === -1) && !checkedInCol.includes(Number(item.row)));
            if (newMatchCol) checkedInCol.push(Number(newMatchCol.row));
            prevInCol = newMatchCol
          }
  
          if (prevAntiDiag) {
            chainAntiDiag.chainLength++;
            chainAntiDiag.lastMove = prevAntiDiag;
            const newAntiDiag = coords.find((item) => Number(item.col) - Number(prevAntiDiag.col) === 1 && Number(prevAntiDiag.row) - Number(item.row) === 1);
            prevAntiDiag = newAntiDiag;
          }
  
          if (prevDiag) {
            chainDiag.chainLength++;
            chainDiag.lastMove = prevDiag;
            const newMatchDiag = coords.find((item) => Number(item.col) - Number(prevDiag.col) === 1 && Number(prevDiag.row) - Number(item.row) === -1);
            prevDiag = newMatchDiag;
          }
        }
      }
      moveChains.push(chainRow, chainCol, chainDiag, chainAntiDiag);
    }

    moveChains.sort((a, b) => b.chainLength - a.chainLength);
    console.log(moveChains);
    
    for (let i = 0; i < moveChains.length; i++) {
      const chain = moveChains[i];
      const deltas = {
        row: [0, 1],
        col: [1, 0],
        diag: [1, 1],
        antiDiag: [1, -1]
      };
      const [deltaRow,deltaCol] = deltas[chain.direction];
      const prevEmptyField = emptyFields.find((item) => 
        Number(item.getAttribute('data-column')) === Number(chain.firstMove.col) - deltaCol && 
        Number(item.getAttribute('data-row')) === Number(chain.firstMove.row) - deltaRow
      );
      const nextEmptyField = emptyFields.find((item) => 
        Number(item.getAttribute('data-column')) === Number(chain.lastMove.col) + deltaCol && 
        Number(item.getAttribute('data-row')) === Number(chain.lastMove.row) + deltaRow
      );
      if(prevEmptyField || nextEmptyField) return prevEmptyField || nextEmptyField;
    }
    return null;
  }
  
  bestMove = findNextMove(coords,emptyFields);
  if (bestMove) return bestMove.click();
  
  // Fallback to random move if no best move found
  const randomField = emptyFields[Math.floor(Math.random() * emptyFields.length)];
 
  return randomField.click();
  
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
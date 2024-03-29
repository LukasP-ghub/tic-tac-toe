const board = document.querySelector('.board');
const currPlayer = document.querySelector('.curr-player');

const players = ['x', 'o'];

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

  if (winner || filledBoardFieldsCount >= boardFieldsCount) endGame(winner);
  players.reverse();
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
const board = document.querySelector('.board');
const currPlayer = document.querySelector('.curr-player');

let player = 'playerX';
const winBoard = {
  playerX: {
    coords: [],
  },
  playerO: {
    coords: [],
  },
};

const winLength = 3;

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const elem = document.createElement('div');
    elem.classList.add('box');
    elem.setAttribute('data-row', i);
    elem.setAttribute('data-column', j);
    board.append(elem);
  }
}

const win = (winner) => {
  console.log(winner);
  board.removeEventListener('click', handleGame);
};

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
  const box = e.target;
  let winner;

  if (!box.classList.contains('box')) return;
  if (box.getAttribute('data-clicked')) return;

  const sign = player === 'playerX' ? 'x' : 'o';
  const nextPlayer = player === 'playerX' ? 'o' : 'x';

  currPlayer.classList.remove(sign);
  currPlayer.classList.add(nextPlayer);

  box.classList.add(sign);
  box.setAttribute('data-clicked', true);


  const cValue = box.getAttribute('data-column');
  const rValue = box.getAttribute('data-row');

  winBoard[player].coords.push({ col: cValue, row: rValue });
  if (isWin(winBoard[player])) winner = player;

  player = player === 'playerX' ? 'playerO' : 'playerX';

  if (winner) win(winner);

}

const handleGame = (e) => {
  return game(e);
}

board.addEventListener('click', handleGame);
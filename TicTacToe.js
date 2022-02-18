const board = document.querySelector('.board');

let player = 'playerX';
const winBoard = {
  playerX: {
    colMap: {},
    rowMap: {},
    coords: [],
  },
  playerO: {
    colMap: {},
    rowMap: {},
    coords: [],
  },
};

const winLength = 3;

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
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

  for (const prop in obj) {
    const directionMap = obj[prop];
    for (const key in directionMap) {
      if (directionMap[key].length >= winLength) {
        const tempArr = [...directionMap[key]].sort();
        let isGroup = 0;
        tempArr.reduce((prev, curr) => {
          const currNum = Number(curr);
          const prevNum = Number(prev);
          (currNum - prevNum === 1 || currNum - prevNum === -1) ? isGroup++ : isGroup = 0;
          return currNum;
        });
        if (isGroup >= winLength - 1) return true;
      }
    }
  }

  for (const coord of coords) {
    const matchUp = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === 1);
    const matchDown = coords.find((item) => Number(item.col) - Number(coord.col) === 1 && Number(coord.row) - Number(item.row) === -1);
    if (matchUp) {
      const secondMatchUp = coords.find((item) => Number(item.col) - Number(matchUp.col) === 1 && Number(matchUp.row) - Number(item.row) === 1);
      if (secondMatchUp) return true;
    }

    if (matchDown) {
      const secondMatchDown = coords.find((item) => Number(item.col) - Number(matchDown.col) === 1 && Number(matchDown.row) - Number(item.row) === -1);
      if (secondMatchDown) return true;
    }

  }

  return false;
}

const game = (e) => {
  const box = e.target;
  let winner;
  if (!box.classList.contains('box')) return;
  if (box.getAttribute('data-clicked')) return;

  const sign = player[player.length - 1];
  box.textContent = sign;
  box.setAttribute('data-clicked', true);
  const cValue = box.getAttribute('data-column');
  const rValue = box.getAttribute('data-row');

  winBoard[player].colMap[cValue] = winBoard[player].colMap[cValue] ? [...winBoard[player].colMap[cValue], rValue] : [rValue];
  winBoard[player].rowMap[rValue] = winBoard[player].rowMap[rValue] ? [...winBoard[player].rowMap[rValue], cValue] : [cValue];
  winBoard[player].coords.push({ col: cValue, row: rValue });

  if (isWin(winBoard[player])) winner = player;

  player = player === 'playerX' ? 'playerO' : 'playerX';

  if (winner) win(winner);

}

const handleGame = (e) => {
  return game(e);
}



board.addEventListener('click', handleGame);
const board = document.querySelector('.board');




let player = 'playerX';
const winBoard = {
  // r0: [],
  // r1: [],
  // r2: [],
  // c0: [],
  // c1: [],
  // c2: [],
  playerXCross: {
    cIndex: [],
    rIndex: [],
  },
  playerOCross: {
    cIndex: [],
    rIndex: [],
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
  winBoard[`c${i}`] = [];
  winBoard[`r${i}`] = [];
}

const win = (winner) => {
  console.log(winner);
  board.removeEventListener('click', handleGame);
};


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

  const coords = [`c${cValue}`, `r${rValue}`];
  const winCrossOption = winBoard[`${player}Cross`];

  coords.forEach((coord) => {
    const winOption = winBoard[coord];

    winOption.push(sign);
    switch (coord[0]) {
      case 'c':
        winCrossOption.cIndex.push(cValue);
        break;
      case 'r':
        winCrossOption.rIndex.push(rValue);
        break;
    }

    if (winOption.length === winLength && winOption.every(item => item === sign)) winner = player;
  });

  if (winCrossOption.cIndex.length >= winLength && winCrossOption.rIndex.length >= winLength && (winCrossOption.cIndex.length === winCrossOption.rIndex.length)) {
    const rowIds = [...new Set(winCrossOption.rIndex)].sort();
    const colIds = [...new Set(winCrossOption.cIndex)].sort();

    for (let i = 0; i <= Math.floor(rowIds.length / winLength); i++) {
      const partRow = rowIds.slice(i, i + winLength);
      const partCol = colIds.slice(i, i + winLength);

      let flagRow = [];
      let flagCol = [];

      if (partRow.length === winLength && partCol.length === winLength) {
        partRow.reduce((prev, curr) => {
          const currNum = Number(curr);
          const prevNum = Number(prev);

          (currNum - prevNum === 1 || currNum - prevNum === -1) ? flagRow.push(1) : flagRow.push(0);
          return currNum;
        });

        partCol.reduce((prev, curr) => {
          const currNum = Number(curr);
          const prevNum = Number(prev);

          (currNum - prevNum === 1 || currNum - prevNum === -1) ? flagCol.push(1) : flagCol.push(0);
          return currNum;
        });


        if (flagCol.every(item => Number(item) === 1) && flagRow.every(item => Number(item) === 1)) {
          winner = player;
          break;
        }
      }
    }
  }

  player = player === 'playerX' ? 'playerO' : 'playerX';

  if (winner) win(winner);
}

const handleGame = (e) => {
  return game(e);
}



board.addEventListener('click', handleGame);
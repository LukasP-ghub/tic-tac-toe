const board = document.querySelector('.board');

let player = 'playerX';
const winBoard = {
  r0: [],
  r1: [],
  r2: [],
  c0: [],
  c1: [],
  c2: [],
  playerXCross: {
    cIndex: [],
    rIndex: [],
  },
  playerOCross: {
    cIndex: [],
    rIndex: [],
  },
};


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

  coords.forEach((coord) => {
    const winOption = winBoard[coord];
    const winCrossOption = winBoard[`${player}Cross`];
    winOption.push(sign);
    switch (coord[0]) {
      case 'c':
        winCrossOption.cIndex.push(cValue);
        break;
      case 'r':
        winCrossOption.rIndex.push(rValue);
        break;
    }

    if (winOption.length === 3 && winOption.every(item => item === sign)) winner = player;
    if (winCrossOption.cIndex.length === 3 && winCrossOption.rIndex.length === 3 && (winCrossOption.cIndex.reduce((prev, curr) => prev + curr, 0) === winCrossOption.rIndex.reduce((prev, curr) => prev + curr, 0))) winner = player;
    console.log(winCrossOption.cIndex, winCrossOption.rIndex);
  });

  player = player === 'playerX' ? 'playerO' : 'playerX';

  if (winner) win(winner);

}

const handleGame = (e) => {
  return game(e);
}



board.addEventListener('click', handleGame);
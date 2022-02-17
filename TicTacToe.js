const board = document.querySelector('.board');

let isXPlayer = true;
const winBoard = {
  r0: [],
  r1: [],
  r2: [],
  c0: [],
  c1: [],
  c2: [],
  playerXCross: {
    colIndex: [],
    rowIndex: [],
  },
  playerYCross: {
    colIndex: [],
    rowIndex: [],
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

  let sign;
  isXPlayer ? sign = 'x' : sign = 'o';
  box.textContent = sign;
  box.setAttribute('data-clicked', true);

  const coords = [`c${box.getAttribute('data-column')}`, `r${box.getAttribute('data-row')}`];

  coords.forEach((coord) => {
    const winBoardOption = winBoard[coord];
    winBoardOption.push(sign);
    if (winBoardOption.length === 3 && winBoardOption.every(item => item === sign)) winner = sign;
  });

  isXPlayer = !isXPlayer;

  if (winner) win(winner);

}

const handleGame = (e) => {
  return game(e);
}



board.addEventListener('click', handleGame);
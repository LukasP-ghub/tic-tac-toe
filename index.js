const board = document.querySelector('.board');

let isXPlayer = true;
const winPossibilities = {
  r0: [],
  r1: [],
  r2: [],
  c0: [],
  c1: [],
  c2: [],
  crossL: [],
  crossR: [],
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

  const col = `c${box.getAttribute('data-column')}`;
  const row = `r${box.getAttribute('data-row')}`;
  const currCol = winPossibilities[col];
  const currRow = winPossibilities[row];

  currCol.push(sign);
  currRow.push(sign);
  if (['c0r0', 'c1r1', 'c2r2'].includes(`${col}${row}`)) winPossibilities.crossL.push(sign);
  if (['c2r0', 'c1r1', 'c0r2'].includes(`${col}${row}`)) winPossibilities.crossR.push(sign);

  const colLng = currCol.length;
  const rowLng = currRow.length;
  const crossL = winPossibilities.crossL;
  const crossR = winPossibilities.crossR;

  if (colLng === 3 && currCol.every(item => item === sign)) winner = sign;
  if (rowLng === 3 && currRow.every(item => item === sign)) winner = sign;
  if (crossL.length === 3 && crossL.every(item => item === sign)) winner = sign;
  if (crossR.length === 3 && crossR.every(item => item === sign)) winner = sign;

  isXPlayer = !isXPlayer;

  if (winner) win(winner);

}

const handleGame = (e) => {
  return game(e);
}



board.addEventListener('click', handleGame);
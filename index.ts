function createBoard() {
    return [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  }
  
  function printBoard(board: string[][]) {
    console.log("    1   2   3 ");
    console.log("  -------------")
    for (let i = 0; i < 3; i++) {
      console.log(i + 1 + " | " + board[i].join(" | ") + " | ");
      console.log("  -------------")
    }
  }
  
  function checkWinner(board: string[][], player: string) {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
        return true;
      }
      if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
        return true;
      }
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
      return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
      return true;
    }
    return false;
  }
  
  function isBoardFull(board: string[][]) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          return false;
        }
      }
    }
    return true;
  }
  
  function getInput() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise<string>((resolve) => {
      readline.question("Enter your move (row and column): ", (input: string) => {
        resolve(input);
        readline.close();
      });
    });
  }
  
  function minimax(board: string[][], depth: number, isMaximizing: boolean) {
    if (checkWinner(board, "x")) {
      return -10;
    }
    if (checkWinner(board, "o")) {
      return 10;
    }
    if (isBoardFull(board)) {
      return 0;
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === " ") {
            board[i][j] = "o";
            let score = minimax(board, depth + 1, false);
            board[i][j] = " ";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === " ") {
            board[i][j] = "x";
            let score = minimax(board, depth + 1, true);
            board[i][j] = " ";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  
  function getBestMove(board: string[][]): { row: number, col: number } {
    let bestScore = -Infinity;
    let move = { row: -1, col: -1 };
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = "o";
          let score = minimax(board, 0, false);
          board[i][j] = " ";
          if (score > bestScore) {
            bestScore = score;
            move = { row: i, col: j };
          }
        }
      }
    }
  
    return move;
  }
  
  function getGameMode() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise<string>((resolve) => {
      readline.question("Choose game mode: (1) Player vs Player, (2) Player vs Computer: ", (input: string) => {
        resolve(input);
        readline.close();
      });
    });
  }
  
  async function playGame() {
    const gameMode = await getGameMode();
    
    let board = createBoard();
    let player = "x";
    let isVsComputer = gameMode === '2';
    
    while (true) {
      printBoard(board);
      
      if (player === "x" || !isVsComputer) {
        // Player's move
        const input = await getInput();
        const [rowInput, colInput] = input.split('');
        const row = parseInt(rowInput) - 1;
        const col = parseInt(colInput) - 1;
        
        if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) {
          console.log("Invalid input. Please enter row and column numbers between 1 and 3.");
          continue;
        }
        
        if (board[row][col] !== " ") {
          console.log("This cell is already occupied. Please choose an empty cell.");
          continue;
        }
        
        board[row][col] = player;
      } else {
        // Computer's move
        const { row, col } = getBestMove(board);
        board[row][col] = player;
        console.log(`Computer placed an "o" at ${row + 1}, ${col + 1}`);
      }
      
      if (checkWinner(board, player)) {
        printBoard(board);
        console.log(player + " wins!");
        break;
      }
      
      if (isBoardFull(board)) {
        printBoard(board);
        console.log("It's a draw!");
        break;
      }
      
      player = player === "x" ? "o" : "x";
    }
  }
  playGame();
  
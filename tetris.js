const canvas = document.getElementById('tetris-board');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');

context.scale(20, 20);

// High Score Logic
let highScore = localStorage.getItem('tetrisHighScore') || 0;
if (highScoreElement) highScoreElement.innerText = highScore;

// Tetromino definitions
const pieces = 'ILJOTSZ';
const colors = [
    null,
    '#00f2ff', // Cyan (I)
    '#ff0055', // Red/Pink (L)
    '#7000ff', // Purple (J)
    '#ffff00', // Yellow (O)
    '#00ff00', // Green (T)
    '#ffaaaa', // Light Red (S)
    '#aaffaa', // Light Green (Z)
];

function createPiece(type) {
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);

                // Add simple 3D effect/border
                context.lineWidth = 0.05;
                context.strokeStyle = 'rgba(0,0,0,0.5)';
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const piecesStr = 'ILJOTSZ';
    player.matrix = createPiece(piecesStr[piecesStr.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));

        // Game Over - Check High Score
        if (player.score > highScore) {
            highScore = player.score;
            localStorage.setItem('tetrisHighScore', highScore);
            if (highScoreElement) highScoreElement.innerText = highScore;
            alert('Új Rekord! Pontszámod: ' + player.score);
        } else {
            alert('Game Over! Pontszámod: ' + player.score);
        }

        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }

    // Speed up every 100 points
    const level = Math.floor(player.score / 100);
    const newInterval = 1000 - (level * 100);
    dropInterval = newInterval > 100 ? newInterval : 100;
}

function updateScore() {
    scoreElement.innerText = player.score;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    if (!isGameRunning || isPaused) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};

let isGameRunning = false;
let isPaused = false;
const pauseBtn = document.getElementById('pause-btn');

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        isPaused = false;
        startBtn.innerText = 'Újrakezdés';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        dropInterval = 1000; // Reset speed
        playerReset();
        updateScore();
        update();
    } else {
        playerReset();
        player.score = 0;
        isPaused = false;
        if (pauseBtn) pauseBtn.innerText = 'Szünet';
        dropInterval = 1000; // Reset speed
        updateScore();
    }
});

// Pause Button
if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        if (!isGameRunning) return;

        isPaused = !isPaused;
        pauseBtn.innerText = isPaused ? 'Folytatás' : 'Szünet';

        if (!isPaused) {
            lastTime = performance.now();
            update();
        }
    });
}

// Controls
document.addEventListener('keydown', event => {
    if (!isGameRunning || isPaused) return;

    // Prevent scrolling with arrows and space
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }

    if (event.keyCode === 37) {
        playerMove(-1); // Left
    } else if (event.keyCode === 39) {
        playerMove(1); // Right
    } else if (event.keyCode === 40) {
        playerDrop(); // Down
    } else if (event.keyCode === 81) {
        playerRotate(-1); // Q (Rotate Left)
    } else if (event.keyCode === 87 || event.keyCode === 38 || event.keyCode === 32) {
        playerRotate(1); // W, Up or Space (Rotate Right)
    } else if (event.keyCode === 80) { // P for pause
        if (pauseBtn) pauseBtn.click();
    }
});

// Mobile Controls
document.getElementById('left-btn').addEventListener('click', () => playerMove(-1));
document.getElementById('right-btn').addEventListener('click', () => playerMove(1));
document.getElementById('down-btn').addEventListener('click', () => playerDrop());
document.getElementById('rotate-btn').addEventListener('click', () => playerRotate(1));

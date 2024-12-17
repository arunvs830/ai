const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let playerName = localStorage.getItem('playerName') || 'Player'; // Get player name from local storage

if (!localStorage.getItem('playerName')) {
    // If no player name is set, redirect to player name input page
    window.location.href = 'playerName.html';
}

// Function to start the game
function startGame() {
    canvas.style.display = 'block'; // Show the canvas
    resetGame(); // Reset the game state
    displayLeaderboard(); // Display current leaderboard
}

// Draw function to render the game state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(segment.x * 20, segment.y * 20, 18, 18);
    });

    // Draw Food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

// Update function for game logic
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        snake.unshift(head);
        placeFood();
    } else {
        snake.unshift(head);
        snake.pop();
    }

    // Check for collisions with walls or itself
    if (head.x < 0 || head.x >= canvas.width / 20 || head.y < 0 || head.y >= canvas.height / 20 || collision(head)) {
        alert('Game Over! Your score was ' + score);
        saveScore(playerName, score); // Save score with player name
        resetGame();
        displayLeaderboard();
        return; // Stop further execution if game over
    }
}

// Collision detection function
function collision(head) {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Function to place food randomly on the canvas
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 20));
    food.y = Math.floor(Math.random() * (canvas.height / 20));
}

// Reset game state function
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    document.getElementById('score').innerText = score;
}

// Direction change function based on key presses
function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

document.addEventListener('keydown', changeDirection);

// Main game loop function
function gameLoop() {
    draw();
    update();
}

// Start interval for the game loop
setInterval(gameLoop, 100);

// Save score to local storage function
function saveScore(name, newScore) {
    let scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
    
    // Add new score with player name as an object
    scores.push({ name: name, score: newScore });
    
    // Sort scores in descending order and keep top scores only
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only the top ten scores
    if (scores.length > 10) {
        scores = scores.slice(0, 10);
    }
    
    localStorage.setItem('snakeScores', JSON.stringify(scores)); // Save as an array of objects
}

// Display leaderboard function
function displayLeaderboard() {
   const leaderboardList = document.getElementById('leaderboard');
   
   // Clear current leaderboard
   leaderboardList.innerHTML = '';
   
   // Get scores from local storage
   const scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
   
   // Populate leaderboard with names and scores
   scores.forEach((entry) => {
       const li = document.createElement('li');
       li.textContent = `${entry.name}: ${entry.score}`; // Ensure correct display format
       leaderboardList.appendChild(li);
   });
}

// Initialize the game when page loads or refreshes
window.onload = function() {
   startGame(); // Start the game when page loads if player name exists.
};

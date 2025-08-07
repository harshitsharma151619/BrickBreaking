const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');

let score = 0, lives = 3, level = 1;

const paddle = { width: 60, height:3, x: (canvas.width-8)/2, speed: 2 };
const ball = { radius: 5, x: canvas.width/2, y: canvas.height-30, dx: 3, dy: -3 };

let bricks = [];

const brickConfig = { rows: 3, cols: 6, width: 35, height: 10, padding: 8, offsetTop: 10, offsetLeft: 20 };

function createBricks() {
  bricks = [];
  for(let r = 0; r < brickConfig.rows + level-1; r++) {
    for(let c = 0; c < brickConfig.cols; c++) {
      const x = brickConfig.offsetLeft + c*(brickConfig.width + brickConfig.padding);
      const y = brickConfig.offsetTop + r*(brickConfig.height + brickConfig.padding);
      bricks.push({ x, y, status: 1 });
    }
  }
}

function drawBricks() {
  bricks.forEach(b => {
    if(b.status) {
      ctx.fillStyle = 'steelblue';
      ctx.fillRect(b.x, b.y, brickConfig.width, brickConfig.height);
    }
  });
}

function drawPaddle() {
  ctx.fillStyle = 'white';
  ctx.fillRect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  bricks.forEach(b => {
    if(b.status &&
       ball.x > b.x && ball.x < b.x + brickConfig.width &&
       ball.y - ball.radius > b.y && ball.y - ball.radius < b.y + brickConfig.height) {
      ball.dy = -ball.dy;
      b.status = 0;
      score += 10;
      scoreEl.textContent = score;
      if(bricks.every(b2 => b2.status === 0)) {
        level++;
        levelEl.textContent = level;
        ball.dx *= 1; ball.dy *= 1;
        createBricks();
        resetBallAndPaddle();
      }
    }
  });
}

function resetBallAndPaddle(){
  ball.x = canvas.width/2; ball.y = canvas.height-10;
  ball.dx = 2 * (ball.dx > 0 ? 1 : -1);
  ball.dy = -2;
  paddle.x = (canvas.width - paddle.width)/2;
}

function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
  collisionDetection();
  const ease = 0.3;
  paddle.x += (targetPaddleX - paddle.x) * ease;

  ball.x += ball.dx;
  ball.y += ball.dy;

  if(ball.x + ball.dx < ball.radius || ball.x + ball.dx > canvas.width - ball.radius) ball.dx = -ball.dx;
  if(ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
  else if(ball.y + ball.dy > canvas.height - ball.radius){
    if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      lives--;
      livesEl.textContent = lives;
      if(lives==0) {
        alert('Game Over');
        document.location.reload();
      } else {
        resetBallAndPaddle();
      }
    }
  }

  requestAnimationFrame(update);
}

let targetPaddleX = paddle.x;
document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  if (relativeX >= 0 && relativeX <= canvas.width) {
    targetPaddleX = relativeX - paddle.width / 2;
  }
});
createBricks();
update();


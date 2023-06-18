let xAxys = 220;
let yAxys = 420;
let xCount = 0;
let yCount = 0;
let up = false;
let down = false;
let left = false;
let right = false;
let shoot = false;

document.addEventListener("DOMContentLoaded", (event) => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let count_load = 0;
  let bg = new Image();
  bg.src = "images/bg.png";
  let player1 = new Image();
  player1.src = "images/ship.png";
  let bullet = new Image();
  bullet.src = "images/bullet.png";
  let enemy = new Image();
  enemy.src = "images/enemy.png";

  bg.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };

  player1.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };

  bullet.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };

  enemy.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };
});

document.addEventListener("keydown", (event) => {
  up = false;
  down = false;
  right = false;
  left = false;
  xCount = 0;
  yCount = 0;  

  switch (event.key) {
    case "ArrowUp":
      up = true;
      break;

    case "ArrowDown":
      down = true;
      break;

    case "ArrowLeft":
      left = true;
      break;

    case "ArrowRight":
      right = true;
      break;

    case " ":
      shoot = true;
      break;
  }

  if (up && left) {
    xCount = -4;
    yCount = -4;
  } else if (up && right) {
    xCount = 4;
    yCount = -4;
  } else if (down && left) {
    xCount = -4;
    yCount = 4;
  } else if (down && right) {
    xCount = 4;
    yCount = 4;
  } else if (up) {
    yCount = -4;
  } else if (down) {
    yCount = 4;
  } else if (left) {
    xCount = -4;
  } else if (right) {
    xCount = 4;
  }
});

function loaded(count_load, canvas, ctx, bg, player1, bullet, enemy) {
  if (count_load == 4) {
    window.setInterval(() => {
      drawScene(canvas, ctx, bg, player1, bullet, enemy);
    }, 4);
  }
}

function drawScene(canvas, ctx, bg, player1, bullet, enemy) {
  ctx.clearRect(0, 0, 640, canvas.height);
  ctx.fillStyle = "white";

  if(xAxys < 0){
    xAxys = 640;
  }

  if(xAxys > 640){
    xAxys = 0;
  }

  if(yAxys > 480){
    xAxys = 0;
  }

  if(yAxys < 0){
    xAxys = 480;
  }   

  xAxys += xCount;
  yAxys += yCount;

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(player1, xAxys, yAxys);
  ctx.drawImage(enemy, 200, 20);
  ctx.drawImage(bullet, 240, 390);
  ctx.font = "25px Arial";
  ctx.fillText("Life: 3", 10, 40);
}

/* 
Code created by Luiz Nai: https://www.youtube.com/@NaiAdventure
Music: https://www.youtube.com/watch?v=PP_ydA31mZ8&list=RDQMDLoBzDk29ZE&index=38 
*/
document.addEventListener("DOMContentLoaded", (event) => {
  /* Variáveis */
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let explosion = new Audio("audio/explosion.mp3");
  let shot = new Audio("audio/shot.mp3");
  let music = new Audio("audio/music.mp3");
  let xAxys = 220;
  let yAxys = 420;
  let xCount = 0;
  let yCount = 0;
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let shoot = false;
  let pause = false;
  let bulletArray = [];
  let enemyArray = [];
  let ctrlBG1 = -512;
  let ctrlBG2 = 0;
  let ctrlBG3 = 512;
  let life = 1;
  let score = 0;
  let totalEnemies = 5;
  let count_load = 0;
  let bg = new Image();
  let player1 = new Image();
  let bullet = new Image();
  let enemy = new Image();
  let enemy2 = new Image();
  let enemy3 = new Image();

  // Specs
  let playerSpecs = {
    frameWidth: 99,
    frameHeight: 87,
    row: 0,
    column: 0,
  };

  let enemySpecs = {
    frameWidth: 80,
    frameHeight: 58,
    row: 0,
    column: 0,
    ctrlAnimation: 0,
  };

  /* Caminho */
  bg.src = "images/bg.png";
  player1.src = "images/shipAnimated.png";
  bullet.src = "images/bullet.png";
  enemy.src = "images/enemy.png";
  enemy2.src = "images/enemy2.png";
  enemy3.src = "images/enemy3.png";

  /* Controla Volume */
  explosion.volume = 0.2;
  shot.volume = 0.2;
  music.volume = 0.4;
  music.loop = true;

  /* Funções de carregamento */
  bg.onload = checkLoaded();
  player1.onload = checkLoaded();
  bullet.onload = checkLoaded();
  enemy.onload = checkLoaded();
  enemy2.onload = checkLoaded();
  enemy3.onload = checkLoaded();

  /* Função para checar se as imagens foram carregadas */
  function checkLoaded() {
    count_load++;

    if (count_load == 6) {
      music.play();
      window.requestAnimationFrame(drawScene);
    }
  }

  /* funções para resetar as variáveis */
  function resetGame() {
    xAxys = 220;
    yAxys = 420;
    xCount = 0;
    yCount = 0;
    up = false;
    down = false;
    left = false;
    right = false;
    shoot = false;
    pause = false;
    bulletArray = [];
    enemyArray = [];
    ctrlBG1 = -512;
    ctrlBG2 = 0;
    ctrlBG3 = 512;
    life = 3;
    score = 0;
    totalEnemies = 5;
  }

  /* Evento de quando soltamos uma tecla */
  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowUp":
        up = false;
        yCount = 0;
        break;

      case "ArrowDown":
        down = false;
        yCount = 0;
        break;

      case "ArrowLeft":
        left = false;
        xCount = 0;
        break;

      case "ArrowRight":
        right = false;
        xCount = 0;
        break;

      case " ":
        shoot = true;
        shot.pause();
        shot.currentTime = 0;
        shot.play();
        break;

      case "Enter":
        if (life > 0) {
          pause = !pause;
        } else {
          resetGame();
        }
        break;
    }
  });

  /* Evento de quando apertamos alguma tecla */
  document.addEventListener("keydown", (event) => {
    if (!pause) {
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
      }

      if (shoot) {
        bulletArray.push([xAxys + playerSpecs.frameWidth / 2 - 4, yAxys]);
        shoot = false;
      }

      if (up && left) {
        xCount = -2;
        yCount = -4;
      } else if (up && right) {
        xCount = 2;
        yCount = -4;
      } else if (down && left) {
        xCount = -2;
        yCount = 4;
      } else if (down && right) {
        xCount = 2;
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
    }
  });

  /* Controla e mostra BG */
  function ctrlDrawBg() {
    ctx.drawImage(bg, 0, ctrlBG1);
    ctx.drawImage(bg, 0, ctrlBG2);
    ctx.drawImage(bg, 0, ctrlBG3);

    if (!pause) {
      ctrlBG1 += 4;
      ctrlBG2 += 4;
      ctrlBG3 += 4;

      if (ctrlBG1 > 512) {
        ctrlBG1 = -512;
      }

      if (ctrlBG2 > 512) {
        ctrlBG2 = -512;
      }

      if (ctrlBG3 > 512) {
        ctrlBG3 = -512;
      }
    }
  }

  /* Controla e mostra player */
  function ctrlDrawPlayer() {
    if (xAxys < -playerSpecs.frameWidth) {
      xAxys = 512;
    } else if (xAxys > 512) {
      xAxys = -playerSpecs.frameWidth;
    }

    if (yAxys > 512) {
      yAxys = -playerSpecs.frameHeight;
    } else if (yAxys < -playerSpecs.frameHeight) {
      yAxys = 512;
    }

    if (!pause) {
      xAxys += xCount;
      yAxys += yCount;
    }

    playerSpecs.column = playerSpecs.column == 0 ? 1 : 0;

    ctx.drawImage(
      player1,
      playerSpecs.column * playerSpecs.frameWidth,
      playerSpecs.row * playerSpecs.frameHeight,
      playerSpecs.frameWidth,
      playerSpecs.frameHeight,
      xAxys,
      yAxys,
      playerSpecs.frameWidth,
      playerSpecs.frameHeight
    );
  }

  /* Controla e mostra tiros do jogador */
  function ctrlDrawBulletPlayer() {
    bulletArray.forEach((element, index, object) => {
      if (!pause) {
        element[1] = element[1] - 5;
      }

      ctx.drawImage(bullet, element[0], element[1]);

      if (element[1] < 0) {
        object.splice(index, 1);
      }
    });
  }

  /* Controla e mostra inimigo */
  function ctrlDrawEnemy() {
    if (score > totalEnemies * 2) {
      totalEnemies = score++;
    }

    if (enemyArray.length < totalEnemies) {
      enemyArray.push({
        x: randomIntFromInterval(32, 480),
        y: randomIntFromInterval(-1024, 0),
        type: randomIntFromInterval(0, 2),
        _with: enemySpecs.frameWidth,
        _height: enemySpecs.frameHeight,
        alive: true,
        hit: false,
      });
    }

    enemySpecs.ctrlAnimation++;
    enemyArray.forEach((element, index, object) => {
      if (!pause) {
        element.y = element.y + 2;

        if (element.hit) {
          element._with -= 5;
          element._height -= 5;
        }

        if (element._with <= 5 && element._height <= 5) {
          element.alive = false;
        }
      }

      enemySpecs.column = enemySpecs.ctrlAnimation < 5 ? 1 : 0;
      enemySpecs.ctrlAnimation =
        enemySpecs.ctrlAnimation >= 10 ? 0 : enemySpecs.ctrlAnimation;
      let sprite;

      if (element.type == 0) {
        sprite = enemy;
      } else if (element.type == 1) {
        sprite = enemy2;
      } else {
        sprite = enemy3;
      }

      ctx.drawImage(
        sprite,
        enemySpecs.column * enemySpecs.frameWidth,
        enemySpecs.row * enemySpecs.frameHeight,
        enemySpecs.frameWidth,
        enemySpecs.frameHeight,
        element.x,
        element.y,
        element._with,
        element._height
      );

      if (element.y > 512) {
        object.splice(index, 1);
      }
    });
  }

  /* Checa colisão entre dois sprites */
  function checkCollision(elementA, elementB) {
    let xIsColliding = false;
    let yIsColliding = false;

    if (elementA[0] > elementB[0]) {
      if (elementA[0] - elementB[0] < 57) {
        xIsColliding = true;
      }
    } else {
      if (elementB[0] - elementA[0] < 57) {
        xIsColliding = true;
      }
    }

    if (elementA[1] > elementB[1]) {
      if (elementA[1] - elementB[1] < 20) {
        yIsColliding = true;
      }
    } else {
      if (elementB[1] - elementA[1] < 20) {
        yIsColliding = true;
      }
    }

    if (xIsColliding && yIsColliding) {
      return true;
    } else {
      return false;
    }
  }

  /* Função que vai checar todas as colisões */
  function checkAllCollisions() {
    bulletArray.forEach((bullet, index, object) => {
      enemyArray.forEach((enemy, index2, object2) => {
        if (checkCollision(bullet, [enemy.x, enemy.y])) {
          enemy.hit = true;
        }

        if (!enemy.alive) {
          object.splice(index, 1);
          object2.splice(index2, 1);
          score++;
          explosion.pause();
          explosion.currentTime = 0;
          explosion.play();
        }
      });
    });

    enemyArray.forEach((enemy, index, object) => {
      if (checkCollision([xAxys, yAxys], [enemy.x, enemy.y])) {
        object.splice(index, 1);
        life--;
        xAxys = 220;
        yAxys = 420;
        explosion.pause();
        explosion.currentTime = 0;
        explosion.play();
      }
    });
  }

  /* Função que vai retornar um número aleatório entre dois números. */
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /* Função principal do game */
  function drawScene() {
    checkAllCollisions();
    ctx.clearRect(0, 0, 640, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctrlDrawBg();
    if (life > 0) {
      ctrlDrawPlayer();
      ctrlDrawEnemy();
      ctrlDrawBulletPlayer();

      ctx.font = "19px Roboto";
      ctx.fillText("Life: " + life, 10, 30);
      ctx.fillText("Score: " + score, 10, 60);

      if (pause) {
        ctx.fillText("Paused", 230, 256);
      }
    } else {
      ctx.fillText("Game Over", 215, 240);
      ctx.fillText("Score: " + score, 215, 270);
    }

    window.requestAnimationFrame(drawScene);
  }
});

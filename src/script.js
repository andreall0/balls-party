(function () {
  var allBalls = [];
  var previousMouseX = 0;
  var previousMouseY = 0;
  var actualMouseX = 0;
  var actualMouseY = 0;
  var startCreate = 0;
  var selectedTheme = 0;
  var speedBackground = 30;
  var speedModifier = 0;
  var maxBallSize = 210;
  var minBallSize = 10;
  var ballSize = (maxBallSize - minBallSize) / 2.5;
  var intervalMoveBallsId = 0;
  var removeBallDuration = 500;
  var infoMessage = true;
  var IdSetTimout = [];
  var body = document.getElementsByTagName("body")[0];
  var ballsContainer = document.getElementsByClassName("balls-container")[0];
  var mouseFollower = document.getElementsByClassName("mouse-follower")[0];
  var wrapperElement = document.getElementsByClassName("wrapper")[0];
  var imageCircle = document.getElementsByClassName("image-circle");
  var buttonStart = document.getElementsByClassName("button")[0];
  var infoText = document.getElementsByClassName("info-text")[0];
  var overlayLoader = document.getElementsByClassName("overlay-loader")[0];

  addEventAnimation();

  function addEventAnimation() {
    for (var i = 0; i < imageCircle.length; i++) {
      imageCircle[i].addEventListener("click", selectedCircle);
      imageCircle[i].addEventListener("mouseover", addMouseCircle);
      imageCircle[i].addEventListener("mouseout", removeMouseCircle);
    }

    buttonStart.addEventListener("click", start);
    buttonStart.addEventListener("mouseover", addMouseCircle);
    buttonStart.addEventListener("mouseout", removeMouseCircle);

    document.addEventListener("mousemove", mousePosition);
    document.addEventListener("touchmove", mousePosition);
  }

  function selectedCircle() {
    switch (this.id) {
      case "all":
        selectedTheme = 0;
        break;
      case "billiard":
        selectedTheme = 1;
        break;
      case "dragonball":
        selectedTheme = 2;
        break;
      case "emoticons":
        selectedTheme = 3;
        break;
      case "fruits":
        selectedTheme = 4;
        break;
      case "hearts":
        selectedTheme = 5;
        break;
      case "pokeballs":
        selectedTheme = 6;
        break;
      case "sheeps":
        selectedTheme = 7;
        break;
      case "simple-balls":
        selectedTheme = 8;
        break;
      case "soap-bubbles":
        selectedTheme = 9;
        break;
      case "sports":
        selectedTheme = 10;
        break;
    }

    for (var i = 0; i < imageCircle.length; i++) {
      imageCircle[i].classList.remove("selected");
    }

    this.className = "image-circle selected";
  }

  function calcBackgroundPositionBall(
    backgroundPositionX,
    backgroundPositionY
  ) {
    var string = "0 0";

    string =
      backgroundPositionX * ballSize * -1 +
      "px " +
      backgroundPositionY * ballSize * -1 +
      "px";

    return string;
  }

  function instruction() {
    infoText.style.display = "inline";

    var idInfo1 = setTimeout(function () {
      infoText.style.display = "none";
      infoText.innerHTML = "Press arrows!";
    }, 10000);
    var idInfo2 = setTimeout(function () {
      infoText.style.display = "inline";
    }, 11000);
    var idInfo3 = setTimeout(function () {
      infoText.style.display = "none";
      infoText.innerHTML = "Press esc!";
    }, 20000);
    var idInfo4 = setTimeout(function () {
      infoText.style.display = "inline";
      infoMessage = false;
    }, 21000);

    IdSetTimout.push(idInfo1, idInfo2, idInfo3, idInfo4);
  }
  function removeInstruction() {
    infoMessage = false;

    IdSetTimout.forEach(function (elem) {
      clearTimeout(elem);
    });
  }

  function start() {
    intervalMoveBallsId = setInterval(moveBalls, 10);
    overlayLoader.style.display = "block";

    if (infoMessage) {
      instruction();
    }

    setTimeout(() => {
      wrapperElement.style.display = "none";
    }, 1000);

    setTimeout(() => {
      document.addEventListener("mouseup", stopCreateBall);
      document.addEventListener("touchend", stopCreateBall);
      document.addEventListener("mousedown", startCreateBall);
      document.addEventListener("touchstart", startCreateBall);
      document.addEventListener("keydown", pressButton);
    }, 2000);
  }

  function startCreateBall(event) {
    var ball = {
      numberId: "ball-" + allBalls.length,
      left: getLeftPositionBall(),
      top: getTopPositionBall(),
      xSpeed: getSpeedX(),
      ySpeed: getSpeedY(),
      directionRight: getDirectionRight(),
      directionDown: getDirectionDown(),
      backgroundPositionY: getBackgroundPositionY(),
    };
    ball.backgroundPositionX = getBackgroundPositionX(ball.backgroundPositionY);

    allBalls.push(ball);

    newBall = document.createElement("div");
    newBall.style.left = ball.left;
    newBall.style.top = ball.top;
    newBall.style.width = ballSize + "px";
    newBall.style.height = ballSize + "px";
    newBall.id = ball.numberId;
    newBall.className = "ball";
    newBall.style.backgroundPosition = calcBackgroundPositionBall(
      ball.backgroundPositionX,
      ball.backgroundPositionY
    );

    ballsContainer.appendChild(newBall);

    startCreate = setInterval(function () {
      var ball = {
        numberId: "ball-" + allBalls.length,
        left: getLeftPositionBall(),
        top: getTopPositionBall(),
        xSpeed: getSpeedX(),
        ySpeed: getSpeedY(),
        directionRight: getDirectionRight(),
        directionDown: getDirectionDown(),
        backgroundPositionY: getBackgroundPositionY(),
      };
      ball.backgroundPositionX = getBackgroundPositionX(
        ball.backgroundPositionY
      );

      allBalls.push(ball);

      newBall = document.createElement("div");
      newBall.style.left = ball.left;
      newBall.style.top = ball.top;
      newBall.style.width = ballSize + "px";
      newBall.style.height = ballSize + "px";
      newBall.id = ball.numberId;
      newBall.className = "ball";
      newBall.style.backgroundPosition = calcBackgroundPositionBall(
        ball.backgroundPositionX,
        ball.backgroundPositionY
      );

      ballsContainer.appendChild(newBall);
    }, 100);
  }

  function stopCreateBall() {
    clearInterval(startCreate);
  }

  function moveBackground() {
    body.style.backgroundPositionX =
      50 - (window.innerWidth / 2 - actualMouseX) / speedBackground + "%";
    body.style.backgroundPositionY =
      50 - (window.innerHeight / 2 - actualMouseY) / speedBackground + "%";
  }

  function moveMouseFollower() {
    mouseFollower.style.top = actualMouseY - 10 + "px";
    mouseFollower.style.left = actualMouseX - 10 + "px";
  }

  function addMouseCircle() {
    mouseFollower.classList.add("circle");
  }

  function removeMouseCircle() {
    mouseFollower.classList.remove("circle");
  }

  function mousePosition(event) {
    actualMouseX = event.touches ? event.touches[0].clientX : event.clientX;
    actualMouseY = event.touches ? event.touches[0].clientY : event.clientY;

    setTimeout(function () {
      previousMouseX = event.touches ? event.touches[0].clientX : event.clientX;
      previousMouseY = event.touches ? event.touches[0].clientY : event.clientY;
    }, 20);

    moveBackground();
    moveMouseFollower();
  }

  function getLeftPositionBall() {
    var xPosition = actualMouseX;
    var left = xPosition - ballSize / 2;

    return left;
  }

  function getTopPositionBall() {
    var yPosition = actualMouseY;
    var top = yPosition - ballSize / 2;

    return top;
  }

  function getSpeedX() {
    var xSpeed = 0;

    xSpeed = Math.abs(actualMouseX - previousMouseX) / 3;

    if (xSpeed > 4) {
      xSpeed = 4;
    }

    return xSpeed;
  }

  function getSpeedY() {
    var ySpeed = 0;

    ySpeed = Math.abs(actualMouseY - previousMouseY) / 3;

    if (ySpeed > 4) {
      ySpeed = 4;
    }

    return ySpeed;
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getBackgroundPositionX(backgroundPositionY) {
    var positionNumberBall = 0;
    var min = 0;
    var max = 10;

    switch (backgroundPositionY) {
      case 1:
        max = 16;
        positionNumberBall = randomNumber(min, max);
        break;
      case 2:
        max = 7;
        positionNumberBall = randomNumber(min, max);
        break;
      case 3:
        max = 5;
        positionNumberBall = randomNumber(min, max);
        break;
      case 4:
        max = 5;
        positionNumberBall = randomNumber(min, max);
        break;
      case 5:
        max = 5;
        positionNumberBall = randomNumber(min, max);
        break;
      case 6:
        max = 5;
        positionNumberBall = randomNumber(min, max);
        break;
      case 7:
        max = 14;
        positionNumberBall = randomNumber(min, max);
        break;
      case 8:
        max = 7;
        positionNumberBall = randomNumber(min, max);
        break;
      case 9:
        max = 4;
        positionNumberBall = randomNumber(min, max);
        break;
      case 10:
        max = 5;
        positionNumberBall = randomNumber(min, max);
        break;
    }

    return positionNumberBall;
  }

  function getBackgroundPositionY() {
    var positionTheme = selectedTheme;
    var min = 1;
    var max = 10;

    if (positionTheme == 0) {
      positionTheme = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return positionTheme;
  }

  function getDirectionRight() {
    if (actualMouseX - previousMouseX > 0) {
      return true;
    } else {
      return false;
    }
  }

  function getDirectionDown() {
    if (actualMouseY - previousMouseY > 0) {
      return true;
    } else {
      return false;
    }
  }

  function moveBalls() {
    for (var i = 0; i < allBalls.length; i++) {
      var numberIdSelectBall = allBalls[i].numberId;
      var leftSelectBall = allBalls[i].left;
      var topSelectBall = allBalls[i].top;
      var newLeftSelectBall = 0;
      var newTopSelectBall = 0;

      for (var j = 0; j < allBalls.length; j++) {
        if (j != i) {
          if (allBalls[i].directionDown == true) {
            if (
              topSelectBall + ballSize >= allBalls[j].top &&
              topSelectBall + ballSize <= allBalls[j].top + ballSize &&
              leftSelectBall >= allBalls[j].left - ballSize &&
              leftSelectBall <= allBalls[j].left + ballSize
            ) {
              allBalls[i].directionDown = false;
              allBalls[j].directionDown = true;
            }
          }

          if (allBalls[i].directionDown == false) {
            if (
              topSelectBall <= allBalls[j].top + ballSize &&
              topSelectBall >= allBalls[j].top &&
              leftSelectBall >= allBalls[j].left - ballSize &&
              leftSelectBall <= allBalls[j].left + ballSize
            ) {
              allBalls[i].directionDown = true;
              allBalls[j].directionDown = false;
            }
          }

          if (allBalls[i].directionRight == true) {
            if (
              leftSelectBall + ballSize >= allBalls[j].left &&
              leftSelectBall + ballSize <= allBalls[j].left + ballSize &&
              topSelectBall >= allBalls[j].top - ballSize &&
              topSelectBall <= allBalls[j].top + ballSize
            ) {
              allBalls[i].directionRight = false;
              allBalls[j].directionRight = true;
            }
          }

          if (allBalls[i].directionRight == false) {
            if (
              leftSelectBall <= allBalls[j].left + ballSize &&
              leftSelectBall >= allBalls[j].left &&
              topSelectBall >= allBalls[j].top - ballSize &&
              topSelectBall <= allBalls[j].top + ballSize
            ) {
              allBalls[i].directionRight = true;
              allBalls[j].directionRight = false;
            }
          }
        }
      }

      if (allBalls[i].directionDown == true) {
        newTopSelectBall = topSelectBall + allBalls[i].ySpeed + speedModifier;
      } else {
        newTopSelectBall = topSelectBall - allBalls[i].ySpeed - speedModifier;
      }

      if (allBalls[i].directionRight == true) {
        newLeftSelectBall = leftSelectBall + allBalls[i].xSpeed + speedModifier;
      } else {
        newLeftSelectBall = leftSelectBall - allBalls[i].xSpeed - speedModifier;
      }

      if (newLeftSelectBall < 0) {
        allBalls[i].directionRight = true;
      }

      if (
        newLeftSelectBall >
        window.innerWidth - (ballSize + allBalls[i].xSpeed + speedModifier)
      ) {
        allBalls[i].directionRight = false;
      }

      if (newTopSelectBall < 0) {
        allBalls[i].directionDown = true;
      }

      if (
        newTopSelectBall >
        window.innerHeight - (ballSize + allBalls[i].ySpeed + speedModifier)
      ) {
        allBalls[i].directionDown = false;
      }

      ballsContainer.querySelector("#" + numberIdSelectBall).style.left =
        newLeftSelectBall + "px";
      ballsContainer.querySelector("#" + numberIdSelectBall).style.top =
        newTopSelectBall + "px";
      allBalls[i].left = newLeftSelectBall;
      allBalls[i].top = newTopSelectBall;
    }
  }

  function removeBalls(seconds) {
    allBalls.map((item, index) => {
      item.ySpeed = 0;
      item.xSpeed = 0;
      document.getElementById(item.numberId).style.animation =
        "fadeOut " +
        removeBallDuration / 1000 +
        "s " +
        (seconds * index) / allBalls.length / 1000 +
        "s ease-in-out both";
    });
  }

  function pressButton(event) {
    var keyCode = event.keyCode;

    if (keyCode == 27) {
      var removeBallsInSeconds = allBalls.length < 5 ? 300 : 1000;

      removeBalls(removeBallsInSeconds);
      clearInterval(intervalMoveBallsId);
      document.removeEventListener("mousedown", startCreateBall);
      document.removeEventListener("touchstart", startCreateBall);
      document.removeEventListener("mouseup", stopCreateBall);
      document.removeEventListener("touchend", stopCreateBall);
      document.removeEventListener("keydown", pressButton);

      removeInstruction();
      infoText.style.display = "none";
      overlayLoader.style.display = "none";
      infoText.innerHTML = "CLICK!";

      setTimeout(() => {
        ballsContainer.innerHTML = "";
        allBalls = [];
        speedModifier = 0;
        ballSize = (maxBallSize - minBallSize) / 2.5;

        wrapperElement.style.display = "flex";
      }, removeBallsInSeconds + removeBallDuration);
    }

    if (keyCode == 39 && speedModifier < 10) {
      speedModifier += 1;
    } else if (keyCode == 37 && speedModifier > 0) {
      speedModifier -= 1;
    }

    if (keyCode == 38 || keyCode == 40) {
      if (keyCode == 38 && ballSize < maxBallSize) {
        ballSize += 10;
      } else if (keyCode == 40 && ballSize > minBallSize) {
        ballSize -= 10;
      }

      for (var i = 0; i < allBalls.length; i++) {
        var ball = ballsContainer.querySelector("#" + allBalls[i].numberId);
        ball.style.width = ballSize + "px";
        ball.style.height = ballSize + "px";
        ball.style.backgroundPosition = calcBackgroundPositionBall(
          allBalls[i].backgroundPositionX,
          allBalls[i].backgroundPositionY
        );
      }
    }
  }
})();

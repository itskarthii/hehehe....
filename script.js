let caughtStars = 0;
let starInterval;
let scene = 0;
let climbStep = 0;

/* 🎵 MUSIC MANAGEMENT */
let musicStarted = false;

function playStarMusic() {
  if (!musicStarted) {
    const bgMusic = document.getElementById("bgMusic");
    const birthdayMusic = document.getElementById("birthdayMusic");
    bgMusic.volume = 0.4;
    bgMusic.play().catch(e => console.log("Music blocked:", e));
    birthdayMusic.pause();
    musicStarted = true;
  }
}

function playBirthdayMusic() {
  const bgMusic = document.getElementById("bgMusic");
  const birthdayMusic = document.getElementById("birthdayMusic");

  bgMusic.pause();
  bgMusic.currentTime = 0;

  birthdayMusic.volume = 0.35;
  birthdayMusic.play().catch(e => console.log("Birthday music blocked:", e));
}

/* ------------------ STARS ------------------ */
function createStars() {
  const box = document.getElementById("stars");
  for (let i = 0; i < 60; i++) {
    let s = document.createElement("div");
    s.className = "star";
    s.innerText = "✨";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    box.appendChild(s);
  }
}

function addChoice(text, next) {
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.onclick = () => {
    if (next === "comet") startCometRide();
    else if (next === "climb") startClimb();
    else if (next === "starGame") startStarRescue();
    else if (next === "birthday") showBirthdayMessage();
    else {
      scene = next;
      showScene();
    }
  };
  document.getElementById("choices").appendChild(btn);
}

function showScene() {
  const text = document.getElementById("sceneText");
  const choices = document.getElementById("choices");
  choices.innerHTML = "";

  if (scene == 0) {
    text.innerHTML = "🌙 The Moon needs help preparing a magical birthday night!";
    addChoice("Help the Moon ⭐", 1);
    addChoice("Go to sleep 😴", 0);
  }

  if (scene == 1) {
    text.innerHTML = "⭐ Catch 5 falling stars!";
    startStarGame();
  }

  if (scene == 2) {
    text.innerHTML = "☄️ Choose your ride across the sky!";
    addChoice("Ride a comet", "comet");
    addChoice("Ride a cloud (wrong)", 1);
  }

  if (scene == 3) {
    text.innerHTML = "🏔️ You reach the magical mountain!";
    addChoice("Start climbing", "climb");
  }

  if (scene == 5) {
    text.innerHTML = "⭐ A lost little star is fading on the mountain...";
    addChoice("Help the star glow again ✨", "starGame");
  }

  if (scene == 7) {
    text.innerHTML = "✨ The star shines brightly and thanks you.";
    addChoice("Continue to the camp 🏞️", 8);
  }

  if (scene == 8) {
    text.innerHTML = "🏞️ The mountain range glows under the night sky...";
    document.getElementById("choices").innerHTML = "";

    const stars = document.querySelectorAll(".star, .fallingStar");
    stars.forEach(s => {
      s.style.transition = "transform 1s, text-shadow 1s, opacity 1s";
    });

    let shimmerCount = 0;
    const shimmerInterval = setInterval(() => {
      stars.forEach(s => {
        s.style.transform = `scale(${1 + Math.random() * 0.2})`;
        s.style.textShadow = `0 0 ${5 + Math.random() * 10}px #fff, 0 0 ${5 + Math.random() * 5}px #ffd700`;
      });
      shimmerCount++;
      if (shimmerCount > 12) clearInterval(shimmerInterval);
    }, 300);

    setTimeout(() => {
      startCampScene();
    }, 4000);
  }
}

/* ------------------ STAR CATCH ------------------ */
function startStarGame() {
  document.getElementById("choices").innerHTML = "";
  caughtStars = 0;

  starInterval = setInterval(() => {
    let star = document.createElement("div");
    star.className = "fallingStar";
    star.innerText = "⭐";
    star.style.left = Math.random() * 90 + "vw";
    document.getElementById("game").appendChild(star);

    star.onclick = () => {
      star.remove();
      caughtStars++;
      document.getElementById("sceneText").innerHTML =
        "⭐ Stars collected: " + caughtStars + " / 5";
      if (caughtStars >= 5) {
        clearInterval(starInterval);
        scene = 2;
        showScene();
      }
    };
    setTimeout(() => star.remove(), 5000);
  }, 800);
}

/* ------------------ COMET RIDE ------------------ */
function startCometRide() {
  const game = document.getElementById("game");
  document.querySelectorAll(".fallingStar, .rock").forEach(e => e.remove());

  const comet = document.createElement("div");
  comet.className = "comet";
  comet.innerText = "☄️";
  comet.style.top = "30%";

  const trail = document.createElement("div");
  trail.className = "cometTrail";
  trail.style.top = "35%";

  game.appendChild(comet);
  game.appendChild(trail);

  const start = performance.now();
  const duration = 3000;

  function animate(timestamp) {
    const progress = (timestamp - start) / duration;
    if (progress < 1) {
      const x = -60 + progress * (window.innerWidth + 120);
      const y = 30 + Math.sin(progress * Math.PI * 2) * 20;
      comet.style.left = x + "px";
      comet.style.top = y + "%";
      trail.style.left = x - 80 + "px";
      trail.style.top = y + 5 + "%";
      comet.style.transform = `rotate(${progress * 720}deg)`;
      requestAnimationFrame(animate);
    } else {
      comet.remove();
      trail.remove();
      scene = 3;
      showScene();
    }
  }
  requestAnimationFrame(animate);
}

/* ------------------ CLIMBING ------------------ */
function startClimb() {
  const game = document.getElementById("game");
  document.getElementById("choices").innerHTML = "";
  climbStep = 0;
  document.getElementById("sceneText").innerHTML =
    "🏔️ Click the glowing rocks to climb!";
  spawnRocks();
}

function spawnRocks() {
  const game = document.getElementById("game");
  document.querySelectorAll(".rock").forEach(r => r.remove());
  let correct = Math.floor(Math.random() * 3);

  for (let i = 0; i < 3; i++) {
    let rock = document.createElement("div");
    rock.className = "rock";
    rock.innerText = "🪨";
    rock.style.left = 20 + i * 25 + "%";
    rock.style.bottom = 100 + climbStep * 60 + "px";
    rock.style.fontSize = "35px";
    rock.style.opacity = "0.7";

    if (i === correct) rock.classList.add("glowRock");

    rock.onclick = () => {
      if (i === correct) {
        climbStep++;
        if (climbStep >= 4) {
          document.querySelectorAll(".rock").forEach(r => r.remove());
          scene = 5;
          showScene();
        } else spawnRocks();
      } else {
        document.getElementById("sceneText").innerHTML =
          "😵 Wrong rock! Try again!";
      }
    };
    game.appendChild(rock);
  }
}

/* ------------------ STAR RESCUE ------------------ */
function startStarRescue() {
  const game = document.getElementById("game");
  document.getElementById("choices").innerHTML = "";
  document.querySelectorAll(".fallingStar, .rock").forEach(e => e.remove());

  let star = document.createElement("div");
  star.innerText = "⭐";
  star.style.position = "absolute";
  star.style.fontSize = "70px";
  star.style.top = "25%";
  star.style.left = "48%";
  star.style.opacity = 0.3;
  star.style.cursor = "pointer";
  game.appendChild(star);

  const sceneText = document.getElementById("sceneText");
  sceneText.innerHTML = "✨ Tap quickly to restore the star's light!";

  let energy = 0;

  star.onclick = () => {
    energy++;
    if (energy > 8) energy = 8;

    star.style.opacity = 0.3 + energy * 0.12;
    star.style.transform = `scale(${1 + energy * 0.1})`;

    if (energy >= 8) {
      sceneText.innerHTML =
        "🌟 The star shines brilliantly and says: 'Thank you!'";
      setTimeout(() => {
        star.remove();
    scene = 7;
        showScene();
      }, 3000);
    }
  };
}

/* ------------------ FINAL CAMP / MOON / BIRTHDAY ------------------ */
function startCampScene() {
  const game = document.getElementById("game");
  const text = document.getElementById("sceneText");
  const choices = document.getElementById("choices");

  text.innerHTML = "";
  choices.innerHTML = "";

  function showBirthdayMsg() {
    let msg = document.createElement("div");
    msg.innerHTML = `Happiest bdy wishes annammeee... ❤️✨<br>
Hope today is as calm and beautiful<br>
as a night with the moon 🌙<br>`;
    msg.style.position = "absolute";
    msg.style.top = "25%";
    msg.style.width = "100%";
    msg.style.textAlign = "center";
    msg.style.fontSize = "22px";
    msg.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
    msg.style.color = "#fff";
    msg.style.opacity = "0";
    msg.style.transition = "opacity 3s";
    msg.style.zIndex = "8";
    game.appendChild(msg);

    setTimeout(() => (msg.style.opacity = "1"), 100);

    setTimeout(() => {
      playBirthdayMusic();
    }, 100);

    msg.addEventListener(
      "click",
      function proceed() {
        msg.style.opacity = "0";
        setTimeout(() => {
          msg.remove();
          showCakeScene();
        }, 500);
        msg.removeEventListener("click", proceed);
      },
      { once: true }
    );
  }

  function showCakeScene() {
    let cakeContainer = document.createElement("div");
    cakeContainer.style.position = "absolute";
    cakeContainer.style.top = "50%";
    cakeContainer.style.left = "50%";
    cakeContainer.style.transform = "translate(-50%, -50%)";
    cakeContainer.style.textAlign = "center";
    cakeContainer.style.zIndex = "7";
    game.appendChild(cakeContainer);

    let cake = document.createElement("div");
    cake.innerHTML = "🎂";
    cake.style.fontSize = "180px";
    cake.style.cursor = "pointer";
    cakeContainer.appendChild(cake);

    cake.addEventListener("click", () => {
      cake.remove();

      let mockery = document.createElement("div");
      mockery.innerHTML = `surprise engane kollavo , hehehe... 😁<br>pinna 20 vayass kelavi aayi... 👵`;
      mockery.style.position = "absolute";
      mockery.style.top = "45%";
      mockery.style.width = "100%";
      mockery.style.textAlign = "center";
      mockery.style.fontSize = "22px";
      mockery.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
      mockery.style.color = "#fff";
      mockery.style.opacity = "0";
      mockery.style.transition = "opacity 2s";
      mockery.style.zIndex = "9";
      game.appendChild(mockery);

      setTimeout(() => {
        mockery.style.opacity = "1";
      }, 100);
    });
  }

  showBirthdayMsg();
}

createStars();
showScene();

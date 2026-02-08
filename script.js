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
    playStarMusic(); // 🎵 play starry theme

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
        s.style.textShadow = `0 0 ${5 + Math.random() * 10}px #fff, 0 0 ${
          5 + Math.random() * 5
        }px #ffd700`;
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
    if (energy > 5) energy = 5;

    star.style.opacity = 0.3 + energy * 0.12;
    star.style.transform = `scale(${1 + energy * 0.1})`;

    if (energy >= 5) {
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

  let moon, moonMsg;

  // 🌄 Mountain silhouette
  let mountains = document.createElement("div");
  mountains.style.position = "absolute";
  mountains.style.bottom = "0";
  mountains.style.width = "100%";
  mountains.style.height = "40%";
  mountains.style.background = "#000";
  mountains.style.clipPath = `
    polygon(
      0% 100%, 
      8% 70%, 
      18% 85%, 
      30% 60%, 
      45% 80%, 
      60% 55%, 
      75% 75%, 
      90% 65%, 
      100% 100%
    )
  `;
  mountains.style.opacity = "0";
  mountains.style.transition = "opacity 3s ease";
  mountains.style.zIndex = "5";
  game.appendChild(mountains);
  setTimeout(() => (mountains.style.opacity = "1"), 100);

  // 🌕 Moon rise
  setTimeout(() => {
    moon = document.createElement("div");
    moon.innerText = "🌕";
    moon.style.position = "absolute";
    moon.style.top = "8%";
    moon.style.left = "45%";
    moon.style.fontSize = "130px";
    moon.style.opacity = "0";
    moon.style.transform = "translateY(-180px) scale(0.95)";
    moon.style.transition =
      "transform 9s cubic-bezier(0.22,1,0.36,1), filter 9s ease, opacity 5s ease";
    moon.style.filter = "drop-shadow(0 0 0px white)";
    moon.style.zIndex = "4";
    game.appendChild(moon);

    moonMsg = document.createElement("div");
    moonMsg.innerHTML =
      "Thanks for helping the lost star! In exchange, I prepared a surprise for you 🌙";
    moonMsg.style.position = "absolute";
    moonMsg.style.top = "15%";
    moonMsg.style.width = "100%";
    moonMsg.style.textAlign = "center";
    moonMsg.style.fontSize = "22px";
    moonMsg.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
    moonMsg.style.color = "#fff";
    moonMsg.style.opacity = "0";
    moonMsg.style.transition = "opacity 4s ease";
    moonMsg.style.zIndex = "5";
    game.appendChild(moonMsg);

    requestAnimationFrame(() => {
      moon.style.opacity = "1";
      moon.style.transform = "translateY(0) scale(1)";
      moon.style.filter = "drop-shadow(0 0 60px white)";
      document.body.style.background =
        "radial-gradient(circle at top,#1e3c72,#0f2027)";
    });

    // Show moon message → fade out → birthday message
    setTimeout(() => {
      moonMsg.style.opacity = "1"; // fade in
      setTimeout(() => {
        moonMsg.style.opacity = "0"; // fade out
        setTimeout(() => {
          moon.style.opacity = "0"; // fade moon
          showBirthdayMsg();
        }, 1200);
      }, 6000); // visible for 6s
    }, 10000); // after moon rise
  }, 100);

  // ------------------ Birthday Message ------------------
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

    // 🎵 Play birthday music when message shows
    setTimeout(() => {
      playBirthdayMusic();
    }, 100);

    // One click → fade birthday msg → cake scene
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

  // ------------------ Cake Scene ------------------
  function showCakeScene() {
    // ☄️ Comet
    let comet = document.createElement("div");
    comet.innerText = "☄️";
    comet.style.position = "absolute";
    comet.style.top = "-50px";
    comet.style.left = "70%";
    comet.style.fontSize = "40px";
    comet.style.opacity = "0.6";
    comet.style.transition = "transform 4s linear, opacity 4s";
    comet.style.zIndex = "2";
    game.appendChild(comet);
    requestAnimationFrame(() => {
      comet.style.transform = "translate(-300px,500px)";
      comet.style.opacity = "0";
    });

    // Cake container
    let cakeContainer = document.createElement("div");
    cakeContainer.style.position = "absolute";
    cakeContainer.style.top = "50%";
    cakeContainer.style.left = "50%";
    cakeContainer.style.transform = "translate(-50%, -50%)"; // center
    cakeContainer.style.textAlign = "center";
    cakeContainer.style.zIndex = "7";
    game.appendChild(cakeContainer);

    // Instruction above cake
    let wish = document.createElement("div");
    wish.innerHTML = "Make a wish ✨<br>Blow out the candle by touching it…";
    wish.style.marginBottom = "10px"; // above cake
    wish.style.fontSize = "22px";
    wish.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
    wish.style.color = "#fff";
    wish.style.opacity = "0";
    wish.style.transition = "opacity 2s";
    wish.style.zIndex = "8";
    cakeContainer.appendChild(wish);

    // Cake emoji (tap on it to blow candle)
    let cake = document.createElement("div");
    cake.innerHTML = "🎂";
    cake.style.fontSize = "180px"; // bigger cake
    cake.style.opacity = "0";
    cake.style.transition = "opacity 2s";
    cake.style.cursor = "pointer";
    cake.style.marginTop = "10px"; // below instruction
    cakeContainer.appendChild(cake);

    setTimeout(() => {
      cake.style.opacity = "1";
      wish.style.opacity = "1";
    }, 200);

    // Tap cake → blow out → fade cake → show mockery
    cake.addEventListener(
      "click",
      () => {
        cake.style.opacity = "0";
        wish.style.opacity = "0";
        setTimeout(() => {
          // Stop all music for final mockery
          document.getElementById("bgMusic").pause();
          document.getElementById("birthdayMusic").pause();

          let mockery = document.createElement("div");
          mockery.innerHTML = `surprise engane kollavo , hehehe... 😁<br>pinna 20 vayass kelavi aayi... 👵`;
          mockery.style.position = "absolute";
          mockery.style.top = "45%"; // slightly higher
          mockery.style.width = "100%";
          mockery.style.textAlign = "center";
          mockery.style.fontSize = "22px";
          mockery.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
          mockery.style.color = "#fff";
          mockery.style.opacity = "0";
          mockery.style.transition = "opacity 3s";
          mockery.style.zIndex = "9";
          game.appendChild(mockery);
          setTimeout(() => (mockery.style.opacity = "1"), 500);
        }, 500);
      },
      { once: true }
    );
  }
}
// Force audio to unlock on first click anywhere
document.addEventListener("click", function unlockAudio() {
  const bgMusic = document.getElementById("bgMusic");
  const birthdayMusic = document.getElementById("birthdayMusic");

  bgMusic.play().then(() => {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }).catch(() => {});

  birthdayMusic.play().then(() => {
    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;
  }).catch(() => {});

  document.removeEventListener("click", unlockAudio);
});

createStars();
showScene();

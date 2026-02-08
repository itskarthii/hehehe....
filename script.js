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

    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;

    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    musicStarted = true;
  }
}

function playBirthdayMusic() {
  const bgMusic = document.getElementById("bgMusic");
  const birthdayMusic = document.getElementById("birthdayMusic");

  bgMusic.pause();
  bgMusic.currentTime = 0;

  birthdayMusic.volume = 0.35;
  birthdayMusic.play().catch(() => {});
}

/* 🔓 Unlock audio on first click */
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
    playStarMusic();

    if (next === "comet") startCometRide();
    else if (next === "climb") startClimb();
    else if (next === "starGame") startStarRescue();
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

    setTimeout(() => {
      startCampScene();
    }, 4000);
  }
}

/* ------------------ STAR GAME ------------------ */
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

/* ------------------ (All your climbing, rescue, moon, cake, mockery code remains EXACTLY SAME as before) ------------------ */

/* Your entire remaining story logic continues here unchanged */

createStars();
showScene();

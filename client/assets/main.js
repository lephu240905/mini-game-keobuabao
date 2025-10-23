const screens = {
  home: document.getElementById("home-screen"),
  game: document.getElementById("game-screen"),
};
const playerNameInput = document.getElementById("player-name");
const createRoomBtn = document.getElementById("create-room-btn");
const joinRoomBtn = document.getElementById("join-room-btn");
const playCpuBtn = document.getElementById("play-cpu-btn");
const backToMenuBtn = document.getElementById("back-to-menu-btn");
const roomCodeInput = document.getElementById("room-code-input");
const errorMessageDiv = document.getElementById("error-message");
const roomCodeDisplayWrapper = document.getElementById(
  "room-code-display-wrapper"
);
const roomCodeDisplay = document.getElementById("room-code-display");
const resultDisplay = document.getElementById("result-display");
const choiceBtns = document.querySelectorAll(".choice-btn");
const chatForm = document.getElementById("chat-input-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const avatarUploadInput = document.getElementById("avatar-upload-input");
const timerDisplay = document.getElementById("timer-display"); // Lấy phần tử đồng hồ

const playerElements = {
  p1: {
    card: document.getElementById("player1-card"),
    avatar: document.getElementById("p1-avatar"),
    name: document.getElementById("p1-name"),
    streak: document.getElementById("p1-streak"),
    choice: document.getElementById("p1-choice"),
    status: document.querySelector("#p1-choice .player-status"),
  },
  p2: {
    card: document.getElementById("player2-card"),
    avatar: document.getElementById("p2-avatar"),
    name: document.getElementById("p2-name"),
    streak: document.getElementById("p2-streak"),
    choice: document.getElementById("p2-choice"),
    status: document.querySelector("#p2-choice .player-status"),
  },
};
const sounds = {
  win: document.getElementById("sound-win"),
  lose: document.getElementById("sound-lose"),
  draw: document.getElementById("sound-draw"),
  chat: document.getElementById("sound-chat"),
  choice: document.getElementById("sound-choice"),
  background: document.getElementById("sound-background"),
};

let ws,
  localPlayerInfo = { name: "", avatar: "😀" },
  roomState = {},
  backgroundMusicStarted = false,
  gameMode = "online",
  customAvatarData = null;

let afkCountdownInterval = null; // Biến cho interval
function startAfkCountdown() {
  stopAfkCountdown(); // Dừng timer cũ trước khi bắt đầu timer mới
  let timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  timerDisplay.classList.add("visible");

  afkCountdownInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      stopAfkCountdown();
    }
  }, 1000);
}
function stopAfkCountdown() {
  if (afkCountdownInterval) {
    clearInterval(afkCountdownInterval);
  }
  timerDisplay.classList.remove("visible");
}
function showScreen(screenName) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[screenName].classList.add("active");
}
function displayError(message) {
  errorMessageDiv.textContent = message;
  setTimeout(() => (errorMessageDiv.textContent = ""), 3000);
}

function getPlayerInfoFromDOM() {
  const name = playerNameInput.value.trim();
  if (!name) {
    displayError("Vui lòng nhập tên của bạn.");
    return null;
  }
  const selectedAvatarEl = document.querySelector(".selected");
  if (selectedAvatarEl.id === "custom-avatar-preview" && customAvatarData) {
    return { name, avatar: customAvatarData };
  }
  const avatar = selectedAvatarEl.dataset.avatar;
  return { name, avatar };
}

function createMessage(type, payload) {
  return JSON.stringify({ type, payload });
}

function playBackgroundMusic() {
  if (!backgroundMusicStarted) {
    sounds.background.volume = 0.5;
    sounds.background
      .play()
      .catch((e) => console.log("Lỗi khi phát nhạc nền:", e));
    backgroundMusicStarted = true;
  }
}

function connectWebSocket(onOpenCallback) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    onOpenCallback();
    return;
  }
  const serverUrl = `ws://localhost:8080`;
  ws = new WebSocket(serverUrl);
  ws.onopen = () => {
    console.log("Connected to server");
    onOpenCallback();
  };
  ws.onclose = () => {
    console.log("Disconnected from server");
    if (gameMode === "online") {
      displayError("Mất kết nối với máy chủ.");
      showScreen("home");
    }
  };
  ws.onerror = (error) => {
    console.error("WebSocket Error:", error);
    if (gameMode === "online") {
      displayError("Không thể kết nối đến máy chủ.");
    }
  };
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handleServerMessage(msg);
  };
}

function handleServerMessage({ type, payload }) {
  if (gameMode !== "online") return;
  switch (type) {
    case "room_created":
      roomCodeDisplay.textContent = payload.room_code;
      showScreen("game");
      break;
    case "join_success":
    case "player_joined":
    case "player_left":
    case "game_start":
      roomState = payload;
      updateUI();
      showScreen("game");
      startAfkCountdown();
      break;
    case "game_update":
      roomState = payload;
      updateUI();
      showScreen("game");

      if (roomState.game_state === "playing") {
        startAfkCountdown();
      }
      break;
    case "round_result":
      roomState.game_state = "result";
      stopAfkCountdown();
      displayRoundResult(payload);
      break;
    case "chat_broadcast":
      displayChatMessage(payload);
      break;
    case "error":
      displayError(payload.message);
      break;
  }
}

function updateUI() {
  if (gameMode === "cpu") return;
  if (!roomState || !roomState.players) return;
  roomCodeDisplay.textContent = roomState.room_code;
  const me = roomState.players.find((p) => p.name === localPlayerInfo.name);
  const opponent = roomState.players.find(
    (p) => p.name !== localPlayerInfo.name
  );

  updatePlayerCard(playerElements.p1, me, "Bạn");
  updatePlayerCard(playerElements.p2, opponent, "Đang chờ đối thủ...");

  document
    .querySelector(".chat-container")
    .classList.toggle("hidden", !opponent);
  [playerElements.p1, playerElements.p2].forEach((p) => {
    p.status.textContent = "";
    p.status.classList.remove("chosen");
    p.choice.style.fontSize = "2rem";
  });

  if (roomState.game_state === "playing") {
    resultDisplay.textContent = "Hãy đưa ra lựa chọn!";
    enableChoiceButtons(true);
    if (roomState.player_made_choice) {
      const chosenPlayerKey =
        roomState.player_made_choice === localPlayerInfo.name ? "p1" : "p2";
      playerElements[chosenPlayerKey].status.textContent = "✓";
      playerElements[chosenPlayerKey].status.classList.add("chosen");
    }
  } else {
    enableChoiceButtons(false);
    resultDisplay.textContent =
      roomState.game_state === "waiting"
        ? "Đang chờ người chơi thứ 2..."
        : resultDisplay.textContent;
  }
}

function updatePlayerCard(elements, player, defaultName) {
  if (player) {
    if (player.avatar.startsWith("data:image")) {
      elements.avatar.innerHTML = `<img src="${player.avatar}" alt="${player.name}">`;
    } else if (player.avatar.includes(".")) {
      elements.avatar.innerHTML = `<img src="assets/images/avatars/${player.avatar}" alt="${player.name}">`;
    } else {
      elements.avatar.innerHTML = player.avatar;
    }
    elements.name.textContent = player.name;
    elements.streak.textContent =
      player.win_streak > 1 ? `🔥 Chuỗi thắng x${player.win_streak}` : "";
  } else {
    elements.avatar.innerHTML = "?";
    elements.name.textContent = defaultName;
    elements.streak.textContent = "";
  }
}

function enableChoiceButtons(enabled) {
  choiceBtns.forEach((btn) => (btn.disabled = !enabled));
}

function displayRoundResult({ winner_name, choices, result: outcome }) {
  enableChoiceButtons(false);
  const me = roomState.players.find((p) => p.name === localPlayerInfo.name);
  const opponent = roomState.players.find(
    (p) => p.name !== localPlayerInfo.name
  );
  const choiceMap = { rock: "✊", paper: "✋", scissors: "✌️" };

  playerElements.p1.status.textContent = choiceMap[choices[me.name]];
  playerElements.p1.choice.style.fontSize = "4rem";
  if (opponent) {
    playerElements.p2.status.textContent = choiceMap[choices[opponent.name]];
    playerElements.p2.choice.style.fontSize = "4rem";
  }

  if (outcome === "draw") {
    resultDisplay.textContent = "Hòa!";
    sounds.draw.play();
  } else if (winner_name === localPlayerInfo.name) {
    resultDisplay.textContent = "Bạn thắng!";
    sounds.win.play();
  } else {
    resultDisplay.textContent = "Bạn thua!";
    sounds.lose.play();
  }
}

// ===== HÀM HIỂN THỊ CHAT ĐÃ ĐƯỢC CẬP NHẬT =====
function displayChatMessage({ sender_name, sender_avatar, text }) {
  const messageEl = document.createElement("div");
  const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Nếu là tin nhắn hệ thống
  if (sender_name === "Hệ thống") {
    messageEl.classList.add("system-message");
    messageEl.textContent = sanitizedText;
  }
  // Nếu là tin nhắn người chơi
  else {
    messageEl.classList.add("chat-message");
    let avatarHTML = "";
    if (sender_avatar.startsWith("data:image")) {
      avatarHTML = `<img class="chat-avatar" src="${sender_avatar}" alt="${sender_name}">`;
    } else if (sender_avatar.includes(".")) {
      avatarHTML = `<img class="chat-avatar" src="assets/images/avatars/${sender_avatar}" alt="${sender_name}">`;
    } else {
      avatarHTML = `<span class="chat-avatar">${sender_avatar}</span>`;
    }
    messageEl.innerHTML = `${avatarHTML}<div><span class="chat-sender">${sender_name}:</span> <span class="chat-text">${sanitizedText}</span></div>`;
  }

  chatMessages.prepend(messageEl);

  // Phát âm thanh cho tin nhắn của người khác và tin nhắn hệ thống
  if (sender_name !== localPlayerInfo.name) {
    // Có thể thêm 1 âm thanh riêng cho tin nhắn hệ thống nếu muốn
    sounds.chat.play();
  }
}

function startGameVsCPU() {
  gameMode = "cpu";
  localPlayerInfo = getPlayerInfoFromDOM();
  if (!localPlayerInfo) return;

  playBackgroundMusic();
  showScreen("game");
  roomCodeDisplayWrapper.style.visibility = "hidden";
  document.querySelector(".chat-container").classList.add("hidden");

  updatePlayerCard(playerElements.p1, localPlayerInfo, "Bạn");
  updatePlayerCard(
    playerElements.p2,
    { name: "Máy", avatar: "🤖", win_streak: 0 },
    "Máy"
  );

  resultDisplay.textContent = "Bắt đầu!";
  enableChoiceButtons(true);
}

function handleCPUGame(playerChoice) {
  const choices = ["rock", "paper", "scissors"];
  const cpuChoice = choices[Math.floor(Math.random() * choices.length)];
  const choiceMap = { rock: "✊", paper: "✋", scissors: "✌️" };

  playerElements.p1.status.textContent = choiceMap[playerChoice];
  playerElements.p1.choice.style.fontSize = "4rem";
  playerElements.p2.status.textContent = choiceMap[cpuChoice];
  playerElements.p2.choice.style.fontSize = "4rem";

  if (playerChoice === cpuChoice) {
    resultDisplay.textContent = "Hòa!";
    sounds.draw.play();
  } else if (
    (playerChoice === "rock" && cpuChoice === "scissors") ||
    (playerChoice === "scissors" && cpuChoice === "paper") ||
    (playerChoice === "paper" && cpuChoice === "rock")
  ) {
    resultDisplay.textContent = "Bạn thắng!";
    sounds.win.play();
  } else {
    resultDisplay.textContent = "Bạn thua!";
    sounds.lose.play();
  }

  setTimeout(() => {
    [playerElements.p1, playerElements.p2].forEach((p) => {
      p.status.textContent = "";
      p.choice.style.fontSize = "2rem";
    });
    resultDisplay.textContent = "Chơi tiếp nào!";
    enableChoiceButtons(true);
  }, 2000);
}

document.querySelector(".player-info").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("avatar") ||
    e.target.classList.contains("avatar-image")
  ) {
    const currentSelected = document.querySelector(".selected");
    if (currentSelected) {
      currentSelected.classList.remove("selected");
    }
    e.target.classList.add("selected");
  }
});

avatarUploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = (e) => {
      customAvatarData = e.target.result;

      let preview = document.getElementById("custom-avatar-preview");
      if (!preview) {
        preview = document.createElement("img");
        preview.id = "custom-avatar-preview";
        preview.classList.add("avatar-image");
        document.querySelector(".image-avatar-selector").appendChild(preview);
      }
      preview.src = customAvatarData;

      const currentSelected = document.querySelector(".selected");
      if (currentSelected) currentSelected.classList.remove("selected");
      preview.classList.add("selected");
    };

    reader.readAsDataURL(file);
  }
});

createRoomBtn.addEventListener("click", () => {
  gameMode = "online";
  playBackgroundMusic();
  const info = getPlayerInfoFromDOM();
  if (info) {
    localPlayerInfo = info;
    roomCodeDisplayWrapper.style.visibility = "visible";
    connectWebSocket(() =>
      ws.send(createMessage("create_room", localPlayerInfo))
    );
  }
});

joinRoomBtn.addEventListener("click", () => {
  gameMode = "online";
  playBackgroundMusic();
  const info = getPlayerInfoFromDOM();
  const code = roomCodeInput.value.trim().toUpperCase();
  if (!code) {
    displayError("Vui lòng nhập mã phòng.");
    return;
  }
  if (info) {
    localPlayerInfo = info;
    roomCodeDisplayWrapper.style.visibility = "visible";
    connectWebSocket(() =>
      ws.send(
        createMessage("join_room", { ...localPlayerInfo, room_code: code })
      )
    );
  }
});

playCpuBtn.addEventListener("click", startGameVsCPU);

choiceBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sounds.choice.play();
    const choice = btn.dataset.choice;
    enableChoiceButtons(false);

    if (gameMode === "online") {
      ws.send(createMessage("player_choice", { choice }));
      resultDisplay.textContent = "Đã chọn! Chờ đối thủ...";
      playerElements.p1.status.textContent = "✓";
      playerElements.p1.status.classList.add("chosen");
    } else {
      resultDisplay.textContent = "Máy đang chọn...";
      setTimeout(() => handleCPUGame(choice), 500);
    }
  });
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (text) {
    ws.send(createMessage("chat_message", { text }));
    chatInput.value = "";
  }
});

roomCodeDisplay.addEventListener("click", () => {
  navigator.clipboard
    .writeText(roomCodeDisplay.textContent)
    .then(() => alert("Đã sao chép mã phòng!"));
});

backToMenuBtn.addEventListener("click", () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  stopAfkCountdown(); // Dừng timer khi quay về menu
  showScreen("home");
  roomState = {};
  localPlayerInfo = getPlayerInfoFromDOM() || { name: "", avatar: "😀" };
});

const correctBtn1 = document.getElementById("correctBtn1");
const wrongBtn1 = document.getElementById("wrongBtn1");
const correctBtn2 = document.getElementById("correctBtn2");
const wrongBtn2 = document.getElementById("wrongBtn2");
const dropZone1 = document.getElementById("dropzone1");
const dropZone2 = document.getElementById("dropzone2");
const summaryAnimation = document.getElementById("summaryAnimation");
const doneBtn = document.querySelectorAll(".done-btn");
const summaryPanel = document.querySelector(".summary-panel");
const gamePanel = document.querySelector(".container");
const letterPanel1 = document.getElementById("letterPanel1");
const letterPanel2 = document.getElementById("letterPanel2");
const teamName1 = document.getElementById("teamName1");
const teamName2 = document.getElementById("teamName2");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const summaryTeam = document.getElementById("summaryTeam");
const unitSelection = document.getElementById("unit-selection");
const correctSound = new Audio('../assets/sounds/correct.mp3');
const incorrectSound = new Audio('../assets/sounds/incorrect.mp3');
const victorySound = new Audio('../assets/sounds/victory.mp3');
import {data} from "./data.js";
let unitIndex = "1"; // the initial unit and topic

// Dinamically create options elements in the select elements
function populateSelect() {
  unitSelection.innerHTML = "";
  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item.unit;
    option.textContent = `Unit-${item.unit}: ${item.title}`;
    unitSelection.appendChild(option);
  })
}
populateSelect();

// update the changes from unit selection
unitSelection.addEventListener("change", (e) => {
  unitIndex = e.target.value;
  createBubble("team1", letterPanel1);
  createBubble("team2", letterPanel2);
})

// --- Create text bubbles and assign drag and drop listeners to them ---
function createBubble(teamId, letterPanel) {
    letterPanel.innerHTML = "";
    const currentUnit = data.find(unit => unit.unit === unitIndex);
    const currentWordList = currentUnit.wordList;
    currentWordList.forEach(word => {
      const bubble = document.createElement('div');
      bubble.className = currentUnit.unit === "Testing" ? "small-bubble" : "bubble";
      bubble.textContent = word;
      bubble.dataset.team = teamId;
      bubble.dataset.panelOrigin = letterPanel;
      bubble.addEventListener('pointerdown', startDrag);
      letterPanel.appendChild(bubble);
    });
}
createBubble("team1", letterPanel1);
createBubble("team2", letterPanel2);

// --- MULTI-POINTER TRACKING ---
const pointerDrags = new Map();
// --- DRAG START ---
function startDrag(e) {
  e.preventDefault();
  const target = e.currentTarget;
  const letterPanel = target.closest('.letter-panel');
  const rect = target.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  const dragged = letterPanel ? target.cloneNode(true) : target;
  if (!letterPanel) target.parentElement.removeChild(target);
  dragged.classList.add('dragging');
  dragged.style.position = 'absolute';
  dragged.style.zIndex = '1000';
  dragged.dataset.team = target.dataset.team;
  dragged.textContent = target.textContent;
  document.body.appendChild(dragged);
  moveAt(e.clientX, e.clientY, dragged, offsetX, offsetY);
  pointerDrags.set(e.pointerId, { bubble: dragged, offsetX, offsetY });
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onDrop);
}

// --- DRAG MOVE ---
function onMove(e) {
  const dragData = pointerDrags.get(e.pointerId);
  if (!dragData) return;
  moveAt(e.clientX, e.clientY, dragData.bubble, dragData.offsetX, dragData.offsetY);
}

function moveAt(x, y, bubble, offsetX, offsetY) {
  bubble.style.left = x - offsetX + 'px';
  bubble.style.top = y - offsetY + 'px';
}

// --- DRAG DROP ---
function onDrop(e) {
  const dragData = pointerDrags.get(e.pointerId);
  if (!dragData) return;
  const bubble = dragData.bubble;
  const target = document.elementFromPoint(e.clientX, e.clientY);
  const dropzone = target?.closest('.dropzone');
  if (dropzone && dropzone.closest('.team').id === bubble.dataset.team) {
    bubble.classList.remove('dragging');
    bubble.style.position = "";
    bubble.style.zIndex = "";
    bubble.classList.add('new-bubble');
    bubble.addEventListener('pointerdown', startDrag);
    const all = Array.from(dropzone.querySelectorAll('.new-bubble'));
    let inserted = false;
    for (let b of all) {
      const rect = b.getBoundingClientRect();
      if (e.clientX < rect.left + rect.width / 2) {
        dropzone.insertBefore(bubble, b);
        inserted = true;
        break;
      }
    }
    if (!inserted) dropzone.appendChild(bubble);
  } else {
    bubble.remove();
  }
  pointerDrags.delete(e.pointerId);
  if (pointerDrags.size === 0) {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onDrop);
  }
}

// --- CHECK ANSWERS ---
function correctAnswer(score, dropzone, panel) {
  correctSound.pause();
  correctSound.currentTime = 0;
  correctSound.play();
  score.innerText = parseInt(score.innerText) + 5;
  dropzone.querySelectorAll('.new-bubble').forEach(bubble => {
    bubble.style.backgroundColor = 'rgb(131, 245, 131)';
    bubble.style.color = 'white';
    setTimeout(() => {
      bubble.remove();
    }, 1000);
  });
}

function wrongAnswer(score, dropzone, panel) {
  incorrectSound.pause();
  incorrectSound.currentTime = 0;
  incorrectSound.play();
  score.innerText = parseInt(score.innerText) - 2;
  dropzone.querySelectorAll('.new-bubble').forEach(bubble => {
    bubble.style.backgroundColor = 'rgb(245, 131, 131)';
    bubble.style.color = 'white';
    setTimeout(() => {
      bubble.remove();
    }, 1000);
  });
}

correctBtn1.addEventListener("click", () => correctAnswer(score1, dropZone1, "panel1"));
wrongBtn1.addEventListener("click", () => wrongAnswer(score1, dropZone1, "panel1"));
correctBtn2.addEventListener("click", () => correctAnswer(score2, dropZone2, "panel2"));
wrongBtn2.addEventListener("click", () => wrongAnswer(score2, dropZone2, "panel2"));

// --- SUMMARY SECTION ---
function summaryVideo() {
  const imgSources = [
    '../assets/memes/amazing1.gif',
    '../assets/memes/amazing2.gif',
    '../assets/memes/omg1.gif',
    '../assets/memes/well-done1.gif',
    '../assets/memes/wow1.gif',
    '../assets/memes/wow2.gif',
    '../assets/memes/wow3.gif'
  ];
  const randomIndex = Math.floor(Math.random() * imgSources.length);
  const img = document.createElement('img');
  img.className = 'summary-animation';
  img.src = imgSources[randomIndex];
  summaryAnimation.appendChild(img);
}

function determineWinners() {
  const score1Value = parseInt(score1.innerText);
  const score2Value = parseInt(score2.innerText);
  if (score1Value > score2Value) {
    summaryTeam.innerHTML = `🥇 ${teamName1.value}: Score: ${score1Value} <br> 🥈 ${teamName2.value}: Score: ${score2Value}`;
  } else if (score1Value === score2Value) {
    summaryTeam.innerHTML = `${teamName1.value}: Score: ${score1Value} 🤝 ${teamName2.value}: Score: ${score2Value}`;
  } else {
    summaryTeam.innerHTML = `🥇 ${teamName2.value}: Score: ${score2Value} <br> 🥈 ${teamName1.value}: Score: ${score1Value}`;
  }
  victorySound.play();
  summaryVideo();
}

doneBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    gamePanel.style.display = 'none';
    summaryPanel.style.display = 'block';
    document.body.style.backgroundImage = "url('../assets/app-images/victory-background.jpg')";
    determineWinners();
  });
});
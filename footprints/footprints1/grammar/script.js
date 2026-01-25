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
const topicSelection = document.getElementById("topic-selection");
const correctSound = new Audio('../assets/sounds/correct.mp3');
const incorrectSound = new Audio('../assets/sounds/incorrect.mp3');
const victorySound = new Audio('../assets/sounds/victory.mp3');
import {data} from "./data.js";
let unitIndex = "1"; // the initial unit and topic
let topicIndex = "1.1";
let currentUnit = {}; // the current unit and topic
let currentTopic = {};
let i1 = 0; // the initial index of text bubbles
let i2 = 1;

// Dinamically create options elements in the select elements
function populateSelect() {
  unitSelection.innerHTML = "";
  topicSelection.innerHTML = "";
  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item.unit;
    option.textContent = `Unit-${item.unit}`;
    unitSelection.appendChild(option);
  })
  // update the topics based on the current unit
  updateTopics();
}

// update the topics accordingly
function updateTopics() {
  topicSelection.innerHTML = "";
  const selectedUnit = data.find(item => item.unit === unitIndex);
  selectedUnit.structures.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.topic;
    topicSelection.appendChild(option);
  })
}

// the function to update the current unit and topic globally
function currentUnitAndTopic() {
  currentUnit = data.find(unit => unit.unit === unitIndex);
  currentTopic = currentUnit.structures.find(topic => topic.id === topicIndex);
}

// update the changes from unit selection
unitSelection.addEventListener("change", (e) => {
  unitIndex = e.target.value;
  topicIndex = data.find(unit => unit.unit === unitIndex).structures[0].id;
  currentUnitAndTopic();
  updateTopics();
  populateBubbles();
})

// update the changes from topic selection
topicSelection.addEventListener("change", (e) => {
  topicIndex = e.target.value;
  currentUnitAndTopic();
  populateBubbles();
})

// --- Create text bubbles and assign drag and drop listeners to them ---
function createBubble(teamId, panel) {
  const currentExercise = currentTopic.exercises;
  const unscrumble1 = currentExercise[i1].split(" ").sort((a, b) => Math.random() - 0.5);
  const unscrumble2 = currentExercise[i2].split(" ").sort((a, b) => Math.random() - 0.5);
  if (panel === "panel1") {
    letterPanel1.innerHTML = "";
    unscrumble1.forEach(word => {
      const bubble = document.createElement('div');
      bubble.className = "bubble";
      bubble.textContent = word;
      bubble.dataset.team = teamId;
      bubble.dataset.panelOrigin = panel;
      bubble.addEventListener('touchstart', startDrag, { passive: false });
      bubble.addEventListener('mousedown', startDrag);
      letterPanel1.appendChild(bubble);
    });
  }
  if (panel === "panel2") {
    letterPanel2.innerHTML = "";
    unscrumble2.forEach(word => {
      const bubble = document.createElement('div');
      bubble.className = "bubble";
      bubble.textContent = word;
      bubble.dataset.team = teamId;
      bubble.dataset.panelOrigin = panel;
      bubble.addEventListener('touchstart', startDrag, { passive: false });
      bubble.addEventListener('mousedown', startDrag);
      letterPanel2.appendChild(bubble);
    });
  }
}

// Assign the text bubbles with the initial index to the respective containers
function populateBubbles() {
  createBubble("team1", "panel1");
  createBubble("team2", "panel2")
}

// move to the next text bubble independently
function nextBubble(panel) {
  const currentExercise = currentTopic.exercises;
  if (panel === "panel1") {
    i1 = i1 > currentExercise.length - 1 ? 0 : i1;
    i1 += 1;
    createBubble("team1", panel);
  }
  if (panel === "panel2") {
    letterPanel2.innerHTML = "";
    i2 = i2 > currentExercise.length - 1 ? 0 : i2;
    i2 += 1;
    createBubble("team2", panel)
  }
}

populateSelect(); // initial appending of units and topics to the Select elements
currentUnitAndTopic(); // update the latest selected unit and topic
populateBubbles(); // initial appending of text bubbles

// The drag and drop functions
const touchDrags = new Map();

// --- DRAG START ---
function startDrag(e) {
  e.preventDefault();
  const isTouch = e.type === 'touchstart';
  const touches = isTouch ? e.changedTouches : [e];
  for (const touch of touches) {
    const clientX = isTouch ? touch.clientX : e.clientX;
    const clientY = isTouch ? touch.clientY : e.clientY;
    const id = isTouch ? touch.identifier : 'mouse';
    const target = e.currentTarget;
    const panelOrigin = target.parentNode;
    const rect = target.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    target.classList.add('dragging');
    // document.body.appendChild(target);
    moveAt(clientX, clientY, target, offsetX, offsetY);
    touchDrags.set(id, { bubble: target, offsetX, offsetY, panelOrigin});
    if (isTouch) {
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onDrop);
    } else {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onDrop);
    }
  }
}

// --- DRAG MOVE ---
function onMove(e) {
  const isTouch = e.type === 'touchmove';
  const touches = isTouch ? e.changedTouches : [e];

  for (const touch of touches) {
    const id = isTouch ? touch.identifier : 'mouse';
    const dragData = touchDrags.get(id);
    if (!dragData) continue;
    moveAt(touch.clientX, touch.clientY, dragData.bubble, dragData.offsetX, dragData.offsetY);
  }
}

function moveAt(x, y, bubble, offsetX, offsetY) {
  bubble.style.left = x - offsetX + 'px';
  bubble.style.top = y - offsetY + 'px';
}

// --- DRAG DROP ---
function onDrop(e) {
  const isTouch = e.type === 'touchend';
  const touches = isTouch ? e.changedTouches : [e];
  document.body.style.cursor = '';
  for (const touch of touches) {
    const id = isTouch ? touch.identifier : 'mouse';
    const dragData = touchDrags.get(id);
    if (!dragData) continue;
    const panelOrigin = dragData.panelOrigin;
    const bubble = dragData.bubble;
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    const target = document.elementFromPoint(clientX, clientY);
    const dropzone = target?.closest('.dropzone');
    
    if ((dropzone && dropzone.closest('.team').id === panelOrigin.closest('.team').id)) {
      bubble.classList.remove('dragging');
      const all = Array.from(dropzone.querySelectorAll('.bubble'));
      let inserted = false;
      for (let b of all) {
        const rect = b.getBoundingClientRect();
        if (clientX < rect.left + rect.width / 2) {
          dropzone.insertBefore(bubble, b);
          inserted = true;
          break;
        }
      }
      if (!inserted) dropzone.appendChild(bubble);
    } else {
      bubble.classList.remove('dragging');
      panelOrigin.appendChild(bubble);
    }
    touchDrags.delete(id);
    if (touchDrags.size === 0) {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onDrop);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onDrop);
    }
  }
}

// --- CHECK ANSWERS ---
function correctAnswer(score, dropzone, panel) {
  correctSound.pause();
  correctSound.currentTime = 0;
  correctSound.play();
  score.innerText = parseInt(score.innerText) + 5;
  dropzone.querySelectorAll('.bubble').forEach(bubble => {
    bubble.style.backgroundColor = 'rgb(131, 245, 131)';
    bubble.style.color = 'white';
    setTimeout(() => {
      bubble.remove();
      nextBubble(panel);
    }, 1000);
  });
}

function wrongAnswer(score, dropzone, panel) {
  incorrectSound.pause();
  incorrectSound.currentTime = 0;
  incorrectSound.play();
  score.innerText = parseInt(score.innerText) - 2;
  dropzone.querySelectorAll('.bubble').forEach(bubble => {
    bubble.style.backgroundColor = 'rgb(245, 131, 131)';
    bubble.style.color = 'white';
    setTimeout(() => {
      bubble.remove();
      nextBubble(panel);
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
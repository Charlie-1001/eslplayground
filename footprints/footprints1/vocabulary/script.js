const team1Name = document.getElementById("team1Name");
const team2Name = document.getElementById("team2Name");
const correctScore1 = document.getElementById("correct1");
const correctScore2 = document.getElementById("correct2");
const incorrectScore1 = document.getElementById("incorrect1");
const incorrectScore2 = document.getElementById("incorrect2");
const bonusScore1 = document.getElementById("bonus1");
const bonusScore2 = document.getElementById("bonus2");
const luckyBoxScore1 = document.getElementById("luckyBox1");
const luckyBoxScore2 = document.getElementById("luckyBox2");
const luckyBoxImg1 = document.getElementById("luckyBoxImg1");
const luckyBoxImg2 = document.getElementById("luckyBoxImg2");
const totalScore1 = document.getElementById("totalScore1");
const totalScore2 = document.getElementById("totalScore2");
const letterBox1 = document.getElementById("letterBox1");
const letterBox2 = document.getElementById("letterBox2");
const imageSection1 = document.getElementById("imageSection1");
const imageSection2 = document.getElementById("imageSection2");
const checkBtn1 = document.getElementById("checkBtn1");
const checkBtn2 = document.getElementById("checkBtn2");
const unitSelection = document.getElementById("unit-selection");
const magicSound = new Audio('../assets/sounds/magic-sound.mp3');
const correctSound = new Audio('../assets/sounds/correct.mp3');
const incorrectSound = new Audio('../assets/sounds/incorrect.mp3');
const victorySound = new Audio('../assets/sounds/victory.mp3');
let wordIndex1 = Math.floor(Math.random() * 10);
let wordIndex2 = Math.floor(Math.random() * 10);
let correctScoreValue1 = 0;
let correctScoreValue2 = 0;
let incorrectScoreValue1 = 0;
let incorrectScoreValue2 = 0;
let bonusScoreValue1 = 0;
let bonusScoreValue2 = 0;
let luckyBoxScoreValue1 = 0;
let luckyBoxScoreValue2 = 0;
let totalScoreValue1 = 0;
let totalScoreValue2 = 0;
import {data} from "./data.js";
let unitIndex = "1"; // the initial unit
const boxList = [
  {value: 5, imageUrl: "../assets/app-images/lucky-box-5.png"}, 
  {value: 10, imageUrl: "../assets/app-images/lucky-box-10.png"},
  {value: 15, imageUrl: "../assets/app-images/lucky-box-15.png"}
];

// dinamically create the option elements for the units
function populateSelect() {
  unitSelection.innerHTML = "";
  data.forEach(unit => {
    const option = document.createElement("option");
    option.value = unit.unit;
    option.textContent = `Unit-${unit.unit}: ${unit.title}`;
    unitSelection.appendChild(option);
  })
}
populateSelect();

// update the contents based on the unit selection
unitSelection.addEventListener("change", (e) => {
  unitIndex = e.target.value;
  generateQuestion(letterBox1, imageSection1); 
  generateQuestion(letterBox2, imageSection2);
})

// Generate the scrumbled letters and pictures
function generateQuestion(letterBox, imageSection) {
  letterBox.innerHTML = "";
  imageSection.innerHTML = "";
  const currentUnit = data.find(unit => unit.unit === unitIndex);
  const currentWordList = currentUnit.wordList;
  let wordIndex;
  if (letterBox.id === letterBox1.id) {
    wordIndex1 = (wordIndex1 + 1) % currentWordList.length;
    wordIndex = wordIndex1;
  } else {
    wordIndex2 = (wordIndex2 + 1) % currentWordList.length;
    wordIndex = wordIndex2;
  }
  const currentWord = currentWordList[wordIndex].word;
  const scrumbledWord = scrumbling(currentWord);
  scrumbledWord.split('').forEach(letter => {
    const letterSpan = document.createElement("span");
    letterSpan.textContent = letter;
    letterSpan.className = "scrumbled-letter";
    letterSpan.draggable = true;
    letterSpan.addEventListener("touchstart", startDrag, { passive: false });
    letterSpan.addEventListener("mousedown", startDrag)
    letterBox.appendChild(letterSpan);
  });
  const currentImage = document.createElement("img");
  currentImage.src = currentWordList[wordIndex].imageUrl;
  currentImage.className = "vocabulary-img";
  imageSection.appendChild(currentImage);
}
generateQuestion(letterBox1, imageSection1); 
generateQuestion(letterBox2, imageSection2);

// function to scrumble the words
function scrumbling(word) {
  const scrumbled = word.split('').sort(() => Math.random() - 0.5).join('');
  return scrumbled;
}

// To check the answer
let hits1 = 0;
let hits2 = 0;
function checkAnswer(letterBox, Index) {
  const unscrumbledWord = Array.from(letterBox.children).map(child => child.textContent).join('');
  const originalWord = data.find(unit => unit.unit === unitIndex).wordList[Index].word;
  const longWord = unscrumbledWord.length > 5 ? true : false;
  // checking the correct and incorrect answers
  if (unscrumbledWord === originalWord) {
    correctSound.play();
    if (letterBox === letterBox1) {
      hits1 += 1;
      longWord ? correctScoreValue1 += 8 : correctScoreValue1 += 5;
      correctScore1.textContent = correctScoreValue1;
      Array.from(letterBox1.children).forEach(letter => letter.style.backgroundColor = "rgb(7, 175, 7)");
    } else {
      hits2 += 1;
      longWord ? correctScoreValue2 += 8 : correctScoreValue2 += 5;
      correctScore2.textContent = correctScoreValue2;
      Array.from(letterBox2.children).forEach(letter => letter.style.backgroundColor = "rgb(7, 175, 7)");
    }
  } else {
    incorrectSound.play();
    if (letterBox === letterBox1) {
      incorrectScoreValue1 -= 2;
      incorrectScore1.textContent = incorrectScoreValue1;
      Array.from(letterBox1.children).forEach(letter => letter.style.backgroundColor = "rgb(240, 52, 52)");
    } else {
      incorrectScoreValue2 -= 2;
      incorrectScore2.textContent = incorrectScoreValue2;
      Array.from(letterBox2.children).forEach(letter => letter.style.backgroundColor = "rgb(240, 52, 52)");
    }     
  }

  // updating the bonus score and total score
  if (letterBox === letterBox1) {
    totalScoreValue1 = correctScoreValue1 + incorrectScoreValue1 + bonusScoreValue1 + luckyBoxScoreValue1;
    totalScore1.textContent = totalScoreValue1;
    totalScore1.style.color = totalScoreValue1 > 0 ? "greenyellow" : "red";
    if (hits1 > 0 && hits1 % 5 === 0) {
      bonusScoreValue1 += 10;
      bonusScore1.textContent = bonusScoreValue1;
    }
  } else {
      totalScoreValue2 = correctScoreValue2 + incorrectScoreValue2 + bonusScoreValue2 + luckyBoxScoreValue2;
      totalScore2.textContent = totalScoreValue2;
      totalScore2.style.color = totalScoreValue2 > 0 ? "greenyellow" : "red";
      if (hits2 > 0 && hits2 % 5 === 0) {
        bonusScoreValue2 += 10;
        bonusScore2.textContent = bonusScoreValue2;
      }
  }
}

// check button functions
checkBtn1.addEventListener("click", () => {
  checkBtn1.disabled = true;
  checkAnswer(letterBox1, wordIndex1);
  setTimeout(() => {
    generateQuestion(letterBox1, imageSection1);
    checkBtn1.disabled = false;
  }, 1000);
})

checkBtn2.addEventListener("click", () => {
  checkBtn2.disabled = true;
  checkAnswer(letterBox2, wordIndex2);
  setTimeout(() => {
    generateQuestion(letterBox2, imageSection2);
    checkBtn2.disabled = false;
  }, 1000);
})

// The lucky box section
let box1Clicked = false;
let box2Clicked = false;
function luckyDraw(box) {
  magicSound.pause();
  magicSound.currentTime = 0;
  magicSound.play();
  if (box === luckyBoxImg1) {
    const luckyIndex1 = Math.floor((Math.random() * boxList.length));
    setTimeout(() => {
      luckyBoxImg1.src = boxList[luckyIndex1].imageUrl;
      luckyBoxScoreValue1 = boxList[luckyIndex1].value;
      luckyBoxScore1.textContent = luckyBoxScoreValue1;
      totalScoreValue1 += luckyBoxScoreValue1;
      totalScore1.textContent = totalScoreValue1;
      totalScore1.style.color = totalScoreValue1 > 0 ? "greenyellow" : "red";
      box1Clicked = true;
      if (box1Clicked === true && box2Clicked === true) {
        setTimeout(() => gameSummary(), 2000);
      } else {
        return
      }
    }, 1000);
  } else {
    const luckyIndex2 = Math.floor((Math.random() * boxList.length));
    setTimeout(() => {
      luckyBoxImg2.src = boxList[luckyIndex2].imageUrl;
      luckyBoxScoreValue2 = boxList[luckyIndex2].value;
      luckyBoxScore2.textContent = luckyBoxScoreValue2;
      totalScoreValue2 += luckyBoxScoreValue2;
      totalScore2.textContent = totalScoreValue2;
      totalScore2.style.color = totalScoreValue2 > 0 ? "greenyellow" : "red";
      box2Clicked = true;
      if (box1Clicked === true && box2Clicked === true) {
        setTimeout(() => gameSummary(), 2000);
      } else {
        return
      }
    }, 1000);
  } 
};
luckyBoxImg1.addEventListener("click", () => {luckyDraw(luckyBoxImg1)}, {once: true});
luckyBoxImg2.addEventListener("click", () => {luckyDraw(luckyBoxImg2)}, {once: true});

// the game summary section
function gameSummary() {
  imageSection1.innerHTML = "";
  imageSection2.innerHTML = "";
  const img1 = document.createElement('img');
  const img2 = document.createElement('img');
  const img3 = document.createElement('img');
  img1.className = "vocabulary-img";
  img2.className = "vocabulary-img";
  img3.className = "vocabulary-img";
  img1.src = "../assets/app-images/first-winner.jpg";
  img2.src = "../assets/app-images/second-winner.jpg";
  img3.src = "../assets/app-images/handshake.png";
  victorySound.play();
  document.querySelectorAll('.check-btn').forEach(btn => btn.style.display = "none");
  document.querySelectorAll('.letter-box').forEach(box => {
    box.style.width = "100%";
    box.innerHTML = "";
  });
  if (totalScoreValue1 > totalScoreValue2) {
    imageSection1.appendChild(img1);
    letterBox1.innerHTML = `The first Winner: <span style="color: green">${team1Name.value}</span>`;
    imageSection2.appendChild(img2);
    letterBox2.innerHTML = `The second Winner: <span style="color: green">${team2Name.value}</span>`;
  } else if (totalScoreValue2 > totalScoreValue1) {
    imageSection1.appendChild(img2);
    letterBox1.innerHTML = `The second Winner: <span style="color: green">${team1Name.value}</span>`;
    imageSection2.appendChild(img1);
    letterBox2.innerHTML = `The first Winner: <span style="color: green">${team2Name.value}</span>`;
  } else {
    imageSection1.appendChild(img3);
    imageSection2.appendChild(img3.cloneNode(true));
    document.querySelectorAll('.letter-box').forEach(box => box.textContent = "It's a tie!");
  }
}

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
    
    if (panelOrigin) {
      bubble.classList.remove('dragging');
      const all = Array.from(panelOrigin.children);
      let inserted = false;
      for (let b of all) {
        const rect = b.getBoundingClientRect();
        if (clientX < rect.left + rect.width / 2) {
          panelOrigin.insertBefore(bubble, b);
          inserted = true;
          break;
        }
      }
      if (!inserted) panelOrigin.appendChild(bubble);
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
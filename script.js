// The main categories
const categories = [
  {name: "Oxford Phonics World", image: "assets/images/phonics.png", link: "#phonics"},
  {name: "Footprint", image: "assets/images/footprint.png", link: "#footprints"},
  { name: "Grading Activities", image: "assets/images/grading-activities.png", link: "#motivationMeter" },
  { name: "Mini Games", image: "assets/images/mini-games.png", link: "#miniGames" },
];

// The phonics game data
const phonics2Data = [
  { name: "Flashcards", imgSrc: "assets/images/flashcards.png", link: "phonics/phonics2/flashcards/index.html"},
  { name: "Sound-spelling", imgSrc: "assets/images/grammar.png", link: "phonics/phonics2/sound-spelling/index.html"},
  { name: "Picture-spelling", imgSrc: "assets/images/vocabulary.png", link: "phonics/phonics2/picture-spelling/index.html"},
];

// The footprints data
const footprints1Data = [
  { name: "Flashcards", imgSrc: "assets/images/flashcards.png", link: "footprints/footprints1/flashcards/index.html"},
  { name: "Vocabulary Game", imgSrc: "assets/images/vocabulary.png", link: "footprints/footprints1/vocabulary/index.html"},
  { name: "Grammar Game", imgSrc: "assets/images/grammar.png", link: "footprints/footprints1/grammar/index.html"},
];

// The grading game data
const gradingGameData = [
  { name: "My Collection", imgSrc: "assets/images/my-collection.png", link: "grading/my-collection.html"},
];

// The mini game data
const miniGameData = [
  { name: "NPS Genius", imgSrc: "assets/images/nps-genius.png", link: "mini-games/nps-genius/index.html"},
  { name: "Lower Level Quiz", imgSrc: "assets/images/lower-quiz.png", link: "mini-games/quiz-games/lowerLevel.html"},
  { name: "Higher Level Quiz", imgSrc: "assets/images/higher-quiz.png", link: "mini-games/quiz-games/higherLevel.html"},
];

const categoryContainer = document.getElementById("category");
const phonics2Container = document.getElementById("phonics2");
const footprints1Container = document.getElementById("footprints1");
const miniGameContainer = document.getElementById("miniGame");
const gradingGameContainer = document.getElementById("gradingGame");

// auto open the details element
document.querySelectorAll("details").forEach(detail => detail.open = true);

// Dynamically create category items
categories.forEach(cat => {
  const catDiv = document.createElement("div");
  catDiv.className = "category-item";
  catDiv.innerHTML = `
    <a href="${cat.link}">
      <img src="${cat.image}" alt="${cat.name}">
      <h3>${cat.name}</h3>        
    </a>
  `;
  categoryContainer.appendChild(catDiv);
});

// dinamically create game items
function createGameItems(data, container) {
  data.forEach(game => {
    const gameItem = document.createElement("a");
    const gameImg = document.createElement("img");
    const gameLabel = document.createElement("h3");
    gameItem.className = "game-item";
    gameItem.href = game.link;
    gameImg.src = game.imgSrc;
    gameLabel.textContent = game.name;
    gameItem.append(gameImg, gameLabel);
    container.appendChild(gameItem)
  })
}

// create game items for the respective subjects
createGameItems(phonics2Data, phonics2Container);
createGameItems(footprints1Data, footprints1Container);
createGameItems(gradingGameData, gradingGameContainer);
createGameItems(miniGameData, miniGameContainer);
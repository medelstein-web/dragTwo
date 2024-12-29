let originalPositions = []; // Store original word positions
let sentence = []; // Global sentence variable

function initializeGame() {
  // Retrieve data from localStorage (assuming it contains both sentence and colors)
  const wordsValue = JSON.parse(localStorage.getItem("words-value"));

  if (!wordsValue || !wordsValue.sentence || !wordsValue.colors) {
    alert("No valid data found in localStorage!");
    return; // Exit if there's an issue
  }

  const wordsContainer = document.getElementById("wordsContainer");
  const dropzoneContainer = document.getElementById("dropzoneContainer");
  const checkBtn = document.getElementById("checkBtn");
  const result = document.getElementById("result");
  const { sentence: sentenceFromStorage, colors } = wordsValue;

  sentence = sentenceFromStorage; // Store sentence globally
  originalPositions = []; // Clear previous positions to prevent duplicates

  // Shuffle the words
  const shuffledWords = sentence
    .map((word, index) => ({ word, color: colors[index] }))
    .sort(() => Math.random() - 0.5);

  // Clear previous content
  wordsContainer.innerHTML = "";
  dropzoneContainer.innerHTML = "";
  result.textContent = "";
  checkBtn.style.display = "inline-block";

  // Ensure the container has relative positioning
  wordsContainer.style.position = "relative";

  // Create draggable words
  shuffledWords.forEach(({ word, color }) => {
    const wordDiv = document.createElement("div");
    wordDiv.className = "word";
    wordDiv.draggable = true;
    wordDiv.dataset.word = word;
    wordDiv.textContent = word;
    wordDiv.style.color = color;
    wordDiv.style.position = "relative"; // Position relative to the container
    wordsContainer.appendChild(wordDiv);

    // Save word's initial position
    setTimeout(() => {
      originalPositions.push({
        word: wordDiv.dataset.word,
        left: wordDiv.offsetLeft,
        top: wordDiv.offsetTop,
      });
    }, 0);
  });

  // Create drop zones
  sentence.forEach(() => {
    const dropzone = document.createElement("div");
    dropzone.className = "dropzone";
    dropzoneContainer.appendChild(dropzone);
  });

  // Initialize drag-and-drop functionality
  initializeDragAndDrop();

  // Add check functionality
  checkBtn.addEventListener("click", () => {
    const sentenceFromDropzones = Array.from(
      document.querySelectorAll(".dropzone")
    ).map((zone) =>
      zone.children[0] ? zone.children[0].dataset.word : ""
    );

    if (
      sentenceFromDropzones.includes("") ||
      JSON.stringify(sentenceFromDropzones) !== JSON.stringify(sentence)
    ) {
      result.textContent = "Try again!";
      result.style.color = "red";
      snapWordsBack();
    } else {
      result.textContent = "Correct! 🎉";
      result.style.color = "green";
    }
  });
}

function initializeDragAndDrop() {
  let draggedWord = null;

  // Handle drag start and end events for words
  document.querySelectorAll(".word").forEach((word) => {
    word.addEventListener("dragstart", () => {
      draggedWord = word;
    });

    word.addEventListener("dragend", () => {
      draggedWord = null;
    });
  });

  // Handle dragover, dragleave, and drop events for drop zones
  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("active");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("active");
    });

    zone.addEventListener("drop", () => {
      if (draggedWord) {
        // If the drop zone already contains a word, move it back to the wordsContainer
        const existingWord = zone.querySelector(".word");
        if (existingWord) {
          const wordsContainer = document.getElementById("wordsContainer");
          wordsContainer.appendChild(existingWord); // Move existing word back
          resetWordPosition(existingWord);
        }

        // Place the dragged word in the drop zone
        zone.innerHTML = ""; // Clear the drop zone content
        zone.appendChild(draggedWord); // Append dragged word to drop zone
        zone.classList.remove("active");

        // Center the word inside the drop zone
        draggedWord.style.position = "static"; // Use static positioning to fit drop zone
      }
    });
  });
}

function resetWordPosition(word) {
  const originalPos = originalPositions.find(
    (pos) => pos.word === word.dataset.word
  );

  if (originalPos) {
    word.style.transition = "all 0.5s ease";
    word.style.position = "absolute"; // Absolute positioning within the container
    word.style.left = `${originalPos.left}px`;
    word.style.top = `${originalPos.top}px`;
  }
}

function snapWordsBack() {
  const wordsContainer = document.getElementById("wordsContainer");

  // Loop through all drop zones to retrieve misplaced words
  document.querySelectorAll(".dropzone").forEach((zone) => {
    const word = zone.querySelector(".word");
    if (word) {
      wordsContainer.appendChild(word); // Move word back to the wordsContainer
      resetWordPosition(word);
    }
    zone.innerHTML = ""; // Clear the drop zone
  });

// Ensure wordsContainer height stays consistent
  wordsContainer.style.height = "50px"; // Match the fixed CSS height
  
  // Reposition wordsContainer to ensure it's above drop zones
 // const dropzoneContainer = document.getElementById("dropzoneContainer");
  //const wordsContainerHeight = wordsContainer.offsetHeight;
  //const dropzoneContainerTop = dropzoneContainer.offsetTop;

  // Position wordsContainer above the dropzoneContainer
  //wordsContainer.style.position = "absolute";
  //wordsContainer.style.top = `${dropzoneContainerTop - wordsContainerHeight - 10}px`; // Add some margin above
  //wordsContainer.style.left = "0";

  // Re-initialize drag-and-drop functionality for the words
  initializeDragAndDrop();
}

// Initialize the game
initializeGame();

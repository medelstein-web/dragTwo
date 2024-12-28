function initializeGame() {
  // Retrieve data from localStorage (assuming it contains both sentence and colors)
  const wordsValue = JSON.parse(localStorage.getItem('words-value'));

  if (!wordsValue || !wordsValue.sentence || !wordsValue.colors) {
    alert('No valid data found in localStorage!');
    return;  // Exit if there's an issue
  }

  const { sentence, colors } = wordsValue; // Destructure sentence and colors

  // Shuffle the words for the game
  const shuffledWords = sentence
    .map((word, index) => ({ word, color: colors[index] }))
    .sort(() => Math.random() - 0.5);

  // Clear previous game and generate new one
  wordsContainer.innerHTML = '';
  dropzoneContainer.innerHTML = '';
  result.textContent = '';
  checkBtn.style.display = 'inline-block';

  // Create draggable words
  shuffledWords.forEach(({ word, color }) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word';
    wordDiv.draggable = true;
    wordDiv.dataset.word = word;
    wordDiv.textContent = word;
    wordDiv.style.color = color;
    wordsContainer.appendChild(wordDiv);
  });

  // Create drop zones based on the correct sentence length
  sentence.forEach(() => {
    const dropzone = document.createElement('div');
    dropzone.className = 'dropzone';
    dropzoneContainer.appendChild(dropzone);
  });

  // Initialize drag-and-drop functionality
  initializeDragAndDrop(sentence);
}

// Function for drag-and-drop functionality
function initializeDragAndDrop(sentence) {
  let draggedWord = null;

  // Handle drag start and end events for words
  document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('dragstart', () => {
      draggedWord = word;
    });

    word.addEventListener('dragend', () => {
      draggedWord = null;
    });
  });

  // Handle dragover, dragleave, and drop events for drop zones
  document.querySelectorAll('.dropzone').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('active');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('active');
    });

    zone.addEventListener('drop', () => {
      if (draggedWord) {
        zone.innerHTML = ''; // Clear the dropzone
        zone.appendChild(draggedWord); // Append dragged word to dropzone
        zone.classList.remove('active');
      }
    });
  });

  // Check the sentence when the "Check" button is clicked
  checkBtn.addEventListener('click', () => {
    const sentenceFromDropzones = Array.from(document.querySelectorAll('.dropzone')).map(zone =>
      zone.children[0] ? zone.children[0].dataset.word : ''
    );

    if (JSON.stringify(sentenceFromDropzones) === JSON.stringify(sentence)) {
      result.textContent = 'Correct! 🎉';
      result.style.color = 'green';
    } else {
      result.textContent = 'Try again!';
      result.style.color = 'red';
    }
  });
}

// Initialize the game when the page loads
initializeGame();

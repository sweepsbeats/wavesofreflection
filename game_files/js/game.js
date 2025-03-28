// Main game JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Game configuration
  const config = {
    emotionalStates: ['joy', 'nostalgia', 'sorrow', 'routine'],
    starsNeededToProgress: 5,
    audioTracks: {
      joy: 'Saturday',
      nostalgia: 'Waves',
      sorrow: 'New Moon',
      routine: 'Windows',
      ambient: 'Nightfade',
      transition: 'Ready For It'
    },
    particleSystems: {
      joy: {
        color: '#ffcc00',
        direction: 'up',
        speed: 2
      },
      nostalgia: {
        color: '#66aaff',
        direction: 'horizontal',
        speed: 1
      },
      sorrow: {
        color: '#3344aa',
        direction: 'down',
        speed: 1.5
      },
      routine: {
        color: '#aaaaaa',
        direction: 'orbit',
        speed: 1
      }
    }
  };

  // Game state
  let gameState = {
    isLoading: true,
    currentState: 'joy',
    collectedStars: 0,
    volume: 0.7,
    playerPosition: { x: 0, y: 0, z: 0 }
  };

  // Initialize game
  function initGame() {
    createLoadingScreen();
    loadAssets();
    setupEventListeners();
  }

  // Create loading screen
  function createLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    
    const loadingText = document.createElement('h2');
    loadingText.textContent = 'establishing connection to distant transmission...';
    
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    
    const loadingProgress = document.createElement('div');
    loadingProgress.className = 'loading-progress';
    
    loadingBar.appendChild(loadingProgress);
    loadingScreen.appendChild(loadingText);
    loadingScreen.appendChild(loadingBar);
    
    document.getElementById('game-container').appendChild(loadingScreen);
    
    // Simulate loading progress
    simulateLoading(loadingProgress);
  }

  // Simulate loading progress
  function simulateLoading(progressElement) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          gameState.isLoading = false;
          startGame();
        }, 500);
      }
      progressElement.style.width = `${progress}%`;
    }, 300);
  }

  // Load game assets
  function loadAssets() {
    // This would normally load images, audio, etc.
    console.log('Loading game assets...');
  }

  // Set up event listeners
  function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    
    // Volume control
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = gameState.volume;
    volumeSlider.className = 'volume-slider';
    
    volumeSlider.addEventListener('input', (e) => {
      gameState.volume = parseFloat(e.target.value);
      updateVolume();
    });
    
    const volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';
    volumeControl.appendChild(volumeSlider);
    
    const gameUI = document.createElement('div');
    gameUI.className = 'game-ui';
    gameUI.appendChild(volumeControl);
    
    document.getElementById('game-container').appendChild(gameUI);
  }

  // Handle keyboard input
  function handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
        movePlayer(0, 0, -1);
        break;
      case 'ArrowDown':
      case 's':
        movePlayer(0, 0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
        movePlayer(-1, 0, 0);
        break;
      case 'ArrowRight':
      case 'd':
        movePlayer(1, 0, 0);
        break;
      case ' ':
        movePlayer(0, 1, 0); // Space for vertical movement
        break;
    }
  }

  // Move player
  function movePlayer(x, y, z) {
    if (gameState.isLoading) return;
    
    gameState.playerPosition.x += x;
    gameState.playerPosition.y += y;
    gameState.playerPosition.z += z;
    
    updatePlayerPosition();
    checkCollisions();
  }

  // Update player position
  function updatePlayerPosition() {
    // This would update the visual position of the player
    console.log('Player position:', gameState.playerPosition);
  }

  // Check for collisions with stars
  function checkCollisions() {
    // Simplified collision detection
    const randomCollision = Math.random() > 0.9;
    
    if (randomCollision) {
      collectStar();
    }
  }

  // Collect a star
  function collectStar() {
    gameState.collectedStars++;
    console.log(`Star collected! ${gameState.collectedStars}/${config.starsNeededToProgress}`);
    
    if (gameState.collectedStars >= config.starsNeededToProgress) {
      progressToNextState();
    }
  }

  // Progress to next emotional state
  function progressToNextState() {
    const currentIndex = config.emotionalStates.indexOf(gameState.currentState);
    const nextIndex = (currentIndex + 1) % config.emotionalStates.length;
    
    gameState.currentState = config.emotionalStates[nextIndex];
    gameState.collectedStars = 0;
    
    console.log(`Progressing to ${gameState.currentState} state`);
    updateVisuals();
  }

  // Update visuals based on current emotional state
  function updateVisuals() {
    document.body.className = `${gameState.currentState}-state`;
    createParticleSystem();
  }

  // Create particle system for current state
  function createParticleSystem() {
    // This would create particles based on the current emotional state
    const particleConfig = config.particleSystems[gameState.currentState];
    console.log('Creating particle system:', particleConfig);
  }

  // Update volume
  function updateVolume() {
    // This would update the volume of audio elements
    console.log('Volume set to:', gameState.volume);
  }

  // Start the game
  function startGame() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.remove();
        updateVisuals();
      }, 1000);
    }
  }

  // Initialize the game
  initGame();
});

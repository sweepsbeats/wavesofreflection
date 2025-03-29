// Enhanced Game Class with Three.js implementation
class EnhancedGame {
    constructor() {
        this.initialized = false;
        this.gameStarted = false;
        this.isPaused = false;
        
        // DOM elements
        this.startScreen = document.getElementById('start-screen');
        this.gameContainer = document.getElementById('game-container');
        this.pauseMenu = document.getElementById('pause-menu');
        this.starsCollectedElement = document.getElementById('stars-collected');
        
        // Game state
        this.emotionalStates = ['joy', 'nostalgia', 'sorrow', 'routine'];
        this.currentState = 0;
        this.starsCollected = 0;
        this.starsNeeded = 5;
        
        // Audio elements
        this.audioElements = {
            joy: document.getElementById('audio-joy'),
            nostalgia: document.getElementById('audio-nostalgia'),
            sorrow: document.getElementById('audio-sorrow'),
            routine: document.getElementById('audio-routine'),
            ambient: document.getElementById('audio-ambient'),
            transition: document.getElementById('audio-transition')
        };
        
        // Volume settings
        this.masterVolume = 0.7;
        
        // Movement and controls
        this.keys = {};
        this.playerVelocity = new THREE.Vector3();
        this.playerDirection = new THREE.Vector3();
        
        // Bind methods
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Initialize event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Start button
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => this.startGame());
        }
        
        // Resume button
        const resumeButton = document.getElementById('resume-button');
        if (resumeButton) {
            resumeButton.addEventListener('click', () => this.resumeGame());
        }
        
        // Restart button
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => this.restartGame());
        }
        
        // Keyboard controls
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        // Window resize
        window.addEventListener('resize', this.onWindowResize);
    }
    
    init() {
        if (this.initialized) return;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050510);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.5, 5);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.gameContainer.appendChild(this.renderer.domElement);
        
        // Create lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Create player (wireframe sphere)
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00, 
            wireframe: true 
        });
        this.player = new THREE.Mesh(geometry, material);
        this.scene.add(this.player);
        
        // Create stars
        this.stars = [];
        this.createStars();
        
        // Create particles
        this.particles = [];
        this.createParticles();
        
        // Create skybox
        this.createSkybox();
        
        this.initialized = true;
    }
    
    createStars() {
        // Remove existing stars
        this.stars.forEach(star => this.scene.remove(star));
        this.stars = [];
        
        // Create new stars
        const starGeometry = new THREE.OctahedronGeometry(0.3, 0);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            color: this.getStateColor(),
            wireframe: true
        });
        
        for (let i = 0; i < this.starsNeeded; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial);
            
            // Position stars randomly in the scene
            star.position.x = (Math.random() - 0.5) * 40;
            star.position.y = (Math.random() - 0.5) * 20 + 5;
            star.position.z = (Math.random() - 0.5) * 40;
            
            this.scene.add(star);
            this.stars.push(star);
        }
    }
    
    createParticles() {
        // Remove existing particles
        this.particles.forEach(particle => this.scene.remove(particle));
        this.particles = [];
        
        // Create new particles based on emotional state
        const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: this.getStateColor(),
            transparent: true,
            opacity: 0.7
        });
        
        const particleCount = 200;
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position particles randomly in the scene
            particle.position.x = (Math.random() - 0.5) * 100;
            particle.position.y = (Math.random() - 0.5) * 50;
            particle.position.z = (Math.random() - 0.5) * 100;
            
            // Add random velocity for animation
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            );
            
            this.scene.add(particle);
            this.particles.push(particle);
        }
    }
    
    createSkybox() {
        // Create a simple starfield skybox
        const skyGeometry = new THREE.BoxGeometry(100, 100, 100);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide
        });
        this.skybox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.skybox);
        
        // Add stars to skybox
        const starCount = 1000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = [];
        
        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            
            starPositions.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    startGame() {
        if (!this.initialized) {
            this.init();
        }
        
        this.gameStarted = true;
        this.startScreen.style.display = 'none';
        
        // Start audio
        this.playAudio();
        
        // Start animation loop if not already running
        if (!this.animationFrameId) {
            this.animate();
        }
    }
    
    pauseGame() {
        if (!this.gameStarted || this.isPaused) return;
        
        this.isPaused = true;
        this.pauseMenu.style.display = 'flex';
        
        // Pause audio
        Object.values(this.audioElements).forEach(audio => {
            if (!audio.paused) {
                audio.pause();
            }
        });
    }
    
    resumeGame() {
        if (!this.gameStarted || !this.isPaused) return;
        
        this.isPaused = false;
        this.pauseMenu.style.display = 'none';
        
        // Resume audio
        this.playAudio();
    }
    
    restartGame() {
        // Reset game state
        this.currentState = 0;
        this.starsCollected = 0;
        this.updateStarCounter();
        
        // Reset player position
        this.player.position.set(0, 0, 0);
        
        // Create new stars
        this.createStars();
        
        // Create new particles
        this.createParticles();
        
        // Resume game
        this.resumeGame();
    }
    
    handleKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
        
        // Handle ESC key for pause
        if (event.key === 'Escape') {
            if (this.isPaused) {
                this.resumeGame();
            } else {
                this.pauseGame();
            }
        }
    }
    
    handleKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
    }
    
    updatePlayerMovement() {
        if (!this.gameStarted || this.isPaused) return;
        
        // Reset velocity
        this.playerVelocity.set(0, 0, 0);
        
        // Forward/backward
        if (this.keys['w'] || this.keys['arrowup']) {
            this.playerVelocity.z = -0.1;
        } else if (this.keys['s'] || this.keys['arrowdown']) {
            this.playerVelocity.z = 0.1;
        }
        
        // Left/right
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.playerVelocity.x = -0.1;
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.playerVelocity.x = 0.1;
        }
        
        // Up (space)
        if (this.keys[' ']) {
            this.playerVelocity.y = 0.1;
        } else {
            // Apply slight gravity
            this.playerVelocity.y = -0.01;
        }
        
        // Apply velocity to player position
        this.player.position.add(this.playerVelocity);
        
        // Keep player within bounds
        this.player.position.x = Math.max(-50, Math.min(50, this.player.position.x));
        this.player.position.y = Math.max(0, Math.min(20, this.player.position.y));
        this.player.position.z = Math.max(-50, Math.min(50, this.player.position.z));
        
        // Update camera to follow player
        this.camera.position.x = this.player.position.x;
        this.camera.position.y = this.player.position.y + 2;
        this.camera.position.z = this.player.position.z + 5;
        this.camera.lookAt(this.player.position);
    }
    
    updateParticles() {
        // Animate particles based on emotional state
        this.particles.forEach(particle => {
            // Apply velocity
            particle.position.add(particle.userData.velocity);
            
            // Rotate particle
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
            
            // Reset particles that go out of bounds
            if (
                particle.position.x > 50 || particle.position.x < -50 ||
                particle.position.y > 25 || particle.position.y < -25 ||
                particle.position.z > 50 || particle.position.z < -50
            ) {
                particle.position.set(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 100
                );
            }
        });
    }
    
    checkStarCollisions() {
        if (!this.gameStarted || this.isPaused) return;
        
        // Check for collisions with stars
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            const distance = this.player.position.distanceTo(star.position);
            
            // If player is close enough to a star, collect it
            if (distance < 1.5) {
                this.scene.remove(star);
                this.stars.splice(i, 1);
                this.collectStar();
            }
        }
    }
    
    collectStar() {
        this.starsCollected++;
        this.updateStarCounter();
        
        // Check if we've collected enough stars to progress
        if (this.starsCollected >= this.starsNeeded) {
            this.progressToNextState();
        }
    }
    
    updateStarCounter() {
        if (this.starsCollectedElement) {
            this.starsCollectedElement.textContent = this.starsCollected;
        }
    }
    
    progressToNextState() {
        // Play transition sound
        this.audioElements.transition.play();
        
        // Change to next emotional state
        this.currentState = (this.currentState + 1) % this.emotionalStates.length;
        
        // Reset stars
        this.starsCollected = 0;
        this.updateStarCounter();
        
        // Create new stars
        this.createStars();
        
        // Update particles
        this.createParticles();
        
        // Update audio
        this.playAudio();
    }
    
    playAudio() {
        // Stop all audio first
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // Play current state audio
        const currentStateAudio = this.audioElements[this.emotionalStates[this.currentState]];
        if (currentStateAudio) {
            currentStateAudio.volume = this.masterVolume;
            currentStateAudio.play();
        }
        
        // Play ambient audio at lower volume
        this.audioElements.ambient.volume = this.masterVolume * 0.3;
        this.audioElements.ambient.play();
    }
    
    getStateColor() {
        // Return color based on current emotional state
        switch (this.emotionalStates[this.currentState]) {
            case 'joy':
                return 0xffcc00; // Gold
            case 'nostalgia':
                return 0x66aaff; // Light blue
            case 'sorrow':
                return 0x3344aa; // Deep blue
            case 'routine':
                return 0xaaaaaa; // Gray
            default:
                return 0xffffff; // White
        }
    }
    
    onWindowResize() {
        if (!this.initialized) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        this.animationFrameId = requestAnimationFrame(this.animate);
        
        if (!this.isPaused) {
            this.updatePlayerMovement();
            this.updateParticles();
            this.checkStarCollisions();
            
            // Rotate stars
            this.stars.forEach(star => {
                star.rotation.x += 0.01;
                star.rotation.y += 0.01;
            });
            
            // Rotate player
            this.player.rotation.y += 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new EnhancedGame();
});

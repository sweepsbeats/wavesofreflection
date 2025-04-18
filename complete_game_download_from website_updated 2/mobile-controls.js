/**
 * Mobile Controls Module for Waves of Reflection
 * 
 * This module adds touch controls for mobile devices:
 * - Virtual joystick for movement
 * - Dedicated fly button
 * - Mobile device detection
 * - Responsive UI adjustments
 */

class MobileControls {
    constructor(game) {
        this.game = game;
        this.isMobile = this.detectMobile();
        
        // Mobile control elements
        this.joystickContainer = null;
        this.joystickInner = null;
        this.flyButton = null;
        
        // Joystick state
        this.joystickActive = false;
        this.joystickPosition = { x: 0, y: 0 };
        this.joystickStartPosition = { x: 0, y: 0 };
        this.joystickCurrentPosition = { x: 0, y: 0 };
        
        // Fly button state
        this.flyButtonActive = false;
        
        // Initialize if on mobile
        if (this.isMobile) {
            this.init();
        }
    }
    
    /**
     * Detect if the user is on a mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 800 && window.innerHeight <= 900);
    }
    
    /**
     * Initialize mobile controls
     */
    init() {
        console.log('Initializing mobile controls...');
        
        // Create mobile control elements
        this.createMobileControls();
        
        // Add event listeners
        this.addEventListeners();
        
        // Adjust UI for mobile
        this.adjustUIForMobile();
    }
    
    /**
     * Create mobile control elements
     */
    createMobileControls() {
        // Create joystick container
        this.joystickContainer = document.createElement('div');
        this.joystickContainer.id = 'joystick-container';
        this.joystickContainer.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 80px;
            width: 120px;
            height: 120px;
            background-color: rgba(255, 215, 0, 0.2);
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 50%;
            touch-action: none;
            z-index: 300;
        `;
        
        // Create joystick inner circle
        this.joystickInner = document.createElement('div');
        this.joystickInner.id = 'joystick-inner';
        this.joystickInner.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background-color: rgba(255, 215, 0, 0.5);
            border-radius: 50%;
            touch-action: none;
        `;
        
        // Create fly button
        this.flyButton = document.createElement('div');
        this.flyButton.id = 'fly-button';
        this.flyButton.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 80px;
            width: 100px;
            height: 100px;
            background-color: rgba(255, 215, 0, 0.2);
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            touch-action: none;
            z-index: 300;
        `;
        
        // Add fly icon to button
        this.flyButton.innerHTML = `
            <div style="
                font-size: 24px;
                color: rgba(255, 215, 0, 0.8);
                transform: translateY(-5px);
            ">↑</div>
        `;
        
        // Add elements to DOM
        this.joystickContainer.appendChild(this.joystickInner);
        document.body.appendChild(this.joystickContainer);
        document.body.appendChild(this.flyButton);
    }
    
    /**
     * Add event listeners for touch controls
     */
    addEventListeners() {
        // Joystick touch events
        this.joystickContainer.addEventListener('touchstart', this.onJoystickStart.bind(this));
        document.addEventListener('touchmove', this.onJoystickMove.bind(this));
        document.addEventListener('touchend', this.onJoystickEnd.bind(this));
        
        // Fly button touch events
        this.flyButton.addEventListener('touchstart', this.onFlyButtonStart.bind(this));
        this.flyButton.addEventListener('touchend', this.onFlyButtonEnd.bind(this));
        
        // Prevent default touch behavior to avoid scrolling
        document.addEventListener('touchmove', function(e) {
            if (e.target.id === 'joystick-container' || 
                e.target.id === 'joystick-inner' || 
                e.target.id === 'fly-button') {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Handle orientation change
        window.addEventListener('orientationchange', this.adjustUIForMobile.bind(this));
        window.addEventListener('resize', this.adjustUIForMobile.bind(this));
    }
    
    /**
     * Adjust UI elements for mobile
     */
    adjustUIForMobile() {
        // Hide desktop controls info
        const controlsInfo = document.getElementById('controls-info');
        if (controlsInfo) {
            controlsInfo.style.display = 'none';
        }
        
        // Hide desktop controls panel
        const controlsPanel = document.getElementById('controls-panel');
        if (controlsPanel) {
            controlsPanel.style.display = 'none';
        }
        
        // Adjust volume control position
        const volumeControl = document.getElementById('volume-control');
        if (volumeControl) {
            volumeControl.style.bottom = '180px';
        }
        
        // Add mobile instructions
        const mobileInstructions = document.createElement('div');
        mobileInstructions.id = 'mobile-instructions';
        mobileInstructions.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            text-align: center;
            pointer-events: none;
            opacity: 1;
            transition: opacity 3s ease;
            z-index: 150;
        `;
        mobileInstructions.innerHTML = '<p>Use joystick to move | Tap right button to fly up</p>';
        
        // Add to DOM if not already present
        if (!document.getElementById('mobile-instructions')) {
            document.body.appendChild(mobileInstructions);
            
            // Hide instructions after delay
            setTimeout(() => {
                mobileInstructions.style.opacity = 0;
            }, 10000);
        }
    }
    
    /**
     * Handle joystick touch start
     */
    onJoystickStart(event) {
        if (event.touches.length > 0) {
            this.joystickActive = true;
            
            // Get touch position
            const touch = event.touches[0];
            const rect = this.joystickContainer.getBoundingClientRect();
            
            // Calculate center of joystick container
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Store start position
            this.joystickStartPosition = { x: centerX, y: centerY };
            this.joystickCurrentPosition = { x: touch.clientX, y: touch.clientY };
            
            // Update joystick position
            this.updateJoystickPosition();
        }
    }
    
    /**
     * Handle joystick touch move
     */
    onJoystickMove(event) {
        if (this.joystickActive && event.touches.length > 0) {
            // Get touch position
            const touch = event.touches[0];
            this.joystickCurrentPosition = { x: touch.clientX, y: touch.clientY };
            
            // Update joystick position
            this.updateJoystickPosition();
        }
    }
    
    /**
     * Handle joystick touch end
     */
    onJoystickEnd() {
        this.joystickActive = false;
        
        // Reset joystick position
        this.joystickInner.style.transform = 'translate(-50%, -50%)';
        
        // Reset game movement
        this.game.keys.forward = false;
        this.game.keys.backward = false;
        this.game.keys.left = false;
        this.game.keys.right = false;
    }
    
    /**
     * Update joystick position and game movement
     */
    updateJoystickPosition() {
        // Calculate joystick displacement
        const deltaX = this.joystickCurrentPosition.x - this.joystickStartPosition.x;
        const deltaY = this.joystickCurrentPosition.y - this.joystickStartPosition.y;
        
        // Calculate distance from center
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Limit distance to joystick radius
        const maxDistance = 40;
        const limitedDistance = Math.min(distance, maxDistance);
        
        // Calculate normalized direction
        const angle = Math.atan2(deltaY, deltaX);
        const limitedX = limitedDistance * Math.cos(angle);
        const limitedY = limitedDistance * Math.sin(angle);
        
        // Update joystick inner position
        this.joystickInner.style.transform = `translate(calc(-50% + ${limitedX}px), calc(-50% + ${limitedY}px))`;
        
        // Update game movement based on joystick position
        const deadzone = 10;
        
        // Reset all directions
        this.game.keys.forward = false;
        this.game.keys.backward = false;
        this.game.keys.left = false;
        this.game.keys.right = false;
        
        // Apply movement if outside deadzone
        if (distance > deadzone) {
            // Forward/backward (Y-axis)
            if (deltaY < -deadzone) {
                this.game.keys.forward = true;
            } else if (deltaY > deadzone) {
                this.game.keys.backward = true;
            }
            
            // Left/right (X-axis)
            if (deltaX < -deadzone) {
                this.game.keys.left = true;
            } else if (deltaX > deadzone) {
                this.game.keys.right = true;
            }
        }
    }
    
    /**
     * Handle fly button touch start
     */
    onFlyButtonStart() {
        this.flyButtonActive = true;
        this.game.keys.space = true;
        
        // Visual feedback
        this.flyButton.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
    }
    
    /**
     * Handle fly button touch end
     */
    onFlyButtonEnd() {
        this.flyButtonActive = false;
        this.game.keys.space = false;
        
        // Reset visual feedback
        this.flyButton.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
    }
}

/**
 * Mobile Controls Module for Waves of Reflection
 * 
 * This module adds touch controls for mobile devices:
 * - Virtual joystick for movement
 * - Dedicated fly button
 * - Mobile device detection
 * - Responsive UI adjustments
 * - Wider field of view for mobile screens
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
        this.joystickTouchId = null;
        this.joystickStartPosition = { x: 0, y: 0 };
        this.joystickCurrentPosition = { x: 0, y: 0 };
        
        // Fly button state
        this.flyButtonActive = false;
        this.flyButtonTouchId = null;
        
        // Field of view settings
        this.defaultFOV = 75;
        this.mobileFOV = 90; // Wider FOV for mobile
        
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
        
        // Adjust field of view for mobile
        this.adjustFieldOfView();
    }
    
    /**
     * Create mobile control elements
     */
    createMobileControls() {
        // Create fly button - now on the left side
        this.flyButton = document.createElement('div');
        this.flyButton.id = 'fly-button';
        this.flyButton.style.cssText = `
            position: fixed;
            bottom: 55px;
            left: 55px;
            width: 120px;
            height: 120px;
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
        
        // Create joystick container - now on the right side
        this.joystickContainer = document.createElement('div');
        this.joystickContainer.id = 'joystick-container';
        this.joystickContainer.style.cssText = `
            position: fixed;
            bottom: 55px;
            right: 55px;
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
            width: 40px;
            height: 40px;
            background-color: rgba(255, 215, 0, 0.5);
            border-radius: 50%;
            touch-action: none;
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
        // Touch event listeners for the entire document
        document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        document.addEventListener('touchcancel', this.onTouchEnd.bind(this), { passive: false });
        
        // Handle orientation change
        window.addEventListener('orientationchange', this.adjustUIForMobile.bind(this));
        window.addEventListener('resize', this.adjustUIForMobile.bind(this));
    }
    
    /**
     * Handle touch start for all elements
     */
    onTouchStart(event) {
        // Prevent default behavior for control elements
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            const target = touch.target;
            
            if (this.isControlElement(target)) {
                event.preventDefault();
            }
            
            // Check if touch is on joystick
            if (this.joystickContainer.contains(target) && !this.joystickActive) {
                this.joystickActive = true;
                this.joystickTouchId = touch.identifier;
                
                // Get joystick position
                const rect = this.joystickContainer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                this.joystickStartPosition = { x: centerX, y: centerY };
                this.joystickCurrentPosition = { x: touch.clientX, y: touch.clientY };
                
                this.updateJoystickPosition();
            }
            
            // Check if touch is on fly button
            if (this.flyButton.contains(target) && !this.flyButtonActive) {
                this.flyButtonActive = true;
                this.flyButtonTouchId = touch.identifier;
                this.game.keys.space = true;
                
                // Visual feedback
                this.flyButton.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
            }
        }
    }
    
    /**
     * Handle touch move for all elements
     */
    onTouchMove(event) {
        // Prevent default behavior for control elements
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            if (this.isControlElement(touch.target)) {
                event.preventDefault();
            }
        }
        
        // Update joystick position if active
        if (this.joystickActive) {
            for (let i = 0; i < event.touches.length; i++) {
                const touch = event.touches[i];
                if (touch.identifier === this.joystickTouchId) {
                    this.joystickCurrentPosition = { x: touch.clientX, y: touch.clientY };
                    this.updateJoystickPosition();
                    break;
                }
            }
        }
    }
    
    /**
     * Handle touch end for all elements
     */
    onTouchEnd(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            
            // Check if joystick touch ended
            if (touch.identifier === this.joystickTouchId) {
                this.joystickActive = false;
                this.joystickTouchId = null;
                
                // Reset joystick position
                this.joystickInner.style.transform = 'translate(-50%, -50%)';
                
                // Reset movement keys
                this.game.keys.forward = false;
                this.game.keys.backward = false;
                this.game.keys.left = false;
                this.game.keys.right = false;
            }
            
            // Check if fly button touch ended
            if (touch.identifier === this.flyButtonTouchId) {
                this.flyButtonActive = false;
                this.flyButtonTouchId = null;
                this.game.keys.space = false;
                
                // Reset visual feedback
                this.flyButton.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
            }
        }
    }
    
    /**
     * Check if an element is part of the controls
     */
    isControlElement(element) {
        return this.joystickContainer.contains(element) || 
               this.flyButton.contains(element) ||
               element.id === 'joystick-container' || 
               element.id === 'joystick-inner' || 
               element.id === 'fly-button';
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
     * Adjust field of view for mobile devices
     */
    adjustFieldOfView() {
        if (this.game && this.game.camera) {
            // Store original FOV for reference
            if (!this.game.camera.userData) {
                this.game.camera.userData = {};
            }
            
            if (!this.game.camera.userData.originalFOV) {
                this.game.camera.userData.originalFOV = this.game.camera.fov;
            }
            
            // Set wider FOV for mobile
            this.game.camera.fov = this.mobileFOV;
            this.game.camera.updateProjectionMatrix();
            
            console.log(`Adjusted field of view for mobile: ${this.mobileFOV} degrees`);
        } else {
            // If camera isn't available yet, try again after a delay
            setTimeout(() => this.adjustFieldOfView(), 500);
        }
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
        
        // Adjust volume control position - at bottom right
        const volumeControl = document.getElementById('volume-control');
        if (volumeControl) {
            volumeControl.style.bottom = '20px';
            volumeControl.style.right = '20px';
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
        mobileInstructions.innerHTML = '<p>Use right joystick to move | Tap left button to fly up</p>';
        
        // Add to DOM if not already present
        if (!document.getElementById('mobile-instructions')) {
            document.body.appendChild(mobileInstructions);
            
            // Hide instructions after delay
            setTimeout(() => {
                mobileInstructions.style.opacity = 0;
            }, 10000);
        }
        
        // Override desktop welcome message for mobile
        if (this.game && this.game.displayMessage) {
            const originalDisplayMessage = this.game.displayMessage;
            this.game.displayMessage = function(message) {
                // Replace desktop control instructions with mobile-friendly message
                if (message.includes('Use SPACE to fly upward')) {
                    message = 'Collect stars to progress through the journey.';
                }
                originalDisplayMessage.call(this.game, message);
            }.bind(this);
        }
        
        // Re-adjust field of view if needed
        this.adjustFieldOfView();
    }
}

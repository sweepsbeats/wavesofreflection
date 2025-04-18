/**
 * Album Artwork Footer Module for Waves of Reflection
 * 
 * This module adds a clickable album artwork at the bottom center of the screen
 * that links to the Bandcamp album page.
 */

class AlbumArtworkFooter {
    constructor() {
        this.albumLink = 'https://sweepsbeats.bandcamp.com/album/waves-of-reflection';
        this.artworkSize = 60; // Size in pixels
        this.footerElement = null;
        this.isMobile = this.detectMobile();
        
        // Initialize
        this.init();
    }
    
    /**
     * Detect if the user is on a mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 800 && window.innerHeight <= 900);
    }
    
    /**
     * Initialize album artwork footer
     */
    init() {
        console.log('Initializing album artwork footer...');
        
        // Create footer element
        this.createFooterElement();
        
        // Add to DOM
        document.body.appendChild(this.footerElement);
        
        // Adjust position for mobile controls if needed
        window.addEventListener('resize', this.adjustPosition.bind(this));
        this.adjustPosition();
    }
    
    /**
     * Create footer element with album artwork
     */
    createFooterElement() {
        // Create container
        this.footerElement = document.createElement('div');
        this.footerElement.id = 'album-artwork-footer';
        this.footerElement.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: ${this.artworkSize}px;
            height: ${this.artworkSize}px;
            z-index: 400;
            cursor: pointer;
            transition: transform 0.3s ease;
        `;
        
        // Create album artwork image
        const artworkImage = document.createElement('img');
        artworkImage.src = 'album_artwork/album_artwork.jpg';
        artworkImage.alt = 'Waves of Reflection Album';
        artworkImage.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
            transition: box-shadow 0.3s ease;
        `;
        
        // Add hover effects for desktop
        if (!this.isMobile) {
            this.footerElement.addEventListener('mouseenter', () => {
                this.footerElement.style.transform = 'translateX(-50%) scale(1.1)';
                artworkImage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.9)';
            });
            
            this.footerElement.addEventListener('mouseleave', () => {
                this.footerElement.style.transform = 'translateX(-50%)';
                artworkImage.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
            });
        }
        
        // Add touch feedback for mobile
        if (this.isMobile) {
            this.footerElement.addEventListener('touchstart', () => {
                this.footerElement.style.transform = 'translateX(-50%) scale(1.1)';
                artworkImage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.9)';
            });
            
            this.footerElement.addEventListener('touchend', () => {
                this.footerElement.style.transform = 'translateX(-50%)';
                artworkImage.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
            });
        }
        
        // Add click event to open Bandcamp link
        this.footerElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(this.albumLink, '_blank');
        });
        
        // Add tooltip (for desktop only)
        if (!this.isMobile) {
            const tooltip = document.createElement('div');
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                margin-bottom: 5px;
            `;
            tooltip.textContent = 'Listen on Bandcamp';
            
            this.footerElement.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
            
            this.footerElement.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
            
            this.footerElement.appendChild(tooltip);
        }
        
        // Add elements to container
        this.footerElement.appendChild(artworkImage);
    }
    
    /**
     * Adjust position based on screen size and controls
     */
    adjustPosition() {
        if (this.isMobile) {
            // Position higher on mobile to avoid controls
            this.footerElement.style.bottom = '160px';
        } else {
            // Standard position on desktop
            this.footerElement.style.bottom = '10px';
        }
    }
}

// Initialize album artwork footer when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new AlbumArtworkFooter();
});

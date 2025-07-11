// Input Manager - Handles keyboard and mouse input

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = { x: 0, y: 0, pressed: false };
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      this.keys[e.code] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.keys[e.code] = false;
    });

    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.pressed = true;
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.mouse.pressed = false;
    });

    this.canvas.addEventListener('click', (e) => {
      // Click event will be handled by game logic
      this.mouse.clicked = true;
      // Reset click flag after a short delay
      setTimeout(() => {
        this.mouse.clicked = false;
      }, 100);
    });
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(keyCode) {
    return !!this.keys[keyCode];
  }

  /**
   * Check if any of the provided keys are pressed
   */
  isAnyKeyPressed(keyCodes) {
    return keyCodes.some(key => this.isKeyPressed(key));
  }

  /**
   * Get mouse position
   */
  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  /**
   * Check if mouse was clicked
   */
  isMouseClicked() {
    return this.mouse.clicked;
  }

  /**
   * Check if mouse is pressed
   */
  isMousePressed() {
    return this.mouse.pressed;
  }

  /**
   * Check for paddle movement input
   */
  getPaddleMovement() {
    let movement = 0;
    
    if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) {
      movement -= 1;
    }
    if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) {
      movement += 1;
    }
    
    return movement;
  }

  /**
   * Check for ball launch input
   */
  isBallLaunchPressed() {
    return this.isAnyKeyPressed([' ', 'Space']) || this.isMouseClicked();
  }

  /**
   * Check for restart input
   */
  isRestartPressed() {
    return this.isAnyKeyPressed(['r', 'R', 'KeyR']);
  }

  /**
   * Check for pause input
   */
  isPausePressed() {
    return this.isAnyKeyPressed(['p', 'P', 'KeyP', 'Escape']);
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    // Remove event listeners if needed
    // This would be useful for cleanup when switching scenes
  }
}

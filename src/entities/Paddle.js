// Paddle Entity
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = GameConfig.paddle.width;
    this.height = GameConfig.paddle.height;
    this.speed = GameConfig.paddle.speed;
    this.originalWidth = GameConfig.paddle.width;
  }

  /**
   * Update paddle position based on input
   */
  update(inputManager, canvasWidth) {
    // Keyboard controls
    const movement = inputManager.getPaddleMovement();
    if (movement !== 0) {
      this.x += movement * this.speed;
    }

    // Mouse controls (alternative)
    const mousePos = inputManager.getMousePosition();
    if (mousePos.x > 0) {
      this.x = mousePos.x - this.width / 2;
    }

    // Keep paddle within bounds
    this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.width);
  }

  /**
   * Render the paddle
   */
  render(ctx) {
    // Paddle gradient
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#00ff88');
    gradient.addColorStop(1, '#00cc66');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Paddle highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(this.x, this.y, this.width, 3);
  }

  /**
   * Get paddle bounds for collision detection
   */
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  /**
   * Get center position of paddle
   */
  getCenterX() {
    return this.x + this.width / 2;
  }

  /**
   * Reset paddle to original width (for power-up cleanup)
   */
  resetWidth() {
    this.width = this.originalWidth;
  }

  /**
   * Set paddle width (for power-ups)
   */
  setWidth(newWidth) {
    this.width = newWidth;
  }

  /**
   * Get hit position ratio (0 = left edge, 1 = right edge)
   * Used for calculating ball bounce angle
   */
  getHitPosition(ballX) {
    return MathUtils.clamp((ballX - this.x) / this.width, 0, 1);
  }
}

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
  update(inputManager, canvasWidth, deltaTime = 1/60) {
    // Time-based keyboard controls (20 pixels per second)
    const movement = inputManager.getContinuousMovement();
    if (movement !== 0) {
      this.x += movement * this.speed * deltaTime;
    }

    // Mouse controls (alternative) - only if no keyboard input
    if (movement === 0) {
      const mousePos = inputManager.getMousePosition();
      if (mousePos.x > 0) {
        this.x = mousePos.x - this.width / 2;
      }
    }

    // Keep paddle within bounds
    this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.width);
  }

  /**
   * Render the paddle with Tron-style appearance
   */
  render(ctx) {
    ctx.save();
    
    // Main paddle body with glass-like appearance
    const paddleGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height
    );
    paddleGradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
    paddleGradient.addColorStop(0.5, 'rgba(102, 229, 255, 0.2)');
    paddleGradient.addColorStop(1, 'rgba(0, 153, 204, 0.4)');
    
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Glowing edges
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Outer glow effect
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    
    // Top highlight for glass effect
    const highlightGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height * 0.4
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = highlightGradient;
    ctx.fillRect(this.x + 2, this.y + 1, this.width - 4, this.height * 0.4);
    
    // Center line for detail
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 2);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height - 2);
    ctx.stroke();
    
    // Corner accents
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(this.x + 1, this.y + 1, 2, 2); // Top-left
    ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, 2); // Top-right
    
    ctx.restore();
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

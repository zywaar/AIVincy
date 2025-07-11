// Brick Entity
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Brick {
  constructor(x, y, color, health, points) {
    this.x = x;
    this.y = y;
    this.width = GameConfig.bricks.width;
    this.height = GameConfig.bricks.height;
    this.color = color;
    this.health = health;
    this.maxHealth = health;
    this.points = points;
    this.destroyed = false;
  }

  /**
   * Hit the brick and reduce health
   * Returns points if brick is destroyed, 0 otherwise
   */
  hit() {
    this.health--;
    if (this.health <= 0) {
      this.destroyed = true;
      return this.points;
    }
    return 0;
  }

  /**
   * Render the brick
   */
  render(ctx) {
    if (this.destroyed) return;

    // Brick color based on health
    let brickColor = this.color;
    if (this.health < this.maxHealth) {
      // Darken color when damaged
      brickColor = this.getDamagedColor();
    }

    // Brick gradient
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, brickColor);
    gradient.addColorStop(1, MathUtils.darkenColor(brickColor));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Brick border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Brick highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(this.x, this.y, this.width, 3);
  }

  /**
   * Get damaged color version
   */
  getDamagedColor() {
    const colors = {
      '#ff4444': '#cc2222',
      '#ff8844': '#cc5522',
      '#ffff44': '#cccc22',
      '#44ff44': '#22cc22',
      '#4444ff': '#2222cc',
      '#ff44ff': '#cc22cc'
    };
    return colors[this.color] || this.color;
  }

  /**
   * Get brick bounds for collision detection
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
   * Get center position for power-up drops
   */
  getCenterX() {
    return this.x + this.width / 2;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  /**
   * Check if brick is destroyed
   */
  isDestroyed() {
    return this.destroyed;
  }

  /**
   * Get health percentage (for visual effects)
   */
  getHealthPercentage() {
    return this.health / this.maxHealth;
  }

  /**
   * Static method to create brick layout
   */
  static createBrickLayout() {
    const bricks = [];
    const config = GameConfig.bricks;
    const brickTypes = GameConfig.brickTypes;
    
    const startX = (GameConfig.canvas.width - (config.cols * (config.width + config.padding) - config.padding)) / 2;
    const startY = config.startY;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const x = startX + col * (config.width + config.padding);
        const y = startY + row * (config.height + config.padding);
        
        const brickType = brickTypes[row % brickTypes.length];
        const brick = new Brick(x, y, brickType.color, brickType.health, brickType.points);
        bricks.push(brick);
      }
    }

    return bricks;
  }

  /**
   * Check collision with ball and determine bounce direction
   */
  checkCollisionWithBall(ball) {
    if (this.destroyed) return null;

    const ballBounds = ball.getBounds();
    const brickBounds = this.getBounds();

    if (MathUtils.rectanglesOverlap(ballBounds, brickBounds)) {
      // Calculate which side was hit
      const ballCenterX = ball.x;
      const ballCenterY = ball.y;
      const brickCenterX = this.getCenterX();
      const brickCenterY = this.getCenterY();

      const deltaX = ballCenterX - brickCenterX;
      const deltaY = ballCenterY - brickCenterY;

      // Determine collision side
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Hit left or right side
        return 'horizontal';
      } else {
        // Hit top or bottom
        return 'vertical';
      }
    }

    return null;
  }
}

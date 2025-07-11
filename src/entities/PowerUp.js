// PowerUp Entity
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = GameConfig.powerUps.width;
    this.height = GameConfig.powerUps.height;
    this.type = type;
    this.speedY = GameConfig.powerUps.speed;
    this.collected = false;
    this.colors = GameConfig.powerUps.colors;
  }

  /**
   * Update power-up position (falling)
   */
  update(canvasHeight) {
    this.y += this.speedY;
    
    // Remove if it falls off screen (check if powerup will be off screen)
    if (this.y > canvasHeight - this.height) {
      this.collected = true; // Mark for removal
    }
  }

  /**
   * Render the power-up
   */
  render(ctx) {
    if (this.collected) return;

    // PowerUp gradient
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, this.colors[this.type]);
    gradient.addColorStop(1, MathUtils.darkenColor(this.colors[this.type]));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // PowerUp border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // PowerUp text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    const text = this.getDisplayText();
    ctx.fillText(text, this.x + this.width/2, this.y + this.height/2 + 3);
  }

  /**
   * Get display text for power-up
   */
  getDisplayText() {
    const textMap = {
      'wide_paddle': 'WIDE',
      'multi_ball': 'MULTI',
      'slow_ball': 'SLOW'
    };
    return textMap[this.type] || 'PWR';
  }

  /**
   * Get power-up bounds for collision detection
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
   * Check collision with paddle
   */
  checkCollision(paddle) {
    if (this.collected) return false;
    
    const powerUpBounds = this.getBounds();
    const paddleBounds = paddle.getBounds();

    return MathUtils.rectanglesCollide(powerUpBounds, paddleBounds);
  }

  /**
   * Mark power-up as collected
   */
  collect() {
    this.collected = true;
  }

  /**
   * Check if power-up should be removed
   */
  shouldRemove() {
    return this.collected;
  }

  /**
   * Static method to create random power-up
   */
  static createRandom(x, y) {
    const types = GameConfig.powerUps.types;
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new PowerUp(x, y, randomType);
  }

  /**
   * Static method to check if power-up should drop
   */
  static shouldDrop() {
    return Math.random() < GameConfig.powerUps.dropRate;
  }

  /**
   * Get power-up description for UI
   */
  getDescription() {
    const descriptions = {
      'wide_paddle': 'Increases paddle width by 50%',
      'multi_ball': 'Spawns additional balls',
      'slow_ball': 'Reduces ball speed by 30%'
    };
    return descriptions[this.type] || 'Unknown power-up';
  }

  /**
   * Get power-up duration
   */
  getDuration() {
    return GameConfig.powerUps.duration;
  }

  /**
   * Get power-up priority (for AI assistance)
   */
  getPriority() {
    const priorities = {
      'wide_paddle': 3, // High priority for struggling players
      'slow_ball': 2,   // Medium priority
      'multi_ball': 1   // Low priority (can be overwhelming)
    };
    return priorities[this.type] || 1;
  }
}

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
   * Render the power-up with Tron-style glass effect
   */
  render(ctx) {
    if (this.collected) return;

    const rgb = this.hexToRgb(this.colors[this.type]);
    if (!rgb) return;
    
    ctx.save();
    
    // Glass-like transparent fill using power-up color
    const glassGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height
    );
    glassGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    glassGradient.addColorStop(0.5, `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)}, 0.2)`);
    glassGradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 30)}, ${Math.max(0, rgb.g - 30)}, ${Math.max(0, rgb.b - 30)}, 0.25)`);
    
    ctx.fillStyle = glassGradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Glowing edges
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Outer glow effect
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    
    // Inner light reflection (top edge)
    const reflectionGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height * 0.4
    );
    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = reflectionGradient;
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height * 0.4);
    
    // Corner highlights for glass effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(this.x + 1, this.y + 1, 2, 2); // Top-left
    ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, 2); // Top-right
    
    // Text label (keep existing text rendering but with enhanced contrast)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    
    const text = this.getDisplayText();
    const textX = this.x + this.width / 2;
    const textY = this.y + this.height / 2 + 3;
    
    // Text outline for better visibility on glass
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
    
    ctx.restore();
  }

  /**
   * Convert hex color to RGB values
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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

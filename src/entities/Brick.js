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
    this.destroyed = health <= 0; // Immediately destroyed if health is 0 or negative
  }

  /**
   * Hit the brick and reduce health
   * Returns points if brick is destroyed, 0 otherwise
   */
  hit() {
    // Don't process hits on already destroyed bricks
    if (this.destroyed) {
      return 0;
    }
    
    this.health--;
    if (this.health <= 0) {
      this.destroyed = true;
      return this.points;
    }
    return 0;
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
   * Render the brick with Tron-style glass appearance using original colors
   */
  render(ctx) {
    if (this.destroyed) return;

    const healthPercent = this.getHealthPercentage();
    const baseOpacity = 0.15 + (healthPercent * 0.25); // More transparent when damaged
    
    // Convert brick color to RGB
    const rgb = this.hexToRgb(this.color);
    if (!rgb) return; // Skip if color conversion fails
    
    ctx.save();
    
    // Glass-like transparent fill using original color
    const glassGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height
    );
    glassGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${baseOpacity * 0.8})`);
    glassGradient.addColorStop(0.5, `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)}, ${baseOpacity * 0.4})`);
    glassGradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 30)}, ${Math.max(0, rgb.g - 30)}, ${Math.max(0, rgb.b - 30)}, ${baseOpacity * 0.6})`);
    
    ctx.fillStyle = glassGradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Glowing edges using original color
    const glowIntensity = healthPercent * 0.8 + 0.2; // Dimmer when damaged
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowIntensity})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Outer glow effect
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowIntensity * 0.3})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    
    // Inner light reflection (top edge)
    const reflectionGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height * 0.3
    );
    reflectionGradient.addColorStop(0, `rgba(255, 255, 255, ${healthPercent * 0.4})`);
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = reflectionGradient;
    ctx.fillRect(this.x + 2, this.y + 1, this.width - 4, this.height * 0.3);
    
    // Corner highlights for glass effect
    ctx.fillStyle = `rgba(255, 255, 255, ${healthPercent * 0.6})`;
    ctx.fillRect(this.x + 1, this.y + 1, 3, 3); // Top-left
    ctx.fillRect(this.x + this.width - 4, this.y + 1, 3, 3); // Top-right
    
    // Damage indicator - cracks using original color with enhanced visibility
    if (this.health < this.maxHealth) {
      // Add crack-like lines for damaged bricks with brighter appearance
      const crackOpacity = (1 - healthPercent) * 0.8; // Increased from 0.5 to 0.8
      
      // Main crack lines
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${crackOpacity})`;
      ctx.lineWidth = 1.5; // Slightly thicker for better visibility
      ctx.beginPath();
      
      // Random crack pattern based on brick position (consistent)
      const seed = this.x + this.y;
      const crack1X = this.x + (seed % this.width);
      const crack1Y = this.y + ((seed * 2) % this.height);
      const crack2X = this.x + ((seed * 3) % this.width);
      const crack2Y = this.y + ((seed * 4) % this.height);
      
      ctx.moveTo(crack1X, this.y);
      ctx.lineTo(crack2X, this.y + this.height);
      ctx.moveTo(this.x, crack1Y);
      ctx.lineTo(this.x + this.width, crack2Y);
      ctx.stroke();
      
      // Add subtle white highlights to cracks for glass effect
      ctx.strokeStyle = `rgba(255, 255, 255, ${crackOpacity * 0.6})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(crack1X + 1, this.y);
      ctx.lineTo(crack2X + 1, this.y + this.height);
      ctx.moveTo(this.x + 1, crack1Y);
      ctx.lineTo(this.x + this.width + 1, crack2Y);
      ctx.stroke();
      
      // Add glow effect around cracks
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${crackOpacity * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(crack1X, this.y);
      ctx.lineTo(crack2X, this.y + this.height);
      ctx.moveTo(this.x, crack1Y);
      ctx.lineTo(this.x + this.width, crack2Y);
      ctx.stroke();
    }
    
    ctx.restore();
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
    if (this.maxHealth === 0) return 0;
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

    if (MathUtils.rectanglesCollide(ballBounds, brickBounds)) {
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

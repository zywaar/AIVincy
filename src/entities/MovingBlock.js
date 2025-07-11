// MovingBlock Entity for Hard Mode
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class MovingBlock {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = GameConfig.movingBlocks.width;
    this.height = GameConfig.movingBlocks.height;
    this.speed = speed; // pixels per second
    this.direction = 1; // 1 for right, -1 for left
    this.color = GameConfig.movingBlocks.color;
    
    // Trail system for Tron effect
    this.trail = [];
    this.maxTrailLength = GameConfig.movingBlocks.trailLength;
    this.trailDistance = 50; // Maximum trail distance in pixels
  }

  /**
   * Update block position and handle wall collisions
   */
  update(canvasWidth, deltaTime) {
    // Update trail before moving
    this.updateTrail();
    
    // Update position based on speed and direction
    this.x += this.speed * this.direction * deltaTime;
    
    // Handle wall collisions
    if (this.x <= 0) {
      this.x = 0;
      this.direction = 1; // Move right
    } else if (this.x + this.width >= canvasWidth) {
      this.x = canvasWidth - this.width;
      this.direction = -1; // Move left
    }
  }

  /**
   * Update trail system
   */
  updateTrail() {
    // Add current position to trail
    this.trail.push({ x: this.x + this.width / 2, y: this.y + this.height / 2 });
    
    // Remove old trail points that are too far or too many
    this.trail = this.trail.filter((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.x - (this.x + this.width / 2), 2) + 
        Math.pow(point.y - (this.y + this.height / 2), 2)
      );
      return distance <= this.trailDistance && index >= this.trail.length - this.maxTrailLength;
    });
  }

  /**
   * Render the moving block with Tron-style orange appearance and trail
   */
  render(ctx) {
    // Render trail first (behind block)
    this.renderTrail(ctx);
    
    ctx.save();
    
    // Convert orange hex to RGB for gradients
    const rgb = { r: 255, g: 102, b: 0 }; // #FF6600
    
    // Main block body with glass-like appearance
    const blockGradient = ctx.createLinearGradient(
      this.x, this.y, this.x, this.y + this.height
    );
    blockGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    blockGradient.addColorStop(0.5, `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${rgb.b}, 0.2)`);
    blockGradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 30)}, ${Math.max(0, rgb.g - 30)}, ${rgb.b}, 0.4)`);
    
    ctx.fillStyle = blockGradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Glowing edges
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Outer glow effect
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
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
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 2);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height - 2);
    ctx.stroke();
    
    // Corner accents
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(this.x + 1, this.y + 1, 2, 2); // Top-left
    ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, 2); // Top-right
    
    // Direction indicator (subtle arrow)
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
    const arrowX = this.x + this.width / 2 + (this.direction * 15);
    const arrowY = this.y + this.height / 2;
    ctx.beginPath();
    if (this.direction === 1) {
      // Right arrow
      ctx.moveTo(arrowX - 5, arrowY - 3);
      ctx.lineTo(arrowX + 2, arrowY);
      ctx.lineTo(arrowX - 5, arrowY + 3);
    } else {
      // Left arrow
      ctx.moveTo(arrowX + 5, arrowY - 3);
      ctx.lineTo(arrowX - 2, arrowY);
      ctx.lineTo(arrowX + 5, arrowY + 3);
    }
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Render the light trail
   */
  renderTrail(ctx) {
    if (this.trail.length < 2) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen'; // Additive blending for glow effect
    
    const rgb = { r: 255, g: 102, b: 0 }; // Orange color
    
    // Draw trail segments
    for (let i = 1; i < this.trail.length; i++) {
      const current = this.trail[i];
      const previous = this.trail[i - 1];
      
      // Calculate opacity based on distance from current position
      const distance = Math.sqrt(
        Math.pow(current.x - (this.x + this.width / 2), 2) + 
        Math.pow(current.y - (this.y + this.height / 2), 2)
      );
      const opacity = Math.max(0, 1 - (distance / this.trailDistance));
      const segmentOpacity = opacity * (i / this.trail.length); // Fade towards tail
      
      // Trail segment gradient
      const trailGradient = ctx.createLinearGradient(
        previous.x, previous.y, current.x, current.y
      );
      trailGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${segmentOpacity * 0.8})`);
      trailGradient.addColorStop(1, `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${rgb.b}, ${segmentOpacity * 0.4})`);
      
      // Draw trail segment
      ctx.strokeStyle = trailGradient;
      ctx.lineWidth = this.height * 0.8 * segmentOpacity;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
      
      // Add glow to trail segment
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${segmentOpacity * 0.3})`;
      ctx.lineWidth = this.height * 1.5 * segmentOpacity;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * Get block bounds for collision detection
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
   * Get center position
   */
  getCenterX() {
    return this.x + this.width / 2;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  /**
   * Check collision with ball and handle bounce
   */
  checkCollisionWithBall(ball) {
    const ballBounds = ball.getBounds();
    const blockBounds = this.getBounds();

    if (MathUtils.rectanglesCollide(ballBounds, blockBounds)) {
      // Calculate which side was hit
      const ballCenterX = ball.x;
      const ballCenterY = ball.y;
      const blockCenterX = this.getCenterX();
      const blockCenterY = this.getCenterY();

      const deltaX = ballCenterX - blockCenterX;
      const deltaY = ballCenterY - blockCenterY;

      // Determine collision side and bounce accordingly
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Hit left or right side
        ball.reverseX();
        // Position correction to prevent sticking
        if (ballCenterX < blockCenterX) {
          ball.x = this.x - ball.radius;
        } else {
          ball.x = this.x + this.width + ball.radius;
        }
        return 'horizontal';
      } else {
        // Hit top or bottom
        ball.reverseY();
        // Position correction
        if (ballCenterY < blockCenterY) {
          ball.y = this.y - ball.radius;
        } else {
          ball.y = this.y + this.height + ball.radius;
        }
        return 'vertical';
      }
    }

    return null;
  }
}

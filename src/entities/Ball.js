// Ball Entity
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = GameConfig.ball.radius;
    this.speedX = GameConfig.ball.speed * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = -GameConfig.ball.speed;
    this.originalSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
    this.onPaddle = true;
    
    // Trail system for Tron effect
    this.trail = [];
    this.maxTrailLength = 15; // Number of trail points
    this.trailDistance = 100; // Maximum trail distance in pixels
  }

  /**
   * Update ball position and handle basic physics
   */
  update(paddle, canvasWidth, canvasHeight) {
    if (this.onPaddle) {
      // Ball follows paddle when on paddle
      this.x = paddle.getCenterX();
      this.y = paddle.y - this.radius + 1; // Small overlap for collision detection
      // Clear trail when on paddle
      this.trail = [];
      return 'on_paddle';
    } else {
      // Update trail before moving
      this.updateTrail();
      
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;

      // Wall collisions
      if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth) {
        this.speedX = -this.speedX;
        this.x = MathUtils.clamp(this.x, this.radius, canvasWidth - this.radius);
      }

      if (this.y - this.radius <= 0) {
        this.speedY = -this.speedY;
        this.y = this.radius;
      }

      // Ball fell off bottom
      if (this.y > canvasHeight + 50) {
        return 'lost';
      }

      return 'active';
    }
  }

  /**
   * Update trail system
   */
  updateTrail() {
    // Add current position to trail
    this.trail.push({ x: this.x, y: this.y });
    
    // Remove old trail points that are too far or too many
    this.trail = this.trail.filter((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
      );
      return distance <= this.trailDistance && index >= this.trail.length - this.maxTrailLength;
    });
  }

  /**
   * Launch ball from paddle
   */
  launch() {
    this.onPaddle = false;
    this.speedX = this.originalSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = -this.originalSpeed;
  }

  /**
   * Handle collision with paddle
   */
  handlePaddleCollision(paddle) {
    const ballBounds = this.getBounds();
    const paddleBounds = paddle.getBounds();

    if (MathUtils.rectanglesCollide(ballBounds, paddleBounds)) {
      // Calculate bounce angle based on where ball hits paddle
      const hitPos = paddle.getHitPosition(this.x);
      const bounceAngle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
      
      const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
      this.speedX = speed * Math.sin(bounceAngle);
      this.speedY = -Math.abs(speed * Math.cos(bounceAngle));
      
      // Ensure ball is above paddle
      this.y = paddle.y - this.radius;
      
      return true;
    }
    
    return false;
  }

  /**
   * Render the ball with Tron-style trail effect
   */
  render(ctx) {
    // Render trail first (behind ball)
    this.renderTrail(ctx);
    
    // Tron-style light blue ball with glow
    const glowRadius = this.radius * 2;
    
    // Outer glow
    const outerGlow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, glowRadius
    );
    outerGlow.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
    outerGlow.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
    outerGlow.addColorStop(1, 'rgba(0, 212, 255, 0)');
    
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Main ball gradient (very light blue to white)
    const ballGradient = ctx.createRadialGradient(
      this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
      this.x, this.y, this.radius
    );
    ballGradient.addColorStop(0, '#FFFFFF');
    ballGradient.addColorStop(0.3, '#E6F9FF');
    ballGradient.addColorStop(0.7, '#66E5FF');
    ballGradient.addColorStop(1, '#00D4FF');
    
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright core
    const coreGradient = ctx.createRadialGradient(
      this.x - this.radius * 0.4, this.y - this.radius * 0.4, 0,
      this.x, this.y, this.radius * 0.6
    );
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render the light trail
   */
  renderTrail(ctx) {
    if (this.trail.length < 2) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen'; // Additive blending for glow effect
    
    // Draw trail segments
    for (let i = 1; i < this.trail.length; i++) {
      const current = this.trail[i];
      const previous = this.trail[i - 1];
      
      // Calculate opacity based on distance from current position
      const distance = Math.sqrt(
        Math.pow(current.x - this.x, 2) + Math.pow(current.y - this.y, 2)
      );
      const opacity = Math.max(0, 1 - (distance / this.trailDistance));
      const segmentOpacity = opacity * (i / this.trail.length); // Fade towards tail
      
      // Trail segment gradient
      const trailGradient = ctx.createLinearGradient(
        previous.x, previous.y, current.x, current.y
      );
      trailGradient.addColorStop(0, `rgba(0, 212, 255, ${segmentOpacity * 0.8})`);
      trailGradient.addColorStop(1, `rgba(102, 229, 255, ${segmentOpacity * 0.4})`);
      
      // Draw trail segment
      ctx.strokeStyle = trailGradient;
      ctx.lineWidth = this.radius * 0.8 * segmentOpacity;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
      
      // Add glow to trail segment
      ctx.strokeStyle = `rgba(0, 212, 255, ${segmentOpacity * 0.3})`;
      ctx.lineWidth = this.radius * 1.5 * segmentOpacity;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * Get ball bounds for collision detection
   */
  getBounds() {
    return {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius
    };
  }

  /**
   * Reset ball to paddle
   */
  reset(paddle) {
    this.onPaddle = true;
    this.x = paddle.getCenterX();
    this.y = paddle.y - this.radius + 1; // Small overlap for collision detection
    this.speedX = this.originalSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = -this.originalSpeed;
  }

  /**
   * Set ball speed (for power-ups)
   */
  setSpeed(speedMultiplier) {
    this.speedX *= speedMultiplier;
    this.speedY *= speedMultiplier;
  }

  /**
   * Get current speed
   */
  getCurrentSpeed() {
    return Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
  }

  /**
   * Normalize speed to original value
   */
  normalizeSpeed() {
    const currentSpeed = this.getCurrentSpeed();
    if (currentSpeed > 0) {
      const speedMultiplier = this.originalSpeed / currentSpeed;
      this.speedX *= speedMultiplier;
      this.speedY *= speedMultiplier;
    }
  }

  /**
   * Reverse ball direction (for brick collisions)
   */
  reverseX() {
    this.speedX = -this.speedX;
  }

  reverseY() {
    this.speedY = -this.speedY;
  }
}

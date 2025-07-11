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
  }

  /**
   * Update ball position and handle basic physics
   */
  update(paddle, canvasWidth, canvasHeight) {
    if (this.onPaddle) {
      // Ball follows paddle when on paddle
      this.x = paddle.getCenterX();
      this.y = paddle.y - this.radius + 1; // Small overlap for collision detection
      return 'on_paddle';
    } else {
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
   * Render the ball
   */
  render(ctx) {
    // Ball gradient
    const gradient = ctx.createRadialGradient(
      this.x - 2, this.y - 2, 0,
      this.x, this.y, this.radius
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#ffff88');
    gradient.addColorStop(1, '#ffaa00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x - 2, this.y - 2, this.radius / 3, 0, Math.PI * 2);
    ctx.fill();
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

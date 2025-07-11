// PowerUp System - Manages power-up effects and timing
import { GameConfig } from '../config/GameConfig.js';
import { PowerUp } from '../entities/PowerUp.js';

export class PowerUpSystem {
  constructor() {
    this.fallingPowerUps = [];
    this.activePowerUps = [];
  }

  /**
   * Update all power-ups (falling and active)
   */
  update(canvasHeight) {
    this.updateFallingPowerUps(canvasHeight);
    this.updateActivePowerUps();
  }

  /**
   * Update falling power-ups
   */
  updateFallingPowerUps(canvasHeight) {
    for (let i = this.fallingPowerUps.length - 1; i >= 0; i--) {
      const powerUp = this.fallingPowerUps[i];
      powerUp.update(canvasHeight);

      // Remove if collected or off screen
      if (powerUp.shouldRemove()) {
        this.fallingPowerUps.splice(i, 1);
      }
    }
  }

  /**
   * Update active power-ups (check for expiration)
   */
  updateActivePowerUps() {
    const currentTime = Date.now();
    
    for (let i = this.activePowerUps.length - 1; i >= 0; i--) {
      const activePowerUp = this.activePowerUps[i];
      
      if (currentTime >= activePowerUp.endTime) {
        // Deactivate power-up
        this.deactivatePowerUp(activePowerUp);
        this.activePowerUps.splice(i, 1);
      }
    }
  }

  /**
   * Check for power-up collisions with paddle
   */
  checkCollisions(paddle) {
    const collectedPowerUps = [];
    
    for (let i = this.fallingPowerUps.length - 1; i >= 0; i--) {
      const powerUp = this.fallingPowerUps[i];
      
      if (powerUp.checkCollision(paddle)) {
        powerUp.collect();
        collectedPowerUps.push(powerUp);
        this.fallingPowerUps.splice(i, 1);
      }
    }
    
    return collectedPowerUps;
  }

  /**
   * Drop a power-up at specified location
   */
  dropPowerUp(x, y, type = null) {
    const powerUp = type ? new PowerUp(x, y, type) : PowerUp.createRandom(x, y);
    this.fallingPowerUps.push(powerUp);
  }

  /**
   * Try to drop a power-up (based on drop rate)
   */
  tryDropPowerUp(x, y, type = null) {
    if (PowerUp.shouldDrop()) {
      this.dropPowerUp(x, y, type);
      return true;
    }
    return false;
  }

  /**
   * Activate a power-up effect
   */
  activatePowerUp(type, gameObjects) {
    const duration = GameConfig.powerUps.duration;
    const activePowerUp = {
      type: type,
      startTime: Date.now(),
      endTime: Date.now() + duration,
      gameObjects: gameObjects
    };

    // Apply the effect
    this.applyPowerUpEffect(type, gameObjects);
    
    // Add to active list
    this.activePowerUps.push(activePowerUp);
    
    return activePowerUp;
  }

  /**
   * Apply power-up effect
   */
  applyPowerUpEffect(type, gameObjects) {
    const { paddle, ball, balls } = gameObjects;
    
    switch(type) {
      case 'wide_paddle':
        paddle.setWidth(paddle.originalWidth * 1.5);
        break;
        
      case 'multi_ball':
        // Create 2 additional balls
        if (balls && balls.length < 5) { // Limit total balls
          for (let i = 0; i < 2; i++) {
            const newBall = new (ball.constructor)(ball.x, ball.y);
            newBall.onPaddle = false;
            newBall.speedX = ball.originalSpeed * (Math.random() > 0.5 ? 1 : -1);
            newBall.speedY = -ball.originalSpeed;
            balls.push(newBall);
          }
        }
        break;
        
      case 'slow_ball':
        // Apply to all balls
        if (balls) {
          balls.forEach(b => b.setSpeed(0.7));
        } else {
          ball.setSpeed(0.7);
        }
        break;
    }
  }

  /**
   * Deactivate power-up effect
   */
  deactivatePowerUp(activePowerUp) {
    const { type, gameObjects } = activePowerUp;
    const { paddle, ball, balls } = gameObjects;
    
    switch(type) {
      case 'wide_paddle':
        paddle.resetWidth();
        break;
        
      case 'slow_ball':
        // Restore original speed to all balls
        if (balls) {
          balls.forEach(b => b.normalizeSpeed());
        } else {
          ball.normalizeSpeed();
        }
        break;
        
      // multi_ball doesn't need deactivation (balls persist until lost)
    }
  }

  /**
   * Render falling power-ups
   */
  renderFallingPowerUps(ctx) {
    this.fallingPowerUps.forEach(powerUp => powerUp.render(ctx));
  }

  /**
   * Render active power-up indicators
   */
  renderActivePowerUps(ctx, canvasWidth) {
    let yOffset = 10;
    const currentTime = Date.now();
    
    this.activePowerUps.forEach(activePowerUp => {
      const timeLeft = Math.max(0, activePowerUp.endTime - currentTime) / 1000;
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvasWidth - 120, yOffset, 110, 25);
      
      // Text
      ctx.fillStyle = '#00ff88';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(
        activePowerUp.type.replace('_', ' ').toUpperCase(), 
        canvasWidth - 115, 
        yOffset + 12
      );
      ctx.fillText(`${timeLeft.toFixed(1)}s`, canvasWidth - 115, yOffset + 22);
      
      yOffset += 30;
    });
  }

  /**
   * Get active power-ups list
   */
  getActivePowerUps() {
    return this.activePowerUps.slice(); // Return copy
  }

  /**
   * Check if specific power-up is active
   */
  isPowerUpActive(type) {
    return this.activePowerUps.some(powerUp => powerUp.type === type);
  }

  /**
   * Get time remaining for power-up
   */
  getPowerUpTimeRemaining(type) {
    const powerUp = this.activePowerUps.find(p => p.type === type);
    if (powerUp) {
      return Math.max(0, powerUp.endTime - Date.now()) / 1000;
    }
    return 0;
  }

  /**
   * Clear all power-ups (for game reset)
   */
  clear() {
    this.fallingPowerUps = [];
    this.activePowerUps = [];
  }

  /**
   * Get falling power-ups count
   */
  getFallingPowerUpsCount() {
    return this.fallingPowerUps.length;
  }

  /**
   * Get active power-ups count
   */
  getActivePowerUpsCount() {
    return this.activePowerUps.length;
  }

  /**
   * Force activate power-up (for testing)
   */
  forceActivatePowerUp(type, gameObjects) {
    return this.activatePowerUp(type, gameObjects);
  }

  /**
   * Force deactivate all power-ups of type
   */
  forceDeactivatePowerUp(type) {
    for (let i = this.activePowerUps.length - 1; i >= 0; i--) {
      const activePowerUp = this.activePowerUps[i];
      if (activePowerUp.type === type) {
        this.deactivatePowerUp(activePowerUp);
        this.activePowerUps.splice(i, 1);
      }
    }
  }
}

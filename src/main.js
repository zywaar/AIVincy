// Main Game Entry Point
import { GameConfig } from './config/GameConfig.js';
import { InputManager } from './core/InputManager.js';
import { PowerUpSystem } from './systems/PowerUpSystem.js';
import { Paddle } from './entities/Paddle.js';
import { Ball } from './entities/Ball.js';
import { Brick } from './entities/Brick.js';

// Simple Game Class for demonstration
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.inputManager = new InputManager(this.canvas);
    this.powerUpSystem = new PowerUpSystem();
    
    // Initialize game objects
    this.paddle = new Paddle(
      GameConfig.canvas.width / 2 - GameConfig.paddle.width / 2,
      GameConfig.canvas.height - GameConfig.paddle.yOffset
    );
    
    this.balls = [new Ball(
      this.paddle.getCenterX(),
      this.paddle.y - GameConfig.ball.radius
    )];
    
    this.bricks = Brick.createBrickLayout();
    this.score = 0;
    this.lives = GameConfig.game.initialLives;
    this.state = GameConfig.states.PLAYING;
    
    console.log('🎮 Game initialized with modular structure!');
    console.log(`📊 Created ${this.bricks.length} bricks`);
    console.log('🚀 All modules loaded successfully!');
  }

  update() {
    if (this.state !== GameConfig.states.PLAYING) return;

    // Update paddle
    this.paddle.update(this.inputManager, GameConfig.canvas.width);
    
    // Update all balls
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      const ballStatus = ball.update(this.paddle, GameConfig.canvas.width, GameConfig.canvas.height);
      
      // Handle ball launch (only for balls on paddle)
      if (ball.onPaddle && this.inputManager.isBallLaunchPressed()) {
        ball.launch();
      }
      
      // Handle paddle collision
      if (!ball.onPaddle) {
        ball.handlePaddleCollision(this.paddle);
      }
      
      // Check brick collisions for this ball
      this.checkBrickCollisions(ball);
      
      // Remove ball if lost
      if (ballStatus === 'lost') {
        this.balls.splice(i, 1);
      }
    }
    
    // Update power-up system
    this.powerUpSystem.update(GameConfig.canvas.height);
    
    // Check power-up collisions
    const collectedPowerUps = this.powerUpSystem.checkCollisions(this.paddle);
    collectedPowerUps.forEach(powerUp => {
      this.powerUpSystem.activatePowerUp(powerUp.type, {
        paddle: this.paddle,
        balls: this.balls // Pass balls array for multi-ball support
      });
    });
    
    // Check if all balls lost
    if (this.balls.length === 0) {
      this.lives--;
      if (this.lives <= 0) {
        this.state = GameConfig.states.GAME_OVER;
      } else {
        // Reset to single ball
        this.balls = [new Ball(
          this.paddle.getCenterX(),
          this.paddle.y - GameConfig.ball.radius
        )];
      }
    }
    
    // Check win condition
    if (this.bricks.every(brick => brick.isDestroyed())) {
      this.state = GameConfig.states.WIN;
    }
  }

  checkBrickCollisions(ball) {
    for (const brick of this.bricks) {
      const collisionSide = brick.checkCollisionWithBall(ball);
      if (collisionSide) {
        const points = brick.hit();
        this.score += points;
        
        // Improved bounce with position correction
        if (collisionSide === 'horizontal') {
          ball.reverseX();
          // Position correction to prevent sticking
          if (ball.x < brick.getCenterX()) {
            ball.x = brick.getBounds().left - ball.radius;
          } else {
            ball.x = brick.getBounds().right + ball.radius;
          }
        } else {
          ball.reverseY();
          // Position correction
          if (ball.y < brick.getCenterY()) {
            ball.y = brick.getBounds().top - ball.radius;
          } else {
            ball.y = brick.getBounds().bottom + ball.radius;
          }
        }
        
        // Drop power-up if brick is destroyed
        if (brick.isDestroyed()) {
          this.powerUpSystem.tryDropPowerUp(brick.getCenterX(), brick.getCenterY());
        }
        
        break; // Only hit one brick per ball per frame
      }
    }
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, GameConfig.canvas.width, GameConfig.canvas.height);

    if (this.state === GameConfig.states.PLAYING) {
      // Render bricks
      this.bricks.forEach(brick => brick.render(this.ctx));
      
      // Render power-ups
      this.powerUpSystem.renderFallingPowerUps(this.ctx);
      
      // Render game objects
      this.paddle.render(this.ctx);
      this.balls.forEach(ball => ball.render(this.ctx));
      
      // Render power-up indicators
      this.powerUpSystem.renderActivePowerUps(this.ctx, GameConfig.canvas.width);
      
      // Render UI
      this.renderUI();
      
      // Instructions when any ball is on paddle
      if (this.balls.some(ball => ball.onPaddle)) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press SPACE or click to launch ball', GameConfig.canvas.width / 2, GameConfig.canvas.height / 2);
      }
    } else {
      this.renderGameEnd();
    }
  }

  renderUI() {
    this.ctx.fillStyle = '#00ff88';
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 55);
  }

  renderGameEnd() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, GameConfig.canvas.width, GameConfig.canvas.height);
    
    const isWin = this.state === GameConfig.states.WIN;
    this.ctx.fillStyle = isWin ? '#00ff88' : '#ff4444';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      isWin ? 'YOU WIN!' : 'GAME OVER', 
      GameConfig.canvas.width / 2, 
      GameConfig.canvas.height / 2 - 50
    );
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Final Score: ${this.score}`, GameConfig.canvas.width / 2, GameConfig.canvas.height / 2 + 20);
    
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Press R to restart', GameConfig.canvas.width / 2, GameConfig.canvas.height / 2 + 60);
  }

  restart() {
    this.score = 0;
    this.lives = GameConfig.game.initialLives;
    this.state = GameConfig.states.PLAYING;
    this.bricks = Brick.createBrickLayout();
    
    // Reset to single ball
    this.balls = [new Ball(
      this.paddle.getCenterX(),
      this.paddle.y - GameConfig.ball.radius
    )];
    
    this.powerUpSystem.clear();
  }

  handleInput() {
    if (this.inputManager.isRestartPressed() && 
        (this.state === GameConfig.states.GAME_OVER || this.state === GameConfig.states.WIN)) {
      this.restart();
    }
  }
}

// Game loop
let game;
let lastTime = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  if (game) {
    game.handleInput();
    game.update();
    game.render();
  }
  
  requestAnimationFrame(gameLoop);
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  game = new Game();
  window.game = game; // Make game accessible globally for testing
  requestAnimationFrame(gameLoop);
});

console.log('✅ Main game module loaded');

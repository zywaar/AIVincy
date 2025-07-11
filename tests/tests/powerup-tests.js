// Power-up System Tests
import { SimpleTest } from '../test-framework.js';
import { PowerUpSystem } from '../../src/systems/PowerUpSystem.js';
import { PowerUp } from '../../src/entities/PowerUp.js';
import { Paddle } from '../../src/entities/Paddle.js';
import { Ball } from '../../src/entities/Ball.js';
import { GameConfig } from '../../src/config/GameConfig.js';

// Test Power-up Entity
SimpleTest.test('PowerUp creation and basic properties', () => {
  const powerUp = new PowerUp(100, 200, 'wide_paddle');
  
  SimpleTest.assertEqual(powerUp.x, 100);
  SimpleTest.assertEqual(powerUp.y, 200);
  SimpleTest.assertEqual(powerUp.type, 'wide_paddle');
  SimpleTest.assertEqual(powerUp.width, GameConfig.powerUps.width);
  SimpleTest.assertEqual(powerUp.height, GameConfig.powerUps.height);
  SimpleTest.assertFalsy(powerUp.collected);
});

SimpleTest.test('PowerUp falls correctly', () => {
  const powerUp = new PowerUp(100, 200, 'wide_paddle');
  const initialY = powerUp.y;
  
  powerUp.update(600); // Canvas height
  
  SimpleTest.assertEqual(powerUp.y, initialY + GameConfig.powerUps.speed);
  SimpleTest.assertFalsy(powerUp.collected);
});

SimpleTest.test('PowerUp gets collected when falls off screen', () => {
  const powerUp = new PowerUp(100, 590, 'wide_paddle');
  
  powerUp.update(600); // Canvas height
  
  SimpleTest.assertTruthy(powerUp.collected);
  SimpleTest.assertTruthy(powerUp.shouldRemove());
});

SimpleTest.test('PowerUp collision detection with paddle', () => {
  const powerUp = new PowerUp(100, 580, 'wide_paddle');
  const paddle = new Paddle(90, 585);
  
  const collision = powerUp.checkCollision(paddle);
  SimpleTest.assertTruthy(collision);
});

SimpleTest.test('PowerUp no collision when not overlapping', () => {
  const powerUp = new PowerUp(100, 100, 'wide_paddle');
  const paddle = new Paddle(200, 585);
  
  const collision = powerUp.checkCollision(paddle);
  SimpleTest.assertFalsy(collision);
});

// Test PowerUpSystem
SimpleTest.test('PowerUpSystem initialization', () => {
  const system = new PowerUpSystem();
  
  SimpleTest.assertEqual(system.getFallingPowerUpsCount(), 0);
  SimpleTest.assertEqual(system.getActivePowerUpsCount(), 0);
});

SimpleTest.test('PowerUpSystem drops power-up correctly', () => {
  const system = new PowerUpSystem();
  
  system.dropPowerUp(100, 200, 'wide_paddle');
  
  SimpleTest.assertEqual(system.getFallingPowerUpsCount(), 1);
});

SimpleTest.test('PowerUpSystem collision detection', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(90, 585);
  
  system.dropPowerUp(100, 580, 'wide_paddle');
  
  const collectedPowerUps = system.checkCollisions(paddle);
  
  SimpleTest.assertEqual(collectedPowerUps.length, 1);
  SimpleTest.assertEqual(collectedPowerUps[0].type, 'wide_paddle');
  SimpleTest.assertEqual(system.getFallingPowerUpsCount(), 0);
});

// Test Wide Paddle Power-up
SimpleTest.test('Wide Paddle power-up increases paddle width', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  const originalWidth = paddle.width;
  
  system.activatePowerUp('wide_paddle', { paddle, ball });
  
  SimpleTest.assertEqual(paddle.width, originalWidth * 1.5);
  SimpleTest.assertEqual(system.getActivePowerUpsCount(), 1);
  SimpleTest.assertTruthy(system.isPowerUpActive('wide_paddle'));
});

SimpleTest.test('Wide Paddle power-up deactivates correctly', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  const originalWidth = paddle.width;
  
  // Activate power-up
  const activePowerUp = system.activatePowerUp('wide_paddle', { paddle, ball });
  
  // Manually deactivate (simulate time expiration)
  system.deactivatePowerUp(activePowerUp);
  
  SimpleTest.assertEqual(paddle.width, originalWidth);
});

// Test Slow Ball Power-up
SimpleTest.test('Slow Ball power-up reduces ball speed', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  const originalSpeedX = ball.speedX;
  const originalSpeedY = ball.speedY;
  
  system.activatePowerUp('slow_ball', { paddle, ball });
  
  SimpleTest.assertApproxEqual(ball.speedX, originalSpeedX * 0.7, 0.1);
  SimpleTest.assertApproxEqual(ball.speedY, originalSpeedY * 0.7, 0.1);
});

SimpleTest.test('Slow Ball power-up restores speed on deactivation', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  const originalSpeed = ball.getCurrentSpeed();
  
  // Activate power-up
  const activePowerUp = system.activatePowerUp('slow_ball', { paddle, ball });
  
  // Verify speed is reduced
  const slowSpeed = ball.getCurrentSpeed();
  SimpleTest.assertApproxEqual(slowSpeed, originalSpeed * 0.7, 0.1);
  
  // Deactivate power-up
  system.deactivatePowerUp(activePowerUp);
  
  // Verify speed is restored
  const restoredSpeed = ball.getCurrentSpeed();
  SimpleTest.assertApproxEqual(restoredSpeed, originalSpeed, 0.1);
});

// Test Multi-ball Power-up
SimpleTest.test('Multi-ball power-up creates additional balls', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  const balls = [ball];
  
  system.activatePowerUp('multi_ball', { paddle, ball, balls });
  
  SimpleTest.assertEqual(balls.length, 3); // Original + 2 new balls
  
  // Check that new balls are not on paddle
  balls.slice(1).forEach(newBall => {
    SimpleTest.assertFalsy(newBall.onPaddle);
  });
});

SimpleTest.test('Multi-ball power-up respects ball limit', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  const balls = [ball, ball, ball, ball, ball]; // Already at limit (5)
  
  system.activatePowerUp('multi_ball', { paddle, ball, balls });
  
  SimpleTest.assertEqual(balls.length, 5); // Should not exceed limit
});

// Test Power-up Timing
SimpleTest.test('Power-up time remaining calculation', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  system.activatePowerUp('wide_paddle', { paddle, ball });
  
  const timeRemaining = system.getPowerUpTimeRemaining('wide_paddle');
  
  // Should be close to the full duration (15 seconds)
  SimpleTest.assert(timeRemaining > 14 && timeRemaining <= 15);
});

// Test Power-up Drop Rate
SimpleTest.test('PowerUp drop rate probability', () => {
  let dropCount = 0;
  const iterations = 1000;
  
  for (let i = 0; i < iterations; i++) {
    if (PowerUp.shouldDrop()) {
      dropCount++;
    }
  }
  
  const dropRate = dropCount / iterations;
  const expectedRate = GameConfig.powerUps.dropRate;
  
  // Should be approximately 20% (within 5% tolerance)
  SimpleTest.assert(
    Math.abs(dropRate - expectedRate) < 0.05,
    `Drop rate ${dropRate} not close to expected ${expectedRate}`
  );
});

// Test Power-up System Clear
SimpleTest.test('PowerUpSystem clear removes all power-ups', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  // Add some power-ups
  system.dropPowerUp(100, 200, 'wide_paddle');
  system.activatePowerUp('slow_ball', { paddle, ball });
  
  SimpleTest.assertEqual(system.getFallingPowerUpsCount(), 1);
  SimpleTest.assertEqual(system.getActivePowerUpsCount(), 1);
  
  system.clear();
  
  SimpleTest.assertEqual(system.getFallingPowerUpsCount(), 0);
  SimpleTest.assertEqual(system.getActivePowerUpsCount(), 0);
});

// Test Force Activation/Deactivation (for testing purposes)
SimpleTest.test('Force activate and deactivate power-ups', () => {
  const system = new PowerUpSystem();
  const paddle = new Paddle(100, 585);
  const ball = new Ball(150, 570);
  
  // Force activate
  system.forceActivatePowerUp('wide_paddle', { paddle, ball });
  SimpleTest.assertTruthy(system.isPowerUpActive('wide_paddle'));
  
  // Force deactivate
  system.forceDeactivatePowerUp('wide_paddle');
  SimpleTest.assertFalsy(system.isPowerUpActive('wide_paddle'));
});

console.log('✅ Power-up tests loaded');

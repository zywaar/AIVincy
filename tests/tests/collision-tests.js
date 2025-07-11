// Collision Detection Tests - Ball-Brick and Other Collision Logic
import { SimpleTest } from '../test-framework.js';
import { Brick } from '../../src/entities/Brick.js';
import { Ball } from '../../src/entities/Ball.js';
import { Paddle } from '../../src/entities/Paddle.js';
import { GameConfig } from '../../src/config/GameConfig.js';
import { MathUtils } from '../../src/utils/MathUtils.js';

// Test Ball-Brick Collision Detection
SimpleTest.test('Ball-brick collision detection - direct hit', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const ball = new Ball(brick.getCenterX(), brick.getCenterY());
  
  const collisionSide = brick.checkCollisionWithBall(ball);
  SimpleTest.assertTruthy(collisionSide, 'Ball should collide with brick when overlapping');
});

SimpleTest.test('Ball-brick collision detection - no collision', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const ball = new Ball(200, 200); // Far away from brick
  
  const collisionSide = brick.checkCollisionWithBall(ball);
  SimpleTest.assertFalsy(collisionSide, 'Ball should not collide when far from brick');
});

SimpleTest.test('Ball-brick collision detection - destroyed brick', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const ball = new Ball(brick.getCenterX(), brick.getCenterY());
  
  // Destroy the brick first
  brick.hit();
  SimpleTest.assertTruthy(brick.destroyed);
  
  const collisionSide = brick.checkCollisionWithBall(ball);
  SimpleTest.assertFalsy(collisionSide, 'Destroyed brick should not register collisions');
});

// Test Collision Side Detection
SimpleTest.test('Ball-brick collision - horizontal side detection', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  
  // Ball approaching from left side
  const ballFromLeft = new Ball(brick.x - 5, brick.getCenterY());
  const leftCollision = brick.checkCollisionWithBall(ballFromLeft);
  SimpleTest.assertEqual(leftCollision, 'horizontal', 'Left side collision should be horizontal');
  
  // Ball approaching from right side
  const ballFromRight = new Ball(brick.x + brick.width + 5, brick.getCenterY());
  const rightCollision = brick.checkCollisionWithBall(ballFromRight);
  SimpleTest.assertEqual(rightCollision, 'horizontal', 'Right side collision should be horizontal');
});

SimpleTest.test('Ball-brick collision - vertical side detection', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  
  // Ball approaching from top
  const ballFromTop = new Ball(brick.getCenterX(), brick.y - 5);
  const topCollision = brick.checkCollisionWithBall(ballFromTop);
  SimpleTest.assertEqual(topCollision, 'vertical', 'Top collision should be vertical');
  
  // Ball approaching from bottom
  const ballFromBottom = new Ball(brick.getCenterX(), brick.y + brick.height + 5);
  const bottomCollision = brick.checkCollisionWithBall(ballFromBottom);
  SimpleTest.assertEqual(bottomCollision, 'vertical', 'Bottom collision should be vertical');
});

// Test Edge Cases for Collision Detection
SimpleTest.test('Ball-brick collision - corner cases', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  
  // Ball at top-left corner
  const ballTopLeft = new Ball(brick.x, brick.y);
  const topLeftCollision = brick.checkCollisionWithBall(ballTopLeft);
  SimpleTest.assertTruthy(topLeftCollision, 'Corner collision should be detected');
  
  // Ball at bottom-right corner
  const ballBottomRight = new Ball(brick.x + brick.width, brick.y + brick.height);
  const bottomRightCollision = brick.checkCollisionWithBall(ballBottomRight);
  SimpleTest.assertTruthy(bottomRightCollision, 'Corner collision should be detected');
});

SimpleTest.test('Ball-brick collision - grazing hits', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const ballRadius = GameConfig.ball.radius;
  
  // Ball just touching the edge
  const ballTouchingLeft = new Ball(brick.x - ballRadius + 1, brick.getCenterY());
  const touchingCollision = brick.checkCollisionWithBall(ballTouchingLeft);
  SimpleTest.assertTruthy(touchingCollision, 'Grazing collision should be detected');
  
  // Ball just missing the edge
  const ballMissingLeft = new Ball(brick.x - ballRadius - 1, brick.getCenterY());
  const missingCollision = brick.checkCollisionWithBall(ballMissingLeft);
  SimpleTest.assertFalsy(missingCollision, 'Near miss should not be detected as collision');
});

// Test Ball Bounds Calculation
SimpleTest.test('Ball bounds calculation accuracy', () => {
  const ball = new Ball(150, 200);
  const bounds = ball.getBounds();
  const radius = GameConfig.ball.radius;
  
  SimpleTest.assertEqual(bounds.left, 150 - radius);
  SimpleTest.assertEqual(bounds.right, 150 + radius);
  SimpleTest.assertEqual(bounds.top, 200 - radius);
  SimpleTest.assertEqual(bounds.bottom, 200 + radius);
});

// Test MathUtils Rectangle Overlap
SimpleTest.test('MathUtils rectangles overlap detection', () => {
  const rect1 = { left: 100, right: 200, top: 100, bottom: 200 };
  const rect2 = { left: 150, right: 250, top: 150, bottom: 250 };
  const rect3 = { left: 300, right: 400, top: 300, bottom: 400 };
  
  SimpleTest.assertTruthy(MathUtils.rectanglesOverlap(rect1, rect2), 'Overlapping rectangles should be detected');
  SimpleTest.assertFalsy(MathUtils.rectanglesOverlap(rect1, rect3), 'Non-overlapping rectangles should not be detected');
});

SimpleTest.test('MathUtils rectangles overlap - edge cases', () => {
  const rect1 = { left: 100, right: 200, top: 100, bottom: 200 };
  
  // Touching edges
  const rectTouchingRight = { left: 200, right: 300, top: 100, bottom: 200 };
  const rectTouchingBottom = { left: 100, right: 200, top: 200, bottom: 300 };
  
  // These should not overlap (touching edges don't count as overlap)
  SimpleTest.assertFalsy(MathUtils.rectanglesOverlap(rect1, rectTouchingRight), 'Touching edges should not count as overlap');
  SimpleTest.assertFalsy(MathUtils.rectanglesOverlap(rect1, rectTouchingBottom), 'Touching edges should not count as overlap');
});

// Test Ball-Paddle Collision
SimpleTest.test('Ball-paddle collision detection', () => {
  const paddle = new Paddle(100, 500);
  const ball = new Ball(paddle.getCenterX(), paddle.y - GameConfig.ball.radius + 1);
  
  // Test collision detection method exists and works
  SimpleTest.assertTruthy(typeof ball.handlePaddleCollision === 'function', 'Ball should have paddle collision method');
  
  // Test ball is positioned to hit paddle
  const ballBounds = ball.getBounds();
  const paddleBounds = paddle.getBounds();
  SimpleTest.assertTruthy(MathUtils.rectanglesOverlap(ballBounds, paddleBounds), 'Ball should overlap with paddle');
});

// Test Multiple Collision Scenarios
SimpleTest.test('Multiple brick collision scenario', () => {
  // Create a layout of bricks
  const brick1 = new Brick(100, 100, '#ff4444', 1, 10);
  const brick2 = new Brick(180, 100, '#ff4444', 1, 10); // Adjacent brick
  const brick3 = new Brick(100, 125, '#ff4444', 1, 10); // Brick below
  
  const bricks = [brick1, brick2, brick3];
  
  // Ball positioned to potentially hit multiple bricks
  const ball = new Ball(175, 115); // Between brick1 and brick2, near brick3
  
  let collisionCount = 0;
  bricks.forEach(brick => {
    if (brick.checkCollisionWithBall(ball)) {
      collisionCount++;
    }
  });
  
  // Should detect collision with at least one brick
  SimpleTest.assertTruthy(collisionCount > 0, 'Ball should collide with at least one brick');
});

// Test Collision Performance
SimpleTest.test('Collision detection performance with many bricks', () => {
  const startTime = performance.now();
  
  // Create a full brick layout
  const bricks = Brick.createBrickLayout();
  const ball = new Ball(400, 300); // Center of canvas
  
  // Test collision with all bricks
  let collisionCount = 0;
  bricks.forEach(brick => {
    if (brick.checkCollisionWithBall(ball)) {
      collisionCount++;
    }
  });
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Should complete quickly (under 10ms for 60 bricks)
  SimpleTest.assertTruthy(duration < 10, `Collision detection took too long: ${duration}ms`);
  
  console.log(`Collision detection with ${bricks.length} bricks took ${duration.toFixed(2)}ms`);
});

// Test Collision Consistency
SimpleTest.test('Collision detection is consistent', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const ball = new Ball(brick.getCenterX(), brick.getCenterY());
  
  // Multiple calls should return the same result
  const result1 = brick.checkCollisionWithBall(ball);
  const result2 = brick.checkCollisionWithBall(ball);
  const result3 = brick.checkCollisionWithBall(ball);
  
  SimpleTest.assertEqual(result1, result2, 'Collision detection should be consistent');
  SimpleTest.assertEqual(result2, result3, 'Collision detection should be consistent');
});

// Test Ball Movement and Collision
SimpleTest.test('Ball collision during movement', () => {
  const brick = new Brick(200, 200, '#ff4444', 1, 10);
  const ball = new Ball(100, 200);
  
  // Set ball velocity towards brick
  ball.speedX = 5;
  ball.speedY = 0;
  
  // Move ball step by step until collision
  let steps = 0;
  let collision = null;
  
  while (steps < 50 && !collision) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    collision = brick.checkCollisionWithBall(ball);
    steps++;
  }
  
  SimpleTest.assertTruthy(collision, 'Ball should eventually collide with brick');
  SimpleTest.assertTruthy(steps < 50, 'Collision should happen within reasonable steps');
});

// Test Collision with Different Ball Sizes
SimpleTest.test('Collision detection with different ball sizes', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const originalRadius = GameConfig.ball.radius;
  
  try {
    // Test with smaller ball
    GameConfig.ball.radius = 5;
    const smallBall = new Ball(brick.getCenterX(), brick.getCenterY());
    const smallBallCollision = brick.checkCollisionWithBall(smallBall);
    SimpleTest.assertTruthy(smallBallCollision, 'Small ball should collide when centered on brick');
    
    // Test with larger ball
    GameConfig.ball.radius = 25;
    const largeBall = new Ball(brick.x - 20, brick.getCenterY());
    const largeBallCollision = brick.checkCollisionWithBall(largeBall);
    SimpleTest.assertTruthy(largeBallCollision, 'Large ball should have extended collision range');
    
  } finally {
    // Restore original radius
    GameConfig.ball.radius = originalRadius;
  }
});

// Test Collision Boundary Conditions
SimpleTest.test('Collision at exact boundaries', () => {
  const brick = new Brick(100, 100, '#ff4444', 1, 10);
  const ballRadius = GameConfig.ball.radius;
  
  // Ball exactly at left boundary
  const ballAtLeftBoundary = new Ball(brick.x - ballRadius, brick.getCenterY());
  const leftBoundaryCollision = brick.checkCollisionWithBall(ballAtLeftBoundary);
  SimpleTest.assertTruthy(leftBoundaryCollision, 'Ball at exact left boundary should collide');
  
  // Ball exactly at right boundary
  const ballAtRightBoundary = new Ball(brick.x + brick.width + ballRadius, brick.getCenterY());
  const rightBoundaryCollision = brick.checkCollisionWithBall(ballAtRightBoundary);
  SimpleTest.assertTruthy(rightBoundaryCollision, 'Ball at exact right boundary should collide');
});

// Test Collision State Changes
SimpleTest.test('Collision affects brick state correctly', () => {
  const brick = new Brick(100, 100, '#ff4444', 2, 20);
  const ball = new Ball(brick.getCenterX(), brick.getCenterY());
  
  // Initial state
  SimpleTest.assertEqual(brick.health, 2);
  SimpleTest.assertFalsy(brick.destroyed);
  
  // First collision
  const collision1 = brick.checkCollisionWithBall(ball);
  SimpleTest.assertTruthy(collision1, 'First collision should be detected');
  
  const points1 = brick.hit();
  SimpleTest.assertEqual(brick.health, 1);
  SimpleTest.assertFalsy(brick.destroyed);
  SimpleTest.assertEqual(points1, 0, 'No points until brick is destroyed');
  
  // Second collision
  const collision2 = brick.checkCollisionWithBall(ball);
  SimpleTest.assertTruthy(collision2, 'Second collision should be detected');
  
  const points2 = brick.hit();
  SimpleTest.assertEqual(brick.health, 0);
  SimpleTest.assertTruthy(brick.destroyed);
  SimpleTest.assertEqual(points2, 20, 'Points awarded when brick is destroyed');
  
  // Third collision (with destroyed brick)
  const collision3 = brick.checkCollisionWithBall(ball);
  SimpleTest.assertFalsy(collision3, 'Destroyed brick should not register collisions');
});

console.log('✅ Collision detection tests loaded');

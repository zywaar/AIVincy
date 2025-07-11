// Brick Entity Tests - Core Functionality
import { SimpleTest } from '../test-framework.js';
import { Brick } from '../../src/entities/Brick.js';
import { GameConfig } from '../../src/config/GameConfig.js';

// Test Brick Creation and Basic Properties
SimpleTest.test('Brick creation with all parameters', () => {
  const brick = new Brick(100, 200, '#ff4444', 2, 50);
  
  SimpleTest.assertEqual(brick.x, 100);
  SimpleTest.assertEqual(brick.y, 200);
  SimpleTest.assertEqual(brick.color, '#ff4444');
  SimpleTest.assertEqual(brick.health, 2);
  SimpleTest.assertEqual(brick.maxHealth, 2);
  SimpleTest.assertEqual(brick.points, 50);
  SimpleTest.assertEqual(brick.width, GameConfig.bricks.width);
  SimpleTest.assertEqual(brick.height, GameConfig.bricks.height);
  SimpleTest.assertFalsy(brick.destroyed);
});

SimpleTest.test('Brick dimensions match GameConfig', () => {
  const brick = new Brick(0, 0, '#ff4444', 1, 10);
  
  SimpleTest.assertEqual(brick.width, GameConfig.bricks.width);
  SimpleTest.assertEqual(brick.height, GameConfig.bricks.height);
});

// Test Brick Health System
SimpleTest.test('Single-hit brick destruction', () => {
  const brick = new Brick(100, 200, '#ff4444', 1, 10);
  
  SimpleTest.assertEqual(brick.health, 1);
  SimpleTest.assertFalsy(brick.destroyed);
  
  const points = brick.hit();
  
  SimpleTest.assertEqual(brick.health, 0);
  SimpleTest.assertTruthy(brick.destroyed);
  SimpleTest.assertEqual(points, 10);
});

SimpleTest.test('Multi-hit brick requires multiple hits', () => {
  const brick = new Brick(100, 200, '#ffff44', 3, 30);
  
  // First hit
  let points = brick.hit();
  SimpleTest.assertEqual(brick.health, 2);
  SimpleTest.assertFalsy(brick.destroyed);
  SimpleTest.assertEqual(points, 0); // No points until destroyed
  
  // Second hit
  points = brick.hit();
  SimpleTest.assertEqual(brick.health, 1);
  SimpleTest.assertFalsy(brick.destroyed);
  SimpleTest.assertEqual(points, 0);
  
  // Third hit - should destroy
  points = brick.hit();
  SimpleTest.assertEqual(brick.health, 0);
  SimpleTest.assertTruthy(brick.destroyed);
  SimpleTest.assertEqual(points, 30); // Points awarded on destruction
});

SimpleTest.test('Brick health percentage calculation', () => {
  const brick = new Brick(100, 200, '#44ff44', 4, 40);
  
  SimpleTest.assertEqual(brick.getHealthPercentage(), 1.0); // 4/4 = 100%
  
  brick.hit();
  SimpleTest.assertApproxEqual(brick.getHealthPercentage(), 0.75, 0.01); // 3/4 = 75%
  
  brick.hit();
  SimpleTest.assertApproxEqual(brick.getHealthPercentage(), 0.5, 0.01); // 2/4 = 50%
  
  brick.hit();
  SimpleTest.assertApproxEqual(brick.getHealthPercentage(), 0.25, 0.01); // 1/4 = 25%
  
  brick.hit();
  SimpleTest.assertEqual(brick.getHealthPercentage(), 0.0); // 0/4 = 0%
});

// Test Brick State Methods
SimpleTest.test('isDestroyed method accuracy', () => {
  const brick = new Brick(100, 200, '#ff4444', 2, 20);
  
  SimpleTest.assertFalsy(brick.isDestroyed());
  
  brick.hit();
  SimpleTest.assertFalsy(brick.isDestroyed());
  
  brick.hit();
  SimpleTest.assertTruthy(brick.isDestroyed());
});

// Test Brick Position Methods
SimpleTest.test('Brick center position calculation', () => {
  const brick = new Brick(100, 200, '#ff4444', 1, 10);
  
  const expectedCenterX = 100 + GameConfig.bricks.width / 2;
  const expectedCenterY = 200 + GameConfig.bricks.height / 2;
  
  SimpleTest.assertEqual(brick.getCenterX(), expectedCenterX);
  SimpleTest.assertEqual(brick.getCenterY(), expectedCenterY);
});

SimpleTest.test('Brick bounds calculation', () => {
  const brick = new Brick(100, 200, '#ff4444', 1, 10);
  const bounds = brick.getBounds();
  
  SimpleTest.assertEqual(bounds.left, 100);
  SimpleTest.assertEqual(bounds.right, 100 + GameConfig.bricks.width);
  SimpleTest.assertEqual(bounds.top, 200);
  SimpleTest.assertEqual(bounds.bottom, 200 + GameConfig.bricks.height);
});

// Test Brick Visual States
SimpleTest.test('Damaged brick color calculation', () => {
  const redBrick = new Brick(100, 200, '#ff4444', 2, 20);
  const orangeBrick = new Brick(100, 200, '#ff8844', 2, 20);
  const yellowBrick = new Brick(100, 200, '#ffff44', 2, 20);
  
  // Test damaged colors
  SimpleTest.assertEqual(redBrick.getDamagedColor(), '#cc2222');
  SimpleTest.assertEqual(orangeBrick.getDamagedColor(), '#cc5522');
  SimpleTest.assertEqual(yellowBrick.getDamagedColor(), '#cccc22');
});

SimpleTest.test('Unknown color returns original color', () => {
  const customBrick = new Brick(100, 200, '#123456', 2, 20);
  
  SimpleTest.assertEqual(customBrick.getDamagedColor(), '#123456');
});

// Test Brick Type Validation
SimpleTest.test('All GameConfig brick types are valid', () => {
  GameConfig.brickTypes.forEach((brickType, index) => {
    SimpleTest.assertTruthy(brickType.color, `Brick type ${index} missing color`);
    SimpleTest.assertTruthy(brickType.health > 0, `Brick type ${index} invalid health`);
    SimpleTest.assertTruthy(brickType.points > 0, `Brick type ${index} invalid points`);
    
    // Test brick creation with this type
    const brick = new Brick(0, 0, brickType.color, brickType.health, brickType.points);
    SimpleTest.assertEqual(brick.color, brickType.color);
    SimpleTest.assertEqual(brick.health, brickType.health);
    SimpleTest.assertEqual(brick.points, brickType.points);
  });
});

// Test Edge Cases
SimpleTest.test('Brick with zero health is immediately destroyed', () => {
  const brick = new Brick(100, 200, '#ff4444', 0, 10);
  
  SimpleTest.assertTruthy(brick.destroyed);
  SimpleTest.assertEqual(brick.getHealthPercentage(), 0);
});

SimpleTest.test('Hitting destroyed brick has no effect', () => {
  const brick = new Brick(100, 200, '#ff4444', 1, 10);
  
  // Destroy the brick
  brick.hit();
  SimpleTest.assertTruthy(brick.destroyed);
  
  // Hit again - should have no effect
  const points = brick.hit();
  SimpleTest.assertEqual(points, 0);
  SimpleTest.assertEqual(brick.health, 0); // Should remain 0
});

SimpleTest.test('Brick with negative coordinates', () => {
  const brick = new Brick(-50, -100, '#ff4444', 1, 10);
  
  SimpleTest.assertEqual(brick.x, -50);
  SimpleTest.assertEqual(brick.y, -100);
  
  const bounds = brick.getBounds();
  SimpleTest.assertEqual(bounds.left, -50);
  SimpleTest.assertEqual(bounds.top, -100);
});

// Test Brick Health Consistency Issue (The main problem identified)
SimpleTest.test('Brick health consistency validation', () => {
  // Test that bricks of the same color always have the same health
  const colorHealthMap = new Map();
  
  GameConfig.brickTypes.forEach(brickType => {
    if (colorHealthMap.has(brickType.color)) {
      const existingHealth = colorHealthMap.get(brickType.color);
      SimpleTest.assertEqual(
        brickType.health, 
        existingHealth, 
        `Inconsistent health for color ${brickType.color}: found ${brickType.health} and ${existingHealth}`
      );
    } else {
      colorHealthMap.set(brickType.color, brickType.health);
    }
  });
});

SimpleTest.test('Multi-hit bricks are clearly identified', () => {
  const multiHitBricks = GameConfig.brickTypes.filter(type => type.health > 1);
  const singleHitBricks = GameConfig.brickTypes.filter(type => type.health === 1);
  
  console.log(`Multi-hit bricks (${multiHitBricks.length}):`, multiHitBricks.map(b => `${b.color} (${b.health} hits)`));
  console.log(`Single-hit bricks (${singleHitBricks.length}):`, singleHitBricks.map(b => `${b.color} (${b.health} hit)`));
  
  // All bricks now have health = 2 as per requirements
  SimpleTest.assertTruthy(multiHitBricks.length > 0, 'Game should have multi-hit bricks for challenge');
  SimpleTest.assertEqual(multiHitBricks.length, GameConfig.brickTypes.length, 'All bricks should be multi-hit (health = 2)');
  SimpleTest.assertEqual(singleHitBricks.length, 0, 'No single-hit bricks as per requirements');
});

console.log('✅ Brick core functionality tests loaded');

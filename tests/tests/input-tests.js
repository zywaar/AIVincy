// Input Manager Tests - Keyboard and Mouse Input
import { SimpleTest } from '../test-framework.js';
import { InputManager } from '../../src/core/InputManager.js';

// Mock canvas for testing
const mockCanvas = {
  addEventListener: () => {},
  getBoundingClientRect: () => ({ left: 0, top: 0 })
};

// Test InputManager Creation
SimpleTest.test('InputManager creation', () => {
  const inputManager = new InputManager(mockCanvas);
  
  SimpleTest.assertTruthy(inputManager);
  SimpleTest.assertTruthy(inputManager.keys);
  SimpleTest.assertTruthy(inputManager.mouse);
});

// Test Arrow Key Detection
SimpleTest.test('Arrow key detection', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Simulate ArrowLeft key press
  inputManager.keys['ArrowLeft'] = true;
  SimpleTest.assertTruthy(inputManager.isKeyPressed('ArrowLeft'));
  
  // Simulate ArrowRight key press
  inputManager.keys['ArrowRight'] = true;
  SimpleTest.assertTruthy(inputManager.isKeyPressed('ArrowRight'));
  
  // Test key release
  inputManager.keys['ArrowLeft'] = false;
  SimpleTest.assertFalsy(inputManager.isKeyPressed('ArrowLeft'));
});

// Test WASD Key Detection
SimpleTest.test('WASD key detection', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Simulate A key press (KeyA code)
  inputManager.keys['KeyA'] = true;
  SimpleTest.assertTruthy(inputManager.isKeyPressed('KeyA'));
  
  // Simulate D key press (KeyD code)
  inputManager.keys['KeyD'] = true;
  SimpleTest.assertTruthy(inputManager.isKeyPressed('KeyD'));
});

// Test Paddle Movement Calculation - Left Movement
SimpleTest.test('Paddle movement - left arrow key', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Simulate ArrowLeft press
  inputManager.keys['ArrowLeft'] = true;
  inputManager.keys['ArrowRight'] = false;
  
  const movement = inputManager.getPaddleMovement();
  SimpleTest.assertEqual(movement, -1, 'Left arrow should return -1');
});

// Test Paddle Movement Calculation - Right Movement
SimpleTest.test('Paddle movement - right arrow key', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Simulate ArrowRight press
  inputManager.keys['ArrowLeft'] = false;
  inputManager.keys['ArrowRight'] = true;
  
  const movement = inputManager.getPaddleMovement();
  SimpleTest.assertEqual(movement, 1, 'Right arrow should return 1');
});

// Test Paddle Movement Calculation - A Key (Left)
SimpleTest.test('Paddle movement - A key', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Simulate A key press
  inputManager.keys['KeyA'] = true;
  inputManager.keys['KeyD'] = false;
  
  const movement = inputManager.getPaddleMovement();
  SimpleTest.assertEqual(movement, -1, 'A key should return -1');
});

// Test Paddle Movement Calculation - D Key (Right)
SimpleTest.test('Paddle movement - D key', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Simulate D key press
  inputManager.keys['KeyA'] = false;
  inputManager.keys['KeyD'] = true;
  
  const movement = inputManager.getPaddleMovement();
  SimpleTest.assertEqual(movement, 1, 'D key should return 1');
});

// Test Paddle Movement Calculation - No Input
SimpleTest.test('Paddle movement - no input', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // No keys pressed
  inputManager.keys['ArrowLeft'] = false;
  inputManager.keys['ArrowRight'] = false;
  inputManager.keys['KeyA'] = false;
  inputManager.keys['KeyD'] = false;
  
  const movement = inputManager.getPaddleMovement();
  SimpleTest.assertEqual(movement, 0, 'No input should return 0');
});

// Test Paddle Movement Calculation - Simultaneous Keys
SimpleTest.test('Paddle movement - simultaneous left and right', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Both left and right pressed (should cancel out)
  inputManager.keys['ArrowLeft'] = true;
  inputManager.keys['ArrowRight'] = true;
  
  const movement = inputManager.getPaddleMovement();
  SimpleTest.assertEqual(movement, 0, 'Simultaneous left+right should return 0');
});

// Test Ball Launch Input
SimpleTest.test('Ball launch input detection', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Test space key
  inputManager.keys[' '] = true;
  SimpleTest.assertTruthy(inputManager.isBallLaunchPressed(), 'Space key should trigger ball launch');
  
  // Test Space code
  inputManager.keys[' '] = false;
  inputManager.keys['Space'] = true;
  SimpleTest.assertTruthy(inputManager.isBallLaunchPressed(), 'Space code should trigger ball launch');
  
  // Test mouse click
  inputManager.keys['Space'] = false;
  inputManager.mouse.clicked = true;
  SimpleTest.assertTruthy(inputManager.isBallLaunchPressed(), 'Mouse click should trigger ball launch');
});

// Test Restart Input
SimpleTest.test('Restart input detection', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Test R key
  inputManager.keys['r'] = true;
  SimpleTest.assertTruthy(inputManager.isRestartPressed(), 'R key should trigger restart');
  
  // Test KeyR code
  inputManager.keys['r'] = false;
  inputManager.keys['KeyR'] = true;
  SimpleTest.assertTruthy(inputManager.isRestartPressed(), 'KeyR code should trigger restart');
});

// Test Continuous Movement - Both Keys Pressed (Should Cancel Out)
SimpleTest.test('Continuous movement - both keys pressed', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Both left and right pressed simultaneously
  inputManager.keys['ArrowLeft'] = true;
  inputManager.keys['ArrowRight'] = true;
  
  const movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, 0, 'Both keys pressed should return 0 (no movement)');
});

// Test Continuous Movement - Left Key Only
SimpleTest.test('Continuous movement - left key only', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Only left key pressed
  inputManager.keys['ArrowLeft'] = true;
  inputManager.keys['ArrowRight'] = false;
  
  const movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, -1, 'Left key only should return -1');
});

// Test Continuous Movement - Right Key Only
SimpleTest.test('Continuous movement - right key only', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Only right key pressed
  inputManager.keys['ArrowLeft'] = false;
  inputManager.keys['ArrowRight'] = true;
  
  const movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, 1, 'Right key only should return 1');
});

// Test Continuous Movement - No Keys Pressed
SimpleTest.test('Continuous movement - no keys pressed', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // No keys pressed
  inputManager.keys['ArrowLeft'] = false;
  inputManager.keys['ArrowRight'] = false;
  inputManager.keys['KeyA'] = false;
  inputManager.keys['KeyD'] = false;
  
  const movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, 0, 'No keys pressed should return 0');
});

// Test Continuous Movement - WASD Keys
SimpleTest.test('Continuous movement - WASD keys', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Test A key (left)
  inputManager.keys['KeyA'] = true;
  inputManager.keys['KeyD'] = false;
  let movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, -1, 'A key should return -1');
  
  // Test D key (right)
  inputManager.keys['KeyA'] = false;
  inputManager.keys['KeyD'] = true;
  movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, 1, 'D key should return 1');
  
  // Test both A and D (should cancel)
  inputManager.keys['KeyA'] = true;
  inputManager.keys['KeyD'] = true;
  movement = inputManager.getContinuousMovement();
  SimpleTest.assertEqual(movement, 0, 'Both A and D should return 0');
});

// Test Time-Based Movement Calculation
SimpleTest.test('Time-based movement calculation', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Mock paddle-like object for testing
  const mockPaddle = {
    x: 100,
    speed: 100, // 100 pixels per second
    update: function(inputManager, deltaTime) {
      const movement = inputManager.getContinuousMovement();
      this.x += movement * this.speed * deltaTime;
    }
  };
  
  // Simulate left movement for 1 second
  inputManager.keys['ArrowLeft'] = true;
  inputManager.keys['ArrowRight'] = false;
  
  const deltaTime = 1.0; // 1 second
  const initialX = mockPaddle.x;
  mockPaddle.update(inputManager, deltaTime);
  
  const expectedX = initialX - (100 * deltaTime); // Should move 100 pixels left
  SimpleTest.assertEqual(mockPaddle.x, expectedX, 'Should move 100 pixels left in 1 second');
});

// Test Frame Rate Independence
SimpleTest.test('Frame rate independence', () => {
  const inputManager = new InputManager(mockCanvas);
  
  // Mock paddle for testing
  const mockPaddle = {
    x: 100,
    speed: 100, // 100 pixels per second
    update: function(inputManager, deltaTime) {
      const movement = inputManager.getContinuousMovement();
      this.x += movement * this.speed * deltaTime;
    }
  };
  
  // Test at 60 FPS (1/60 second per frame)
  inputManager.keys['ArrowRight'] = true;
  inputManager.keys['ArrowLeft'] = false;
  
  const deltaTime60fps = 1/60;
  const initialX = mockPaddle.x;
  
  // Simulate 60 frames (1 second total)
  for (let i = 0; i < 60; i++) {
    mockPaddle.update(inputManager, deltaTime60fps);
  }
  
  const expectedX = initialX + 100; // Should move 100 pixels right in 1 second
  const tolerance = 0.1; // Allow small floating point errors
  SimpleTest.assertTruthy(
    Math.abs(mockPaddle.x - expectedX) < tolerance,
    `Movement should be frame-rate independent. Expected: ${expectedX}, Got: ${mockPaddle.x}`
  );
});

console.log('✅ Input tests loaded');

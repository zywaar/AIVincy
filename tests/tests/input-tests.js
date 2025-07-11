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

console.log('✅ Input tests loaded');

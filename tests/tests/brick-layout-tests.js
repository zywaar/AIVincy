// Brick Layout Tests - Positioning and Layout Generation
import { SimpleTest } from '../test-framework.js';
import { Brick } from '../../src/entities/Brick.js';
import { GameConfig } from '../../src/config/GameConfig.js';

// Test Brick Layout Generation
SimpleTest.test('Brick layout creates correct number of bricks', () => {
  const bricks = Brick.createBrickLayout();
  const expectedCount = GameConfig.bricks.rows * GameConfig.bricks.cols;
  
  SimpleTest.assertEqual(bricks.length, expectedCount);
});

SimpleTest.test('Brick layout dimensions are correct', () => {
  const bricks = Brick.createBrickLayout();
  
  // Check that all bricks have correct dimensions
  bricks.forEach((brick, index) => {
    SimpleTest.assertEqual(brick.width, GameConfig.bricks.width, `Brick ${index} has wrong width`);
    SimpleTest.assertEqual(brick.height, GameConfig.bricks.height, `Brick ${index} has wrong height`);
  });
});

SimpleTest.test('Brick layout positioning is correct', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  
  // Calculate expected layout parameters
  const totalLayoutWidth = config.cols * (config.width + config.padding) - config.padding;
  const expectedStartX = (GameConfig.canvas.width - totalLayoutWidth) / 2;
  const expectedStartY = config.startY;
  
  // Test first brick position (top-left)
  const firstBrick = bricks[0];
  SimpleTest.assertEqual(firstBrick.x, expectedStartX);
  SimpleTest.assertEqual(firstBrick.y, expectedStartY);
  
  // Test second brick position (should be to the right of first)
  const secondBrick = bricks[1];
  SimpleTest.assertEqual(secondBrick.x, expectedStartX + config.width + config.padding);
  SimpleTest.assertEqual(secondBrick.y, expectedStartY);
  
  // Test first brick of second row
  const secondRowFirstBrick = bricks[config.cols];
  SimpleTest.assertEqual(secondRowFirstBrick.x, expectedStartX);
  SimpleTest.assertEqual(secondRowFirstBrick.y, expectedStartY + config.height + config.padding);
});

SimpleTest.test('Brick layout is centered horizontally', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  
  // Get leftmost and rightmost brick positions
  let leftmostX = Infinity;
  let rightmostX = -Infinity;
  
  bricks.forEach(brick => {
    leftmostX = Math.min(leftmostX, brick.x);
    rightmostX = Math.max(rightmostX, brick.x + brick.width);
  });
  
  const layoutWidth = rightmostX - leftmostX;
  const leftMargin = leftmostX;
  const rightMargin = GameConfig.canvas.width - rightmostX;
  
  // Layout should be centered (margins should be approximately equal)
  SimpleTest.assertApproxEqual(leftMargin, rightMargin, 1);
});

SimpleTest.test('Brick layout rows have correct brick types', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  const brickTypes = GameConfig.brickTypes;
  
  // Test each row
  for (let row = 0; row < config.rows; row++) {
    const expectedBrickType = brickTypes[row % brickTypes.length];
    
    // Check all bricks in this row
    for (let col = 0; col < config.cols; col++) {
      const brickIndex = row * config.cols + col;
      const brick = bricks[brickIndex];
      
      SimpleTest.assertEqual(brick.color, expectedBrickType.color, 
        `Row ${row}, Col ${col}: Expected color ${expectedBrickType.color}, got ${brick.color}`);
      SimpleTest.assertEqual(brick.health, expectedBrickType.health,
        `Row ${row}, Col ${col}: Expected health ${expectedBrickType.health}, got ${brick.health}`);
      SimpleTest.assertEqual(brick.points, expectedBrickType.points,
        `Row ${row}, Col ${col}: Expected points ${expectedBrickType.points}, got ${brick.points}`);
    }
  }
});

// Test Brick Layout Consistency Issue (Root cause of the problem)
SimpleTest.test('Brick layout type assignment analysis', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  const brickTypes = GameConfig.brickTypes;
  
  console.log('🔍 Analyzing brick layout type assignment:');
  
  // Analyze each row
  for (let row = 0; row < config.rows; row++) {
    const brickTypeIndex = row % brickTypes.length;
    const brickType = brickTypes[brickTypeIndex];
    const firstBrickInRow = bricks[row * config.cols];
    
    console.log(`Row ${row}: Type ${brickTypeIndex} - Color: ${brickType.color}, Health: ${brickType.health}, Points: ${brickType.points}`);
    
    // Verify the assignment is working as expected
    SimpleTest.assertEqual(firstBrickInRow.color, brickType.color);
    SimpleTest.assertEqual(firstBrickInRow.health, brickType.health);
    SimpleTest.assertEqual(firstBrickInRow.points, brickType.points);
  }
});

SimpleTest.test('Multi-hit brick rows identification', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  const brickTypes = GameConfig.brickTypes;
  
  const multiHitRows = [];
  const singleHitRows = [];
  
  for (let row = 0; row < config.rows; row++) {
    const brickTypeIndex = row % brickTypes.length;
    const brickType = brickTypes[brickTypeIndex];
    
    if (brickType.health > 1) {
      multiHitRows.push({ row, color: brickType.color, health: brickType.health });
    } else {
      singleHitRows.push({ row, color: brickType.color, health: brickType.health });
    }
  }
  
  console.log('Multi-hit rows:', multiHitRows);
  console.log('Single-hit rows:', singleHitRows);
  
  // This test documents the current behavior - rows 2 and 3 are multi-hit
  SimpleTest.assertTruthy(multiHitRows.length > 0, 'Should have multi-hit rows');
  SimpleTest.assertTruthy(singleHitRows.length > 0, 'Should have single-hit rows');
});

// Test Brick Spacing and Padding
SimpleTest.test('Brick horizontal spacing is correct', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  
  // Test spacing between adjacent bricks in the same row
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols - 1; col++) {
      const currentBrick = bricks[row * config.cols + col];
      const nextBrick = bricks[row * config.cols + col + 1];
      
      const gap = nextBrick.x - (currentBrick.x + currentBrick.width);
      SimpleTest.assertEqual(gap, config.padding, 
        `Row ${row}, between cols ${col}-${col+1}: Expected gap ${config.padding}, got ${gap}`);
    }
  }
});

SimpleTest.test('Brick vertical spacing is correct', () => {
  const bricks = Brick.createBrickLayout();
  const config = GameConfig.bricks;
  
  // Test spacing between rows
  for (let row = 0; row < config.rows - 1; row++) {
    const currentRowBrick = bricks[row * config.cols];
    const nextRowBrick = bricks[(row + 1) * config.cols];
    
    const gap = nextRowBrick.y - (currentRowBrick.y + currentRowBrick.height);
    SimpleTest.assertEqual(gap, config.padding,
      `Between rows ${row}-${row+1}: Expected gap ${config.padding}, got ${gap}`);
  }
});

// Test Layout Bounds
SimpleTest.test('Brick layout fits within canvas bounds', () => {
  const bricks = Brick.createBrickLayout();
  
  bricks.forEach((brick, index) => {
    // Check horizontal bounds
    SimpleTest.assertTruthy(brick.x >= 0, `Brick ${index} x position ${brick.x} is negative`);
    SimpleTest.assertTruthy(brick.x + brick.width <= GameConfig.canvas.width, 
      `Brick ${index} extends beyond right canvas edge`);
    
    // Check vertical bounds (should be in upper portion of canvas)
    SimpleTest.assertTruthy(brick.y >= 0, `Brick ${index} y position ${brick.y} is negative`);
    SimpleTest.assertTruthy(brick.y + brick.height <= GameConfig.canvas.height / 2, 
      `Brick ${index} extends too far down the canvas`);
  });
});

// Test Layout Consistency
SimpleTest.test('Brick layout is deterministic', () => {
  const layout1 = Brick.createBrickLayout();
  const layout2 = Brick.createBrickLayout();
  
  SimpleTest.assertEqual(layout1.length, layout2.length);
  
  for (let i = 0; i < layout1.length; i++) {
    const brick1 = layout1[i];
    const brick2 = layout2[i];
    
    SimpleTest.assertEqual(brick1.x, brick2.x, `Brick ${i} x position differs between layouts`);
    SimpleTest.assertEqual(brick1.y, brick2.y, `Brick ${i} y position differs between layouts`);
    SimpleTest.assertEqual(brick1.color, brick2.color, `Brick ${i} color differs between layouts`);
    SimpleTest.assertEqual(brick1.health, brick2.health, `Brick ${i} health differs between layouts`);
    SimpleTest.assertEqual(brick1.points, brick2.points, `Brick ${i} points differs between layouts`);
  }
});

// Test Edge Cases
SimpleTest.test('Layout handles zero padding correctly', () => {
  // Temporarily modify config for this test
  const originalPadding = GameConfig.bricks.padding;
  GameConfig.bricks.padding = 0;
  
  try {
    const bricks = Brick.createBrickLayout();
    
    // With zero padding, bricks should be touching
    for (let row = 0; row < GameConfig.bricks.rows; row++) {
      for (let col = 0; col < GameConfig.bricks.cols - 1; col++) {
        const currentBrick = bricks[row * GameConfig.bricks.cols + col];
        const nextBrick = bricks[row * GameConfig.bricks.cols + col + 1];
        
        const gap = nextBrick.x - (currentBrick.x + currentBrick.width);
        SimpleTest.assertEqual(gap, 0, `With zero padding, bricks should touch`);
      }
    }
  } finally {
    // Restore original padding
    GameConfig.bricks.padding = originalPadding;
  }
});

SimpleTest.test('Layout handles single row correctly', () => {
  const originalRows = GameConfig.bricks.rows;
  GameConfig.bricks.rows = 1;
  
  try {
    const bricks = Brick.createBrickLayout();
    
    SimpleTest.assertEqual(bricks.length, GameConfig.bricks.cols);
    
    // All bricks should be in the same row
    const firstBrickY = bricks[0].y;
    bricks.forEach((brick, index) => {
      SimpleTest.assertEqual(brick.y, firstBrickY, `Brick ${index} not in same row`);
    });
  } finally {
    GameConfig.bricks.rows = originalRows;
  }
});

SimpleTest.test('Layout handles single column correctly', () => {
  const originalCols = GameConfig.bricks.cols;
  GameConfig.bricks.cols = 1;
  
  try {
    const bricks = Brick.createBrickLayout();
    
    SimpleTest.assertEqual(bricks.length, GameConfig.bricks.rows);
    
    // All bricks should be in the same column
    const firstBrickX = bricks[0].x;
    bricks.forEach((brick, index) => {
      SimpleTest.assertEqual(brick.x, firstBrickX, `Brick ${index} not in same column`);
    });
  } finally {
    GameConfig.bricks.cols = originalCols;
  }
});

console.log('✅ Brick layout tests loaded');

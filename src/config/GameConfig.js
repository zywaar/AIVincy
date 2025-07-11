// Game Configuration
export const GameConfig = {
  // Canvas settings
  canvas: {
    width: 800,
    height: 600
  },

  // Paddle settings
  paddle: {
    width: 100,
    height: 15,
    speed: 100, // pixels per second (increased from 20 for faster movement)
    yOffset: 40 // Distance from bottom
  },

  // Ball settings
  ball: {
    radius: 10,
    speed: 5
  },

  // Brick settings
  bricks: {
    rows: 6,
    cols: 10,
    width: 75,
    height: 20,
    padding: 5,
    startY: 50
  },

  // Power-up settings
  powerUps: {
    width: 30,
    height: 15,
    speed: 2,
    dropRate: 0.2, // 20% chance
    duration: 15000, // 15 seconds
    types: ['wide_paddle', 'multi_ball', 'slow_ball'],
    colors: {
      'wide_paddle': '#00ff88',
      'multi_ball': '#ff8844',
      'slow_ball': '#4488ff'
    }
  },

  // Moving blocks settings (Hard Mode)
  movingBlocks: {
    width: 100,        // Same as paddle
    height: 15,        // Same as paddle
    speed1: 150,       // pixels per second for first block
    speed2: 200,       // pixels per second for second block
    color: '#FF6600',  // Tron orange
    trailLength: 20,   // trail points
    spacing: 30        // vertical spacing between blocks
  },

  // Game settings
  game: {
    initialLives: 3,
    initialLevel: 1
  },

  // Brick types with health and points
  brickTypes: [
    { color: '#ff4444', health: 2, points: 10 }, // Red
    { color: '#ff8844', health: 2, points: 20 }, // Orange  
    { color: '#ffff44', health: 2, points: 30 }, // Yellow
    { color: '#44ff44', health: 2, points: 40 }, // Green
    { color: '#4444ff', health: 2, points: 15 }, // Blue
    { color: '#ff44ff', health: 2, points: 25 }  // Purple
  ],

  // Game states
  states: {
    PLAYING: 'playing',
    GAME_OVER: 'game_over',
    WIN: 'win',
    PAUSED: 'paused'
  }
};

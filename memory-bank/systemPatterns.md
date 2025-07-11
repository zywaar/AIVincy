# System Patterns: Brick Ball Game

## System Architecture

### Core Components
```
Game Engine
├── Game State Manager
├── Rendering System (Canvas)
├── Physics Engine
├── Input Handler
├── Collision Detection
└── Audio System (future)
```

### Key Technical Decisions
- **Single Page Application**: All game logic contained in one HTML file with embedded CSS/JS
- **Canvas-Based Rendering**: HTML5 Canvas for smooth 2D graphics and animations
- **Game Loop Pattern**: RequestAnimationFrame for consistent 60fps updates
- **State Machine**: Clear separation between game states (menu, playing, paused, game over)
- **Component-Based Entities**: Separate classes for Ball, Paddle, Brick, and Game objects

## Design Patterns in Use

### 1. Game Loop Pattern
```javascript
function gameLoop() {
    update();    // Update game logic
    render();    // Draw current frame
    requestAnimationFrame(gameLoop);
}
```

### 2. State Machine Pattern
- **States**: MENU, PLAYING, PAUSED, GAME_OVER, WIN
- **Transitions**: Clear rules for moving between states
- **State-Specific Logic**: Different update/render behavior per state

### 3. Entity Component Pattern
- **Ball**: Position, velocity, radius, collision bounds
- **Paddle**: Position, width, height, movement constraints
- **Brick**: Position, dimensions, health/durability, point value
- **Game**: Score, lives, level, state management

### 4. Observer Pattern (for Events)
- Score updates
- Brick destruction
- Life loss
- Game state changes

## Component Relationships

### Core Game Objects
```
Game Controller
├── manages → Ball (position, velocity, collisions)
├── manages → Paddle (position, input response)
├── manages → Brick Array (destruction, collision)
├── tracks → Score, Lives, Level
└── controls → Game State
```

### Data Flow
1. **Input** → Paddle Position Update
2. **Physics Update** → Ball Position/Velocity
3. **Collision Detection** → Ball/Brick/Paddle interactions
4. **Game Logic** → Score, Lives, Win/Lose conditions
5. **Rendering** → Canvas drawing of all objects

## Critical Implementation Paths

### 1. Collision Detection System
- **Ball-Paddle**: Angle calculation based on contact point
- **Ball-Brick**: Destruction logic and bounce direction
- **Ball-Walls**: Boundary reflection (top, left, right)
- **Ball-Bottom**: Life loss condition

### 2. Physics Integration
- **Velocity Vectors**: X/Y components for ball movement
- **Bounce Calculations**: Reflection angles off surfaces
- **Paddle Influence**: Ball direction modification based on paddle movement

### 3. Game State Management
- **Initialization**: Setup game objects and initial state
- **Update Cycle**: Process input, physics, collisions, game logic
- **Render Cycle**: Clear canvas, draw all objects, UI elements
- **State Transitions**: Handle game start, pause, restart, win/lose

### 4. Performance Considerations
- **Object Pooling**: Reuse brick objects instead of creating/destroying
- **Efficient Collision**: Spatial partitioning or broad-phase detection
- **Canvas Optimization**: Minimize drawing operations, use dirty rectangles
- **Memory Management**: Avoid memory leaks in game loop

## Code Organization
```
index.html
├── HTML structure (canvas, UI elements)
├── CSS styles (embedded)
└── JavaScript (embedded)
    ├── Game class (main controller)
    ├── Ball class
    ├── Paddle class
    ├── Brick class
    ├── Collision utilities
    ├── Input handling
    └── Game loop

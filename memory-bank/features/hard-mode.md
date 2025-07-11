# Hard Mode Feature

## Overview
Hard Mode adds dynamic moving obstacles to increase game difficulty. Two indestructible blocks move horizontally across the play area, creating unpredictable ball trajectories and requiring advanced player skill.

## Implementation Details

### MovingBlock Entity (`src/entities/MovingBlock.js`)
- **Size**: 100px × 15px (same as paddle)
- **Color**: Tron orange (#FF6600) with glass-like transparency
- **Movement**: Horizontal left-right pattern with wall collision detection
- **Speeds**: Block 1 at 150px/s, Block 2 at 200px/s
- **Trail System**: 20px glowing orange trail with fade effect
- **Visual Effects**: Direction arrows, glass highlights, edge glow

### Positioning Logic
- Positioned halfway between paddle and lowest brick row
- 30px vertical spacing between the two blocks
- Starting positions: one at left edge, one at right edge
- Independent movement directions

### Game Integration (`src/main.js`)
- **State Management**: `hardMode` boolean and `movingBlocks` array
- **Update Loop**: Delta-time based smooth movement
- **Collision Detection**: Ball-block collision with proper bounce physics
- **Rendering**: Conditional rendering only when hard mode active
- **Reset Logic**: Blocks reset on game restart and mode toggle

### Configuration (`src/config/GameConfig.js`)
```javascript
movingBlocks: {
  width: 100,        // Same as paddle
  height: 15,        // Same as paddle
  speed1: 150,       // pixels per second for first block
  speed2: 200,       // pixels per second for second block
  color: '#FF6600',  // Tron orange
  trailLength: 20,   // trail points
  spacing: 30        // vertical spacing between blocks
}
```

### UI Controls (`index.html`)
- **Toggle Button**: "🔥 HARD MODE: OFF/ON" positioned under game canvas
- **Styling**: Tron orange theme with glowing animation when active
- **JavaScript**: `toggleHardMode()` function handles state changes
- **Visual Feedback**: Button appearance changes with mode status

## Technical Features

### Movement System
- **Delta Time**: Frame-rate independent movement using deltaTime
- **Wall Collision**: Proper direction reversal at canvas boundaries
- **Position Correction**: Prevents blocks from moving outside bounds

### Collision Physics
- **Detection**: Uses existing MathUtils.rectanglesCollide()
- **Bounce Logic**: Determines collision side (horizontal/vertical)
- **Position Correction**: Prevents ball tunneling through fast-moving blocks
- **Indestructible**: Blocks cannot be destroyed by ball impacts

### Visual Effects
- **Trail Rendering**: Additive blending for glow effect
- **Opacity Fade**: Trail segments fade based on distance and age
- **Glass Effect**: Semi-transparent with edge highlights
- **Direction Indicators**: Subtle arrows showing movement direction

## Performance Optimizations
- **Conditional Updates**: Only update/render when hard mode active
- **Trail Management**: Automatic cleanup of old trail points
- **Efficient Collision**: Early exit when hard mode disabled

## Integration Points
- **Power-up System**: Compatible with existing power-ups
- **Multi-ball**: Works with multiple balls simultaneously
- **Game States**: Properly handles pause, restart, and game over

## Testing Notes
- Test collision accuracy at different frame rates
- Verify trail rendering performance with multiple blocks
- Check ball behavior with various collision angles
- Ensure proper state management during mode toggles

## Future Enhancements
- **Variable Speeds**: Allow speed adjustment during gameplay
- **Multiple Patterns**: Add vertical or diagonal movement options
- **Block Types**: Different block behaviors (teleporting, size-changing)
- **Difficulty Scaling**: Increase speed or add more blocks over time

## Dependencies
- GameConfig.js for configuration
- MathUtils.js for collision detection
- Existing game loop and rendering system
- HTML/CSS for UI controls

## Files Modified
- `src/entities/MovingBlock.js` (new)
- `src/main.js` (updated)
- `src/config/GameConfig.js` (updated)
- `index.html` (updated)
- `server.js` (new - for testing)

## Usage
1. Click "🔥 HARD MODE" button to toggle
2. Two orange blocks appear with glowing trails
3. Blocks move at different speeds (150px/s and 200px/s)
4. Balls bounce off indestructible blocks
5. Navigate around obstacles to clear all bricks

## Visual Design
Maintains Tron aesthetic with:
- Orange color scheme complementing cyan elements
- Glass-like transparency effects
- Glowing edges and trails
- Consistent styling with existing game elements

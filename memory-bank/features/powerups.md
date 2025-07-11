# Power-ups System

## Overview
The power-up system provides temporary enhancements to gameplay, dropping randomly when bricks are destroyed. The system includes visual indicators, timed effects, and collision detection.

## Current Power-ups

### Wide Paddle
- **Effect**: Increases paddle width by 50% (from 100px to 150px)
- **Duration**: 15 seconds
- **Drop Rate**: 20% chance when brick destroyed
- **Visual**: Green power-up with "WIDE" text
- **Color**: #00ff88
- **Implementation**: Modifies `paddle.width` property, restores to `originalWidth` on expiration

### Multi-ball
- **Effect**: Creates additional balls (simplified implementation)
- **Duration**: Until balls are lost
- **Drop Rate**: 20% chance when brick destroyed
- **Visual**: Orange power-up with "MULTI" text
- **Color**: #ff8844
- **Implementation**: Currently modifies main ball behavior (placeholder for full multi-ball)

### Slow Ball
- **Effect**: Reduces ball speed by 30% (multiplier of 0.7)
- **Duration**: 15 seconds
- **Drop Rate**: 20% chance when brick destroyed
- **Visual**: Blue power-up with "SLOW" text
- **Color**: #4488ff
- **Implementation**: Multiplies `ball.speedX` and `ball.speedY` by 0.7, restores on expiration

## Technical Implementation

### PowerUp Class Structure
```javascript
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 15;
        this.type = type;
        this.speedY = 2;
        this.collected = false;
        this.colors = {
            'wide_paddle': '#00ff88',
            'multi_ball': '#ff8844',
            'slow_ball': '#4488ff'
        };
    }
}
```

### Drop System
- **Trigger**: When brick is destroyed (`brick.destroyed = true`)
- **Location**: Center of destroyed brick (`brick.x + brick.width / 2, brick.y + brick.height`)
- **Probability**: 20% chance per brick destruction
- **Selection**: Random selection from available power-up types

### Collection System
- **Detection**: AABB collision between falling power-up and paddle
- **Activation**: Immediate effect application when collected
- **Cleanup**: Power-up removed from array when collected or falls off screen

### Active Power-up Management
```javascript
// Power-up activation
activatePowerUp(type) {
    const duration = 15000; // 15 seconds
    const powerUp = {
        type: type,
        endTime: Date.now() + duration
    };
    this.activePowerUps.push(powerUp);
}

// Power-up expiration check
updatePowerUps() {
    for (let i = this.activePowerUps.length - 1; i >= 0; i--) {
        const powerUp = this.activePowerUps[i];
        if (Date.now() >= powerUp.endTime) {
            // Deactivate and remove
        }
    }
}
```

## Visual System

### Power-up Rendering
- **Gradient Fill**: Linear gradient from main color to darker variant
- **Border**: White 2px border for visibility
- **Text Label**: Uppercase first word of power-up type
- **Font**: Bold 10px Arial, centered

### Active Power-up Indicators
- **Location**: Top-right corner of canvas
- **Display**: Power-up name and remaining time
- **Background**: Semi-transparent black (rgba(0, 0, 0, 0.7))
- **Text Color**: Green (#00ff88)
- **Update Rate**: Real-time countdown in seconds

### Visual Effects
```javascript
// Power-up gradient rendering
const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
gradient.addColorStop(0, this.colors[this.type]);
gradient.addColorStop(1, this.getDarkerColor(this.colors[this.type]));
```

## Game Integration

### Drop Timing
- Power-ups drop immediately when brick is destroyed
- Fall at constant speed (2 pixels per frame)
- Removed if they fall off screen without collection

### Effect Stacking
- Multiple power-ups of same type extend duration
- Different power-ups can be active simultaneously
- Visual indicators show all active effects

### Performance Considerations
- Power-ups use object pooling pattern (can be implemented)
- Efficient collision detection using AABB
- Minimal impact on 60fps target

## Future Enhancements

### Laser Paddle (Planned)
- **Effect**: Allows paddle to shoot projectiles
- **Duration**: 15 seconds
- **Visual**: Pink/red power-up
- **Implementation**: Add shooting mechanics and projectile system

### Additional Power-ups (Ideas)
- **Sticky Paddle**: Ball sticks to paddle for controlled launch
- **Extra Life**: Adds one life to player
- **Score Multiplier**: Doubles points for limited time
- **Bigger Ball**: Increases ball size for easier paddle hits

## Testing Checklist
- [ ] Power-ups drop at correct rate (20%)
- [ ] All three types render correctly
- [ ] Collision detection works with paddle
- [ ] Effects activate immediately upon collection
- [ ] Duration timers count down accurately
- [ ] Effects deactivate after 15 seconds
- [ ] Visual indicators display correctly
- [ ] Multiple power-ups can be active simultaneously
- [ ] Power-ups fall off screen if not collected
- [ ] No memory leaks from power-up objects

## Code Patterns

### Power-up Factory Pattern
```javascript
createPowerUp(x, y) {
    const types = ['wide_paddle', 'multi_ball', 'slow_ball'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new PowerUp(x, y, randomType);
}
```

### Effect Application Pattern
```javascript
applyEffect(type) {
    switch(type) {
        case 'wide_paddle':
            this.paddle.width = this.paddle.originalWidth * 1.5;
            break;
        case 'slow_ball':
            this.ball.speedX *= 0.7;
            this.ball.speedY *= 0.7;
            break;
    }
}
```

### Cleanup Pattern
```javascript
removeEffect(type) {
    switch(type) {
        case 'wide_paddle':
            this.paddle.width = this.paddle.originalWidth;
            break;
        case 'slow_ball':
            // Restore original speed ratio
            const currentSpeed = Math.sqrt(this.ball.speedX ** 2 + this.ball.speedY ** 2);
            const speedMultiplier = BALL_SPEED / currentSpeed;
            this.ball.speedX *= speedMultiplier;
            this.ball.speedY *= speedMultiplier;
            break;
    }
}

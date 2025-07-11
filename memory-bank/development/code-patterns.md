# Code Patterns for Brick Ball Game

## Core Class Templates

### Game Object Base Pattern
```javascript
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    update() {
        // Override in subclasses
    }
    
    render(ctx) {
        // Override in subclasses
    }
    
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}
```

### Collision Detection Pattern
```javascript
function checkCollision(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

function ballBrickCollision(ball, brick) {
    const ballBounds = {
        left: ball.x - ball.radius,
        right: ball.x + ball.radius,
        top: ball.y - ball.radius,
        bottom: ball.y + ball.radius
    };
    
    return checkCollision(ballBounds, brick.getBounds());
}
```

### Game State Management Pattern
```javascript
const GAME_STATES = {
    MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3,
    WIN: 4
};

class Game {
    constructor() {
        this.state = GAME_STATES.MENU;
    }
    
    update() {
        switch(this.state) {
            case GAME_STATES.PLAYING:
                this.updateGameplay();
                break;
            case GAME_STATES.MENU:
                this.updateMenu();
                break;
            // ... other states
        }
    }
    
    setState(newState) {
        this.state = newState;
        this.onStateChange(newState);
    }
}
```

## Feature Implementation Patterns

### Power-up System Pattern
```javascript
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.active = false;
        this.duration = 15000; // 15 seconds
        this.startTime = 0;
    }
    
    activate() {
        this.active = true;
        this.startTime = Date.now();
        this.applyEffect();
    }
    
    update() {
        if (this.active && Date.now() - this.startTime > this.duration) {
            this.deactivate();
        }
    }
    
    applyEffect() {
        // Override in specific power-up types
    }
    
    removeEffect() {
        // Override in specific power-up types
    }
}
```

### Metrics Tracking Pattern
```javascript
class PlayerMetrics {
    constructor() {
        this.ballsLost = 0;
        this.bricksHit = 0;
        this.totalBallBounces = 0;
        this.gameStartTime = Date.now();
    }
    
    recordBallLost() {
        this.ballsLost++;
        this.updateAssistanceLevel();
    }
    
    recordBrickHit() {
        this.bricksHit++;
    }
    
    recordBallBounce() {
        this.totalBallBounces++;
    }
    
    getAccuracy() {
        const total = this.totalBallBounces + this.ballsLost;
        return total > 0 ? (this.totalBallBounces / total) * 100 : 100;
    }
    
    getAssistanceLevel() {
        const accuracy = this.getAccuracy();
        if (accuracy > 60) return 'NO_HELP';
        if (accuracy > 30) return 'SUBTLE_HELP';
        return 'ACTIVE_HELP';
    }
}
```

## Canvas Rendering Patterns

### Efficient Drawing Pattern
```javascript
function renderGame(ctx) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    ctx.save();
    
    // Render background
    renderBackground(ctx);
    
    // Render game objects
    bricks.forEach(brick => brick.render(ctx));
    paddle.render(ctx);
    balls.forEach(ball => ball.render(ctx));
    powerUps.forEach(powerUp => powerUp.render(ctx));
    
    // Render UI
    renderUI(ctx);
    
    // Restore context state
    ctx.restore();
}
```

### Gradient and Effects Pattern
```javascript
function createGradient(ctx, x, y, width, height, color1, color2) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

function renderWithShadow(ctx, renderFunc) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    renderFunc();
    ctx.restore();
}
```

## Event Handling Patterns

### Input Management Pattern
```javascript
class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}
```

## Performance Optimization Patterns

### Object Pooling Pattern
```javascript
class ObjectPool {
    constructor(createFunc, resetFunc, initialSize = 10) {
        this.createFunc = createFunc;
        this.resetFunc = resetFunc;
        this.pool = [];
        this.active = [];
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFunc());
        }
    }
    
    get() {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.createFunc();
        }
        this.active.push(obj);
        return obj;
    }
    
    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFunc(obj);
            this.pool.push(obj);
        }
    }
}
```

## Common Utility Functions

### Math Utilities
```javascript
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
```

### Animation Helpers
```javascript
function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animate(duration, updateFunc, completeFunc) {
    const startTime = Date.now();
    
    function frame() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        updateFunc(progress);
        
        if (progress < 1) {
            requestAnimationFrame(frame);
        } else if (completeFunc) {
            completeFunc();
        }
    }
    
    requestAnimationFrame(frame);
}

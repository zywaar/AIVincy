# Tech Context: Brick Ball Game

## Technologies Used

### Core Technologies
- **HTML5**: Structure and Canvas element for game rendering
- **CSS3**: Styling, layout, and visual effects
- **JavaScript (ES6+)**: Game logic, physics, and interactivity
- **Canvas API**: 2D graphics rendering and animation

### Browser APIs
- **RequestAnimationFrame**: Smooth 60fps game loop
- **Canvas 2D Context**: Drawing operations (fillRect, arc, etc.)
- **Event Listeners**: Keyboard and mouse input handling
- **Local Storage**: High score persistence (future feature)

## Development Setup

### File Structure
```
AIVincy/
├── index.html          # Main game file (all-in-one)
├── memory-bank/        # Project documentation
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   └── progress.md
└── README.md           # Project overview (optional)
```

### Development Environment
- **Editor**: Any text editor or IDE with HTML/CSS/JS support
- **Browser**: Modern browser with Canvas support (Chrome, Firefox, Safari, Edge)
- **Testing**: Direct browser testing, no build process required
- **Version Control**: Git (optional but recommended)

## Technical Constraints

### Browser Compatibility
- **Minimum Requirements**: HTML5 Canvas support (IE9+, all modern browsers)
- **Preferred Targets**: Chrome 60+, Firefox 55+, Safari 10+, Edge 79+
- **Mobile Considerations**: Touch events for mobile paddle control (future)

### Performance Requirements
- **Frame Rate**: Maintain 60fps during gameplay
- **Memory Usage**: Minimal memory footprint, avoid memory leaks
- **Load Time**: Game should be playable within 2 seconds of page load
- **Responsiveness**: Input lag should be imperceptible (<16ms)

### Canvas Specifications
- **Resolution**: 800x600 pixels (adjustable)
- **Coordinate System**: Standard Canvas (0,0 at top-left)
- **Drawing Context**: 2D context only
- **Color Depth**: Standard web colors (hex, rgb, rgba)

## Dependencies

### No External Dependencies
- **Philosophy**: Keep it simple, no frameworks or libraries
- **Benefits**: Fast loading, no dependency management, easy deployment
- **Trade-offs**: More manual coding, but better learning experience

### Built-in Browser Features Only
- **Canvas API**: For all graphics rendering
- **JavaScript Engine**: For game logic and physics
- **DOM Events**: For input handling
- **CSS**: For any UI styling outside the canvas

## Tool Usage Patterns

### Development Workflow
1. **Edit**: Modify index.html in any text editor
2. **Test**: Open/refresh in browser
3. **Debug**: Use browser developer tools
4. **Iterate**: Make changes and test immediately

### Debugging Tools
- **Browser DevTools**: Console logging, performance profiling
- **Canvas Inspector**: Visual debugging of drawing operations
- **Performance Monitor**: FPS tracking and bottleneck identification
- **Console Methods**: console.log(), console.time(), console.count()

### Testing Strategy
- **Manual Testing**: Play-test in multiple browsers
- **Performance Testing**: Monitor FPS during intensive gameplay
- **Cross-Browser Testing**: Verify compatibility across target browsers
- **Mobile Testing**: Test touch controls on mobile devices (future)

## Code Standards

### JavaScript Conventions
- **ES6+ Features**: Classes, arrow functions, const/let
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: JSDoc-style comments for functions and classes
- **Error Handling**: Try-catch blocks for critical operations

### Canvas Best Practices
- **State Management**: Save/restore canvas state when needed
- **Efficient Drawing**: Minimize drawing operations per frame
- **Clear Strategy**: Clear entire canvas or use dirty rectangles
- **Coordinate Precision**: Use integer coordinates when possible

### Performance Optimization
- **Object Pooling**: Reuse objects instead of creating/destroying
- **Efficient Loops**: Minimize nested loops in game update cycle
- **Early Returns**: Exit functions early when conditions aren't met
- **Batch Operations**: Group similar canvas operations together

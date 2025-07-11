// Math utility functions for the game

export class MathUtils {
  /**
   * Clamp a value between min and max
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation between two values
   */
  static lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  /**
   * Calculate distance between two points
   */
  static distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Generate random number between min and max
   */
  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Check if two rectangles overlap (AABB collision)
   */
  static rectanglesOverlap(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
  }

  /**
   * Check if a circle overlaps with a rectangle
   */
  static circleRectangleOverlap(circle, rectangle) {
    const circleBounds = {
      left: circle.x - circle.radius,
      right: circle.x + circle.radius,
      top: circle.y - circle.radius,
      bottom: circle.y + circle.radius
    };
    
    return this.rectanglesOverlap(circleBounds, rectangle);
  }

  /**
   * Create a darker version of a hex color
   */
  static darkenColor(hexColor, factor = 0.7) {
    const colorMap = {
      '#ff4444': '#aa2222',
      '#ff8844': '#aa4422',
      '#ffff44': '#aaaa22',
      '#44ff44': '#22aa22',
      '#4444ff': '#2222aa',
      '#ff44ff': '#aa22aa',
      '#00ff88': '#00cc66',
      '#cc2222': '#881111',
      '#cc5522': '#882211',
      '#cccc22': '#888811',
      '#22cc22': '#118811'
    };
    
    return colorMap[hexColor] || hexColor;
  }

  /**
   * Normalize an angle to be between 0 and 2π
   */
  static normalizeAngle(angle) {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians) {
    return radians * (180 / Math.PI);
  }
}

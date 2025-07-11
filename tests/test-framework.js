// Simple Test Framework for Browser-based Testing

export class SimpleTest {
  static tests = [];
  static results = [];

  /**
   * Register a test
   */
  static test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  /**
   * Assert that a condition is true
   */
  static assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Assert that two values are equal
   */
  static assertEqual(actual, expected, message = null) {
    const defaultMessage = `Expected ${expected}, but got ${actual}`;
    this.assert(actual === expected, message || defaultMessage);
  }

  /**
   * Assert that two values are not equal
   */
  static assertNotEqual(actual, expected, message = null) {
    const defaultMessage = `Expected ${actual} to not equal ${expected}`;
    this.assert(actual !== expected, message || defaultMessage);
  }

  /**
   * Assert that a value is truthy
   */
  static assertTruthy(value, message = 'Expected truthy value') {
    this.assert(!!value, message);
  }

  /**
   * Assert that a value is falsy
   */
  static assertFalsy(value, message = 'Expected falsy value') {
    this.assert(!value, message);
  }

  /**
   * Assert that an array contains a specific value
   */
  static assertContains(array, value, message = null) {
    const defaultMessage = `Expected array to contain ${value}`;
    this.assert(array.includes(value), message || defaultMessage);
  }

  /**
   * Assert that a number is approximately equal (for floating point comparisons)
   */
  static assertApproxEqual(actual, expected, tolerance = 0.001, message = null) {
    const defaultMessage = `Expected ${expected} ± ${tolerance}, but got ${actual}`;
    this.assert(Math.abs(actual - expected) <= tolerance, message || defaultMessage);
  }

  /**
   * Run all registered tests
   */
  static async runAll() {
    this.results = [];
    const startTime = Date.now();
    
    console.log('🧪 Running tests...\n');
    
    for (const test of this.tests) {
      try {
        const testStartTime = Date.now();
        await test.testFunction();
        const testEndTime = Date.now();
        
        const result = {
          name: test.name,
          status: 'PASS',
          duration: testEndTime - testStartTime,
          error: null
        };
        
        this.results.push(result);
        console.log(`✅ ${test.name} (${result.duration}ms)`);
        
      } catch (error) {
        const result = {
          name: test.name,
          status: 'FAIL',
          duration: 0,
          error: error.message
        };
        
        this.results.push(result);
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    this.displaySummary(totalDuration);
    this.displayResultsInDOM();
  }

  /**
   * Display test summary
   */
  static displaySummary(totalDuration) {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`\n📊 Test Summary:`);
    console.log(`   Total: ${total}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Duration: ${totalDuration}ms`);
    
    if (failed === 0) {
      console.log(`\n🎉 All tests passed!`);
    } else {
      console.log(`\n💥 ${failed} test(s) failed.`);
    }
  }

  /**
   * Display results in the DOM
   */
  static displayResultsInDOM() {
    const resultsContainer = document.getElementById('test-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    // Summary
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    const summary = document.createElement('div');
    summary.className = 'test-summary';
    summary.innerHTML = `
      <h2>Test Results</h2>
      <p><strong>Total:</strong> ${total} | <strong>Passed:</strong> ${passed} | <strong>Failed:</strong> ${failed}</p>
    `;
    resultsContainer.appendChild(summary);
    
    // Individual results
    this.results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.className = `test-result test-${result.status.toLowerCase()}`;
      
      let content = `
        <span class="test-status">${result.status === 'PASS' ? '✅' : '❌'}</span>
        <span class="test-name">${result.name}</span>
      `;
      
      if (result.status === 'PASS') {
        content += `<span class="test-duration">(${result.duration}ms)</span>`;
      } else {
        content += `<div class="test-error">Error: ${result.error}</div>`;
      }
      
      resultDiv.innerHTML = content;
      resultsContainer.appendChild(resultDiv);
    });
  }

  /**
   * Clear all tests (useful for re-running)
   */
  static clear() {
    this.tests = [];
    this.results = [];
  }

  /**
   * Get test results
   */
  static getResults() {
    return this.results.slice(); // Return copy
  }

  /**
   * Check if all tests passed
   */
  static allTestsPassed() {
    return this.results.every(result => result.status === 'PASS');
  }
}

// Make it available globally for convenience
window.SimpleTest = SimpleTest;

/**
 * @jest-environment jsdom
 */

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('script.js DOMContentLoaded', () => {
  beforeEach(() => {
    // Clear document
    document.body.innerHTML = '';

    // We need to reload the script cleanly. But the script adds a listener on 'document' and doesn't remove it.
    // If we require it multiple times, it might add multiple listeners.
    // So we mock the event listener or simply test the side effect by dispatching on the document.
    // But since `require` caches, let's reset modules.
    jest.resetModules();
  });

  afterEach(() => {
    // Clear any listeners by replacing the document element (simple way to wipe listeners on document? No, document event listeners persist)
    // Actually, JSDOM preserves document listeners across tests unless we reconstruct JSDOM or just let it run.
    // It's safe to just let it run, but since it's an anonymous function, we can't easily remove it.
    // Let's just reset the entire DOM and require the script per test.
  });

  it('should set the textContent to the current year when #year element exists', () => {
    // Setup DOM with #year element
    document.body.innerHTML = '<span id="year"></span>';

    require('./script.js');

    document.dispatchEvent(new Event('DOMContentLoaded'));

    const yearSpan = document.getElementById('year');
    expect(yearSpan.textContent).toBe(new Date().getFullYear().toString());
  });

  it('should not throw an error when #year element is missing', () => {
    // Setup DOM without #year element
    document.body.innerHTML = '<div>Some content</div>';

    require('./script.js');

    expect(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }).not.toThrow();
  });
});

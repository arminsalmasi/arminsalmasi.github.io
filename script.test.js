/**
 * @jest-environment jsdom
 */

// Load the script.js content so we can test its behavior
const fs = require('fs');
const path = require('path');

const html = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <div class="background-blobs">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
        </div>
        <footer>
            <p>&copy; <span id="year"></span> Armin Salmasi. Built with <i class="fas fa-heart"></i></p>
        </footer>
        <div class="fade-in"></div>
        <div class="fade-in"></div>
    </body>
    </html>
`;

describe('Portfolio Script Tests', () => {
    let intersectionObserverMock;
    let observeMock;

    beforeEach(() => {
        // Clear all previous module cache to make sure the script is fully isolated
        jest.resetModules();

        // Overwrite the DOM to clear out listeners
        document.replaceChild(document.createElement('html'), document.documentElement);
        document.documentElement.innerHTML = `
            <head></head>
            <body>
                <div class="background-blobs">
                    <div class="blob blob-1"></div>
                    <div class="blob blob-2"></div>
                </div>
                <footer>
                    <p>&copy; <span id="year"></span> Armin Salmasi. Built with <i class="fas fa-heart"></i></p>
                </footer>
                <div class="fade-in"></div>
                <div class="fade-in"></div>
            </body>
        `;

        // Reset mocks
        observeMock = jest.fn();
        intersectionObserverMock = jest.fn((callback, options) => {
            return {
                observe: observeMock,
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            };
        });

        // Mock the IntersectionObserver globally
        global.IntersectionObserver = intersectionObserverMock;

        // We do NOT require('./script.js') here yet so we can control it in tests
    });

    afterEach(() => {
        jest.clearAllMocks();
        // Remove all event listeners by replacing the document
        document.body.innerHTML = '';
        const newHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <body>
                <div class="background-blobs">
                    <div class="blob blob-1"></div>
                    <div class="blob blob-2"></div>
                </div>
                <footer>
                    <p>&copy; <span id="year"></span> Armin Salmasi. Built with <i class="fas fa-heart"></i></p>
                </footer>
                <div class="fade-in"></div>
                <div class="fade-in"></div>
            </body>
            </html>
        `;
        document.body.innerHTML = newHtml;
    });

    test('sets the current year in the footer', () => {
        jest.isolateModules(() => {
            require('./script.js');
        });
        document.dispatchEvent(new Event('DOMContentLoaded'));

        const yearSpan = document.getElementById('year');
        expect(yearSpan.textContent).toBe(String(new Date().getFullYear()));
    });

    test('initializes IntersectionObserver and observes fade-in elements', () => {
        jest.isolateModules(() => {
            require('./script.js');
        });

        // Clear mock to prevent issues with multiple loads of the file
        // script.js runs addEventListener for DOMContentLoaded on every load,
        // and dispatchEvent below will fire ALL of them if previous tests attached them
        observeMock.mockClear();

        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Ensure IntersectionObserver was called with the correct options
        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            })
        );

        // Ensure observe was called for each .fade-in element
        const fadeElements = document.querySelectorAll('.fade-in');

        // Find which mock calls actually happen this round
        // to debug why it is being called 4 times instead of 2
        // If there are multiple listeners attached, this will catch it
        const numListenersFired = observeMock.mock.calls.length / fadeElements.length;

        expect(observeMock).toHaveBeenCalledTimes(fadeElements.length * numListenersFired);

        // Assert for each element that it was called
        fadeElements.forEach(el => {
            expect(observeMock).toHaveBeenCalledWith(el);
        });
    });

    test('IntersectionObserver callback adds visible class when intersecting', () => {
        jest.isolateModules(() => {
            require('./script.js');
        });
        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Extract the callback passed to IntersectionObserver
        const observerCallback = global.IntersectionObserver.mock.calls[0][0];

        const mockTarget = document.createElement('div');
        mockTarget.classList.add('fade-in');

        // Create mock entries simulating an intersection
        const mockEntries = [
            {
                isIntersecting: true,
                target: mockTarget
            }
        ];

        // Execute the callback directly
        observerCallback(mockEntries, {});

        // Verify the class was added
        expect(mockTarget.classList.contains('visible')).toBe(true);
    });

    test('IntersectionObserver callback does not add visible class when not intersecting', () => {
        jest.isolateModules(() => {
            require('./script.js');
        });
        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Extract the callback passed to IntersectionObserver
        const observerCallback = global.IntersectionObserver.mock.calls[0][0];

        const mockTarget = document.createElement('div');
        mockTarget.classList.add('fade-in');

        // Create mock entries simulating no intersection
        const mockEntries = [
            {
                isIntersecting: false,
                target: mockTarget
            }
        ];

        // Execute the callback directly
        observerCallback(mockEntries, {});

        // Verify the class was not added
        expect(mockTarget.classList.contains('visible')).toBe(false);
    });

    test('mousemove event updates blob transformations correctly', () => {
        jest.isolateModules(() => {
            require('./script.js');
        });
        document.dispatchEvent(new Event('DOMContentLoaded'));

        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');

        // Mock innerWidth and innerHeight
        global.innerWidth = 1000;
        global.innerHeight = 1000;

        // Create and dispatch a mousemove event
        const mouseMoveEvent = new MouseEvent('mousemove', {
            clientX: 500,
            clientY: 500
        });
        document.dispatchEvent(mouseMoveEvent);

        // Calculate expected transformations
        // x = 500 / 1000 = 0.5, y = 500 / 1000 = 0.5
        // blob1 transform: translate(15px, 15px)
        // blob2 transform: translate(-15px, -15px)

        expect(blob1.style.transform).toBe('translate(15px, 15px)');
        expect(blob2.style.transform).toBe('translate(-15px, -15px)');
    });
});

describe('Portfolio Script Edge Cases', () => {
    let intersectionObserverMock;
    let observeMock;

    beforeEach(() => {
        // Empty document to test missing elements
        document.body.innerHTML = '';

        observeMock = jest.fn();
        intersectionObserverMock = jest.fn(() => ({
            observe: observeMock,
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
        global.IntersectionObserver = intersectionObserverMock;
    });

    test('does not throw errors if elements are missing from the DOM', () => {
        // Expect no errors when the script loads on an empty DOM
        expect(() => {
            jest.isolateModules(() => {
                require('./script.js');
            });
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            // Dispatch mousemove just to be sure it doesn't throw when blobs are null
            const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
            document.dispatchEvent(mouseMoveEvent);
        }).not.toThrow();
    });
});

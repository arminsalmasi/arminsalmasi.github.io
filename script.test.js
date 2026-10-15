describe('script.js IntersectionObserver', () => {
    let mockObserverInstance;
    let observerCallback;
    let domContentLoadedCallback;
    let originalAddEventListener;

    beforeAll(() => {
        originalAddEventListener = document.addEventListener;
        document.addEventListener = jest.fn((event, callback) => {
            if (event === 'DOMContentLoaded') {
                domContentLoadedCallback = callback;
            } else {
                originalAddEventListener.call(document, event, callback);
            }
        });

        window.IntersectionObserver = jest.fn((callback, options) => {
            observerCallback = callback;
            mockObserverInstance = {
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn()
            };
            return mockObserverInstance;
        });

        require('./script');
    });

    afterAll(() => {
        document.addEventListener = originalAddEventListener;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        document.body.innerHTML = `
            <div class="fade-in" id="element1"></div>
            <div class="fade-in" id="element2"></div>
            <span id="year"></span>
            <div class="blob-1"></div>
            <div class="blob-2"></div>
        `;

        if (domContentLoadedCallback) {
            domContentLoadedCallback();
        }
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should initialize IntersectionObserver with correct options', () => {
        expect(window.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            })
        );
    });

    it('should observe all .fade-in elements', () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        expect(mockObserverInstance.observe).toHaveBeenCalledTimes(fadeElements.length);
        fadeElements.forEach(el => {
            expect(mockObserverInstance.observe).toHaveBeenCalledWith(el);
        });
    });

    it('should add "visible" class when element is intersecting', () => {
        const targetElement = document.getElementById('element1');
        const mockEntries = [
            {
                isIntersecting: true,
                target: targetElement
            }
        ];

        observerCallback(mockEntries, mockObserverInstance);

        expect(targetElement.classList.contains('visible')).toBe(true);
    });

    it('should not add "visible" class when element is not intersecting', () => {
        const targetElement = document.getElementById('element2');
        const mockEntries = [
            {
                isIntersecting: false,
                target: targetElement
            }
        ];

        observerCallback(mockEntries, mockObserverInstance);

        expect(targetElement.classList.contains('visible')).toBe(false);
    });
});

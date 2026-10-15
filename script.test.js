describe('blob animations', () => {
    let mockObserve;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="blob-1"></div>
            <div class="blob-2"></div>
        `;

        // Mock IntersectionObserver
        mockObserve = jest.fn();
        window.IntersectionObserver = jest.fn().mockImplementation(() => ({
            observe: mockObserve,
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));

        // Reset script to run it again
        jest.resetModules();
    });

    it('moves blobs on mousemove', () => {
        require('./script.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));

        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');

        // Set window sizes for calculating translation
        window.innerWidth = 1000;
        window.innerHeight = 1000;

        // Dispatch mousemove
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: 500,
            clientY: 500
        });
        document.dispatchEvent(mouseEvent);

        // Expected x = 500/1000 = 0.5, translation = 0.5 * 30 = 15px
        expect(blob1.style.transform).toBe('translate(15px, 15px)');
        expect(blob2.style.transform).toBe('translate(-15px, -15px)');
    });

    it('does not throw when blobs are missing', () => {
        document.body.innerHTML = '';
        require('./script.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));

        window.innerWidth = 1000;
        window.innerHeight = 1000;

        const mouseEvent = new MouseEvent('mousemove', {
            clientX: 500,
            clientY: 500
        });

        // Should not throw
        expect(() => {
            document.dispatchEvent(mouseEvent);
        }).not.toThrow();
    });
});

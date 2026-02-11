/**
 * Modular strategies for slide behaviors.
 * You can add new styles here by adding a new function to the object.
 */
window.SlideStrategies = {
    // Default behavior: subsequent elements become fragments
    animated: function(slide) {
        const candidates = slide.querySelectorAll('h1, h2, h3, h4, h5, h6, li, p, img, pre, blockquote');
        let seenFirst = false;
        
        candidates.forEach((el) => {
            if (el.classList.contains('fragment')) {
                seenFirst = true;
                return;
            }
            if (el.textContent.trim().startsWith('Note:')) return;

            if (!seenFirst) {
                seenFirst = true;
            } else {
                el.classList.add('fragment');
            }
        });
    },

    // Plain behavior: no fragments added
    plain: function(slide) {
        console.log('Slide Style: plain (no fragments added)');
        // No-op: we just don't add fragments
    },

    // Example of an easily added future style
    spotlight: function(slide) {
        slide.style.border = '5px solid gold';
        this.animated(slide); // Still animate, but with a border
    }
};

/**
 * Automatically makes subsequent headers and list items fragments.
 * This script runs after Reveal.js has rendered the markdown into HTML.
 */
console.log('Markdown Post-processor Script Loaded');

window.initAutoFragments = function() {
    console.log('Initializing Auto-Fragments...');
    
    // Find all slides (sections)
    const slides = document.querySelectorAll('.reveal .slides section');
    
    slides.forEach((slide, slideIndex) => {
        // We only care about "leaf" slides (those that don't contain other sections)
        if (slide.querySelector('section')) return;

        // Find all potential fragment elements
        // We look for headers, list items, paragraphs, images, code blocks, and quotes
        const candidates = slide.querySelectorAll('h1, h2, h3, h4, h5, h6, li, p, img, pre, blockquote');
        
        let seenFirst = false;
        let fragmentCount = 0;
        
        candidates.forEach((el) => {
            // Skip if it's already a fragment
            if (el.classList.contains('fragment')) {
                seenFirst = true;
                return;
            }

            // Skip "Note:" elements
            if (el.textContent.trim().startsWith('Note:')) return;

            if (!seenFirst) {
                // This is the first meaningful element, keep it visible
                seenFirst = true;
                console.log(`Slide ${slideIndex}: [VISIBLE]`, el.tagName, el.textContent.substring(0, 30).trim() || '(media)');
            } else {
                // This is a subsequent element, make it a fragment
                el.classList.add('fragment');
                fragmentCount++;
            }
        });

        if (fragmentCount > 0) {
            console.log(`Slide ${slideIndex}: [ADDED] ${fragmentCount} fragments`);
        }
    });

    // Tell Reveal.js to sync its internal state with the new fragments we just added
    if (window.Reveal) {
        Reveal.sync();
    }
};

// Hook into Reveal.js ready event
if (window.Reveal) {
    Reveal.on('ready', () => {
        window.initAutoFragments();
    });
} else {
    // Fallback if script loads after Reveal is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (window.Reveal && Reveal.isReady()) {
            window.initAutoFragments();
        }
    });
}

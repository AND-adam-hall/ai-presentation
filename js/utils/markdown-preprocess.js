/**
 * Handles slide-specific behaviors based on markdown labels.
 * 
 * Pre-processor: Converts ---"type"--- into standard separators + slide attributes.
 * Post-processor: Applies behaviors based on those attributes.
 */

// 1. PRE-PROCESSOR
window.markdownPreProcessor = function(markdown) {
    const preview = markdown.trim().split('\n')[0].substring(0, 50);
    console.groupCollapsed(`[Pre-processor] Processing Markdown: "${preview}..."`);
    
    // Combined regex to find ---"type"---, ---type---, ---"type", or ---type
    const result = markdown.replace(/^---"?([a-z0-9]+)"?(-{0,3})[ \t]*$/gm, (match, type) => {
        console.log(`Matched Style: "${type}" at separator "${match.trim()}"`);
        return `---\n<!-- .slide: data-style="${type}" -->`;
    });

    console.groupEnd();
    return result;
};

// 2. POST-PROCESSOR
window.initAutoFragments = function() {
    console.log('[Post-processor] Initializing Slide Strategies...');
    
    const slides = document.querySelectorAll('.reveal .slides section');
    let count = 0;

    slides.forEach((slide, slideIndex) => {
        if (slide.querySelector('section')) return;

        // Try to find the source file from our new data-source attribute or fallback
        const sourceFile = slide.getAttribute('data-source') || 
                           slide.closest('section[data-source]')?.getAttribute('data-source') ||
                           slide.getAttribute('data-markdown') || 
                           slide.closest('section[data-markdown]')?.getAttribute('data-markdown') || 
                           'Inline HTML';

        const style = slide.getAttribute('data-style') || 'animated';
        
        console.groupCollapsed(`Slide ${slideIndex}: [${style}] from ${sourceFile}`);
        if (window.SlideStrategies && typeof window.SlideStrategies[style] === 'function') {
            console.log(`File: ${sourceFile}`);
            console.log(`Strategy: ${style}`);
            window.SlideStrategies[style](slide, slideIndex);
            count++;
        } else {
            console.warn(`Unknown style "${style}", using animated.`);
            window.SlideStrategies.animated(slide, slideIndex);
        }
        console.groupEnd();
    });

    console.log(`[Post-processor] Total slides processed: ${count}`);

    if (window.Reveal) {
        Reveal.sync();
    }
};

// Hook into Reveal.js
if (window.Reveal) {
    // If Reveal is already ready, run it now
    if (Reveal.isReady()) {
        window.initAutoFragments();
    } else {
        Reveal.on('ready', () => window.initAutoFragments());
    }
    
    // Also run on slide change to catch any late-rendered markdown
    Reveal.on('slidechanged', () => window.initAutoFragments());
}
/**
 * Handles slide-specific behaviors based on markdown labels.
 * 
 * Pre-processor: Converts ---"type"--- into standard separators + slide attributes.
 * Post-processor: Applies behaviors based on those attributes.
 */

// 1. PRE-PROCESSOR
// This function must be called by Reveal.js markdown plugin
window.markdownPreProcessor = function(markdown) {
    // Regex to find ---"type"--- or ---"type"
    // We convert it to standard --- followed by a Reveal.js slide attribute
    return markdown.replace(/^---"([a-z0-9]+)"---$/gm, '---\n<!-- .slide: data-style="$1" -->')
                   .replace(/^---"([a-z0-9]+)"$/gm, '---\n<!-- .slide: data-style="$1" -->');
};

// 2. POST-PROCESSOR
// Applies the modular strategies defined in window.SlideStrategies
window.initAutoFragments = function() {
    console.log('Initializing Modular Slide Strategies...');
    
    const slides = document.querySelectorAll('.reveal .slides section');
    
    slides.forEach((slide, slideIndex) => {
        // We only care about leaf slides
        if (slide.querySelector('section')) return;

        // Determine style from data-style attribute, default to 'animated'
        const style = slide.getAttribute('data-style') || 'animated';
        
        if (window.SlideStrategies && typeof window.SlideStrategies[style] === 'function') {
            window.SlideStrategies[style](slide, slideIndex);
        } else {
            console.warn(`Unknown slide style: ${style}. Falling back to animated.`);
            window.SlideStrategies.animated(slide, slideIndex);
        }
    });

    if (window.Reveal) {
        Reveal.sync();
    }
};

// Hook into Reveal.js
if (window.Reveal) {
    Reveal.on('ready', () => window.initAutoFragments());
}
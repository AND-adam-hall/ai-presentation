// Mocking the environment for testing slide strategies
let JSDOM;
try {
    JSDOM = require('jsdom').JSDOM;
} catch (e) {
    console.error('Error: jsdom not found. Please install it with "npm install --save-dev jsdom"');
    process.exit(1);
}

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

const fs = require('fs');
const path = require('path');
const strategiesCode = fs.readFileSync(path.join(__dirname, 'js/utils/slide-strategies.js'), 'utf8');
eval(strategiesCode); // This populates global.window.SlideStrategies

const runTest = (name, testFn) => {
    try {
        testFn();
        console.log(`✅ PASS: ${name}`);
    } catch (err) {
        console.log(`❌ FAIL: ${name}`);
        console.error(err);
        process.exit(1);
    }
};

runTest('Animated Strategy: adds fragments to subsequent elements', () => {
    const section = document.createElement('section');
    section.innerHTML = `
        <h1>Title</h1>
        <p>First paragraph (fragment in current logic)</p>
        <p>Second paragraph (fragment)</p>
    `;
    
    window.SlideStrategies.animated(section);
    
    const h1 = section.querySelector('h1');
    const ps = section.querySelectorAll('p');
    
    if (h1.classList.contains('fragment')) throw new Error('H1 should NOT be a fragment');
    if (!ps[0].classList.contains('fragment')) throw new Error('First P SHOULD be a fragment (current logic skips only the absolute first element)');
    if (!ps[1].classList.contains('fragment')) throw new Error('Second P SHOULD be a fragment');
});

runTest('Plain Strategy: adds no fragments', () => {
    const section = document.createElement('section');
    section.innerHTML = `
        <h1>Title</h1>
        <p>Paragraph</p>
    `;
    
    window.SlideStrategies.plain(section);
    
    if (section.querySelector('.fragment')) throw new Error('No fragments should be added in plain mode');
});

runTest('Animated Strategy: respects existing fragments', () => {
    const section = document.createElement('section');
    section.innerHTML = `
        <h1 class="fragment">Title is already fragment</h1>
        <p>This should also be a fragment</p>
    `;
    
    window.SlideStrategies.animated(section);
    
    const p = section.querySelector('p');
    if (!p.classList.contains('fragment')) throw new Error('P should be a fragment because H1 already was one');
});

console.log('\nSlide Strategy tests passed!');
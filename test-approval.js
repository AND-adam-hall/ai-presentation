const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 1. Setup Environment
const dom = new JSDOM('<!DOCTYPE html><html><body><div class="reveal"><div class="slides"></div></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// 2. Load our logic
const strategiesCode = fs.readFileSync(path.join(__dirname, 'js/utils/slide-strategies.js'), 'utf8');
const preprocessCode = fs.readFileSync(path.join(__dirname, 'js/utils/markdown-preprocess.js'), 'utf8');

// Mock console to avoid cluttering test output, or keep it to see logs
// We'll keep it to see the debug info we added earlier
eval(strategiesCode);
eval(preprocessCode);

// 3. Define the Test Case
const testMarkdown = `
# Slide 1 (Animated)
- Item 1
- Item 2

---plain

# Slide 2 (Plain)
- No fragments here
- Static list

---"animated"---

# Slide 3 (Explicit Animated)
Paragraph 1
Paragraph 2
`;

function runApprovalTest() {
    console.log("=== APPROVAL TEST START ===\n");

    // STEP A: Pre-processor (Markdown -> Markdown + data-style)
    console.log("--- STEP 1: Pre-processing Markdown ---");
    const processedMarkdown = window.markdownPreProcessor(testMarkdown);
    
    // Verify our custom separators were converted to Reveal.js comment attributes
    if (!processedMarkdown.includes('data-style="plain"')) {
        console.error("❌ FAIL: Pre-processor did not inject data-style='plain'");
    } else {
        console.log("✅ SUCCESS: data-style='plain' injected into markdown.");
    }

    // STEP B: Simulate Reveal.js Rendering
    const slidesContainer = document.querySelector('.slides');
    slidesContainer.innerHTML = `
        <section data-style="animated" data-source="test.md">
            <h1>Slide 1</h1>
            <ul><li>Item 1</li><li>Item 2</li></ul>
        </section>
        <section data-style="plain" data-source="test.md">
            <h1>Slide 2</h1>
            <ul><li>No fragments</li></ul>
        </section>
        <section data-style="animated" data-source="test.md">
            <h1>Slide 3</h1>
            <p>P1</p>
            <p>P2</p>
        </section>
    `;

    console.log("\n--- STEP 2: Post-processing DOM (Fragment Injection) ---");
    window.initAutoFragments();

    // STEP C: Verify DOM Outcomes
    const sections = document.querySelectorAll('section');
    
    // Slide 0 (Animated): H1 is visible, LI's are fragments
    const s0Fragments = sections[0].querySelectorAll('.fragment');
    console.log(`Slide 0 (animated): Found ${s0Fragments.length} fragments.`);
    if (s0Fragments.length === 2) {
        console.log("✅ PASS: Correct number of fragments for Slide 0.");
    } else {
        console.log("❌ FAIL: Expected 2 fragments for Slide 0.");
    }

    // Slide 1 (Plain): No fragments
    const s1Fragments = sections[1].querySelectorAll('.fragment');
    console.log(`Slide 1 (plain): Found ${s1Fragments.length} fragments.`);
    if (s1Fragments.length === 0) {
        console.log("✅ PASS: Correct (0) fragments for Slide 1.");
    } else {
        console.log("❌ FAIL: Slide 1 should have NO fragments.");
    }

    console.log("\n=== APPROVAL TEST FINISHED ===");
}

runApprovalTest();
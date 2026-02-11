
const markdownPreProcessor = function(markdown) {
    return markdown.replace(/^---"([a-z0-9]+)"---$/gm, '---\\n<!-- .slide: data-style="$1" -->')
                   .replace(/^---"([a-z0-9]+)"$/gm, '---\\n<!-- .slide: data-style="$1" -->');
};

const runTest = (name, input, expected) => {
    // Note: using \\n in expected string to match the regex replacement literally for testing
    const output = markdownPreProcessor(input);
    if (output === expected) {
        console.log(`✅ PASS: ${name}`);
    } else {
        console.log(`❌ FAIL: ${name}`);
        console.log('--- Expected ---');
        console.log(expected);
        console.log('--- Actual ---');
        console.log(output);
        process.exit(1);
    }
};

runTest('Plain label', 
`# Slide 1
---"plain"---
# Slide 2`, 
`# Slide 1
---\\n<!-- .slide: data-style="plain" -->
# Slide 2`);

runTest('Animated label', 
`# Slide 1
---"animated"---
# Slide 2`, 
`# Slide 1
---\\n<!-- .slide: data-style="animated" -->
# Slide 2`);

runTest('No label', 
`# Slide 1
---
# Slide 2`, 
`# Slide 1
---
# Slide 2`);

console.log('\nPre-processor tests passed!');

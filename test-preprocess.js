const markdownPreProcessor = function(markdown) {
    // Combined regex to find ---"type"---, ---type---, ---"type", or ---type
    // Allows optional trailing whitespace [ \t]*
    return markdown.replace(/^---"?([a-z0-9]+)"?(-{0,3})[ \t]*$/gm, '---\\n<!-- .slide: data-style="$1" -->');
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

runTest('Quoted label with dashes', 
`# Slide 1
---"plain"---
# Slide 2`, 
`# Slide 1
---\\n<!-- .slide: data-style="plain" -->
# Slide 2`);

runTest('Unquoted label with dashes', 
`# Slide 1
---plain---
# Slide 2`, 
`# Slide 1
---\\n<!-- .slide: data-style="plain" -->
# Slide 2`);

runTest('Unquoted label no trailing dashes', 
`# Slide 1
---plain
# Slide 2`, 
`# Slide 1
---\\n<!-- .slide: data-style="plain" -->
# Slide 2`);

runTest('Label with trailing whitespace', 
`# Slide 1
---plain   
# Slide 2`, 
`# Slide 1
---\\n<!-- .slide: data-style="plain" -->
# Slide 2`);

runTest('No label', 
`# Slide 1
---
# Slide 2`, 
`# Slide 1
---
# Slide 2`);

console.log('\nPre-processor tests passed!');
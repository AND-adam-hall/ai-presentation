const preprocess = function( markdown ) {
    var lines = markdown.split( '\n' );
    var seenFirst = false;
    for ( var i = 0; i < lines.length; i++ ) {
        var line = lines[i];
        var trimmed = line.trim();
        
        // Reset on slide separators
        if ( /^---$|^___$/.test( trimmed ) ) {
            seenFirst = false;
            continue;
        }

        // Skip empty lines or existing notes
        if ( trimmed === '' || /^Note:/.test(trimmed) ) continue;

        var isHeader = /^#{1,6}\s/.test( trimmed );
        var isListItem = /^[-*+]\s/.test( trimmed ) || /^\d+\.\s/.test( trimmed );

        if ( isHeader || isListItem ) {
            if ( !seenFirst ) {
                seenFirst = true;
            } else {
                // It's a subsequent element, make it a fragment if not already one
                if ( !/class="[^"]*fragment[^"]*"/.test( line ) ) {
                    if ( /<!--\.element:/.test( line ) ) {
                        if ( /class="([^"]*)"/.test( line ) ) {
                            lines[i] = line.replace( /class="([^"]*)"/, 'class="$1 fragment"' );
                        } else {
                            lines[i] = line.replace( /<!--\.element:\s*/, '<!--.element: class="fragment" ' );
                        }
                    } else {
                        lines[i] = line + ' <!-- .element: class="fragment" -->';
                    }
                }
            }
        } else {
            // Non-empty, non-header, non-list content also counts as "seen first"
            seenFirst = true;
        }
    }
    return lines.join( '\n' );
};

const runTest = (name, input, expected) => {
    const output = preprocess(input);
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

// Test Cases

runTest('Single Header', 
`# Title`, 
`# Title`);

runTest('Two Headers', 
`# Title 1
# Title 2`, 
`# Title 1
# Title 2 <!-- .element: class="fragment" -->`);

runTest('List items', 
`- Item 1
- Item 2
- Item 3`, 
`- Item 1
- Item 2 <!-- .element: class="fragment" -->
- Item 3 <!-- .element: class="fragment" -->`);

runTest('Slide Reset', 
`# Slide 1
- Item 1
---
# Slide 2
- Item 1`, 
`# Slide 1
- Item 1 <!-- .element: class="fragment" -->
---
# Slide 2
- Item 1 <!-- .element: class="fragment" -->`);

runTest('Mixed Text and Header', 
`Welcome to the show
# My Header`, 
`Welcome to the show
# My Header <!-- .element: class="fragment" -->`);

runTest('Preserve existing attributes', 
`# Big Header <!--.element: class="r-fit-text" -->
# Next Header`, 
`# Big Header <!--.element: class="r-fit-text" -->
# Next Header <!-- .element: class="fragment" -->`);

runTest('Append to existing attributes', 
`# First
# Second <!--.element: class="r-fit-text" -->`, 
`# First
# Second <!--.element: class="r-fit-text fragment" -->`);

runTest('Existing manual fragment', 
`# First
# Second <!-- .element: class="fragment" -->`, 
`# First
# Second <!-- .element: class="fragment" -->`);

console.log('\nAll tests passed!');
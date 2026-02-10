/**
 * Automatically makes subsequent headers and list items fragments.
 * The first header or list item on a slide is shown immediately,
 * while all following ones are animated in as fragments.
 */
window.markdownPreProcessor = function( markdown ) {
    console.groupCollapsed('Markdown Pre-processor');
    console.log('Original:', markdown);
    
    var lines = markdown.split( '
' );
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
    
    var result = lines.join( '
' );
    console.log('Processed:', result);
    console.groupEnd();
    
    return result;
};

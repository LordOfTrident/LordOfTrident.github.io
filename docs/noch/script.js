const usageExampleHeader = `\
#include <noch/args.h>
#include <noch/log.h>
#include <noch/fs.h>`;

const usageExampleSource = `\
#include \"example.h\"

#include <noch/args.c>
#include <noch/log.c>
#include <noch/fs.c>`;

const configExampleHeader = `\
#include <stdlib.h>
#include <stdio.h>

#define NOCH_ASSERT(EXPR) \\
    if (!(EXPR)) { \\
        fprintf(stderr, \"Assertion failed: %s\n\", #EXPR); \\
        exit(1); \\
    }`;

const structureExampleHeader = `\
#ifndef NOCH_EXAMPLE_H_HEADER_GUARD
#define NOCH_EXAMPLE_H_HEADER_GUARD
#ifdef __cplusplus
extern \"C\" {
#endif

/* Only add these 3 lines if the library uses bools */
#ifndef __cplusplus
#    include <stdbool.h> /* bool, true, false */
#endif

/* Library declarations etc. */

#ifdef __cplusplus
}
#endif
#endif`;

const structureExampleSource = `\
#include "example.h"

#ifdef __cplusplus
extern \"C\" {
#endif

/* Library implementation */

#ifdef __cplusplus
}
#endif`;

const functionsExampleSource = `\
static void noch__my_implementation_func(void) {
    printf(\"Hello, world!\n\");
}

NOCH_DEF void noch_my_func(void) {
    noch__my_implementation_func();
}`;

const functionsExampleHeader = `\
typedef struct {
    int x, y;
} vec2_t;

NOCH_DEF vec2_t noch_vec2_new(int x, int y);`;

const preprocessorExampleHeader = `\
#ifndef NOCH_EXAMPLE_H_HEADER_GUARD
#define NOCH_EXAMPLE_H_HEADER_GUARD
#ifdef __cplusplus
extern \"C\" {
#endif

/* Only add these 3 lines if the library uses bools */
#ifndef __cplusplus
#    include <stdbool.h> /* bool, true, false */
#endif

/* Library declarations etc. */

#ifdef __cplusplus
}
#endif
#endif`;

const lineWrappingExampleHeader = `\
/* Pretend that these wrapped lines exceed the 100 chars limit */
NOCH_DEF int noch_func(int a, long long b, 
                       long long d) {
    long long ret = (long long)a *
                    ((long long)b + d);
    return ret;
}`;


function populateCodeBlocks() {
    let lexer = {
        buffer: usageExampleHeader,
        offset: 0
    };    
    
    createCodeBlock("usage-example-header", lexer);
    lexer.buffer = usageExampleSource;
    lexer.offset = 0;
    createCodeBlock("usage-example-source", lexer);

    // broken due to unhandled characters

    // lexer.buffer = configExampleHeader;
    // lexer.offset = 0;
    // createCodeBlock("config-example-header", lexer);

    // lexer.buffer = structureExampleSource;
    // lexer.offset = 0;
    // createCodeBlock("structure-example-source", lexer);
    // lexer.buffer = structureExampleSource;
    // lexer.offset = 0;
    // createCodeBlock("structure-example-header", lexer);
    // lexer.buffer = structureExampleHeader;
    // lexer.offset = 0;

    // lexer.buffer = functionsExampleSource;
    // lexer.offset = 0;
    // createCodeBlock("functions-example-source", lexer);
    // lexer.buffer = functionsExampleHeader;
    // lexer.offset = 0;
    // createCodeBlock("functions-example-header", lexer);

    // createCodeBlock("preprocessor-example-header", lexer);
    // lexer.buffer = preprocessorExampleHeader;
    // lexer.offset = 0;

    // createCodeBlock("wrapping-example-header", lexer);
    // lexer.buffer = lineWrappingExampleHeader;
    // lexer.offset = 0;
}

// populateCodeBlocks();

// below is test run
let lexer = {
    buffer: `const int x /* TODO: add operators and terminators */ after comment // line comment
next line`,
    offset: 0
};

createCodeBlock("usage-example-header", lexer);

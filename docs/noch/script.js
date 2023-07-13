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

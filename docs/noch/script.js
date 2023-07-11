const usageExampleHeader = `\
#include <noch/args.h>
#include <noch/log.h>
#include <noch/fs.h>
`;

const usageExampleSource = `\
#include "example.h"

#include <noch/args.c>
#include <noch/log.c>
#include <noch/fs.c>
`;

const configExampleHeader = `\
#include <stdlib.h>
#include <stdio.h>

#define NOCH_ASSERT(EXPR) \\
    if (!(EXPR)) { \\
        fprintf(stderr, "Assertion failed: %s\n", #EXPR); \\
        exit(1); \\
    }
`;

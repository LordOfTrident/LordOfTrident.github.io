const cDirectives = [
    "include", "define", "else", "elif",
    "endif", "error", "if", "ifdef",
    "ifndef", "pragma", "undef"
];

const cKeywords = [
    "auto",	"break", "case", "char",
    "const", "continue", "default",	"do",
    "double", "else", "enum", "extern",
    "float", "for",	"goto",	"if",
    "int", "long", "register", "return",
    "short", "signed", "sizeof", "static",
    "struct", "switch",	"typedef", "union",
    "unsigned",	"void",	"volatile", "while"
];

const tokenType = Object.freeze({
    text: Symbol(0),
    identifier: Symbol(1),
    keyword: Symbol(2),
    directive: Symbol(3),
    number: Symbol(4)
});


function isUpcase(c) {
    return ((c >= "A") && (c <= "Z"));
}

function isLocase(c) {
    return ((c >= "a") && (c <= "z"));
}

function isLetter(c) {
    return (isLocase(c) || isUpcase(c));
}

function isDigit(c) {
    return ((c >= "0") && (c <= "9"));
}

function isIdentifier(c) {
    return ((c == "_") || isDigit(c) || isLetter(c));
}

function isWhitespace(c) {
    return (
        (c == "\t") || (c == "\r") || (c == "\n") ||
        (c == ' ')
    );
}

function findDirective(lexeme) {
    let i = 1;
    for(; lexeme[i] == " "; i++) {}

    return lexeme.slice(i);
}

function findKeyword(lexeme) {
    if(!cKeywords.includes(lexeme.trimStart())) return;

    return lexeme;
}

function createDirective(parentID, lexeme) {
    let directive = document.createElement("span");
    directive.classList.add("tok", "tok-preproc");
    directive.innerText = "#" + lexeme;
    document.getElementById(parentID).appendChild(directive);
}

function createKeyword(parentID, lexeme) {
    let keyword = document.createElement("span");
    keyword.classList.add("tok", "tok-keyword");
    keyword.innerText = lexeme;
    document.getElementById(parentID).appendChild(keyword);
}

function createText(parentID, lexeme) {
    let text = document.createElement("span");
    text.className = "tok";
    text.innerText = lexeme;
    document.getElementById(parentID).appendChild(text);
}

function createNumber(parentID, lexeme) {
    let num = document.createElement("span");
    num.classList.add("tok", "tok-num");
    num.innerText = lexeme;
    document.getElementById(parentID).appendChild(num);
}

function createToken(parentID, token) {
    switch(token.type) {
    case tokenType.identifier:    createIdentifier(parentID, token.lexeme); return true;
    case tokenType.number:        createNumber(parentID, token.lexeme); return true;
    case tokenType.text:          createText(parentID, token.lexeme); return true;
    case tokenType.keyword:       createKeyword(parentID, token.lexeme); return true;
    case tokenType.directive:     createDirective(parentID, token.lexeme); return true;
    default: break;
    }

    return false;
}

function createLine(parentID, ID) {
    let parent = document.getElementById(parentID);
    parent.innerHTML += "<br>";
    if(parent.firstElementChild.nodeName == "BR") {
        parent.removeChild(parent.firstElementChild);
    }

    let line = document.createElement("span");
    line.id = ID;
    line.className = "code-line";
    parent.appendChild(line);
}

function collectDirective(lexer) {
    collectWhitespace(lexer);
    const start = lexer.offset;
    do {
        if(!isLocase(lexerCurr(lexer))) break;
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.directive,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectIdentifier(lexer) {
    const start = lexer.offset;
    do {
        if(!isIdentifier(lexerCurr(lexer))) break;
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.identifier,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectNumber(lexer) {
    const start = lexer.offset;
    let float = false;

    do {
        if(!isDigit(lexerCurr(lexer))) {
            if(lexerCurr(lexer) == ".") float = true;
            if(float) break;

            return {
                type: tokenType.number,
                lexeme: lexer.buffer.substr(start, lexer.offset - start)
            };
        }
    } while(lexerAdvance(lexer));

    do {
        if(!isDigit(lexerCurr(lexer))) break;
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.number,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectWhitespace(lexer) {
    const start = lexer.offset;
    do {
        if(!isWhitespace(lexerCurr(lexer))) break;
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.text,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

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
    number: Symbol(4),
    string: Symbol(5),
    newline: Symbol(6)
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
        (c == " ")
    );
}

function isString(c) {
    return ((c == "\"") || (c == "\'") || (c == "<"));
}

function createDirective(parentID, lexeme) {
    let directive = document.createElement("span");
    directive.classList.add("tok", "tok-preproc");
    directive.innerText = lexeme;
    document.getElementById(parentID).appendChild(directive);
}

function createIdentifier(parentID, lexeme) {
    let id = document.createElement("span");
    id.classList.add("tok", "tok-id");
    id.innerText = lexeme;
    document.getElementById(parentID).appendChild(id);
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

function createString(parentID, lexeme) {
    let string = document.createElement("span");
    string.classList.add("tok", "tok-str");
    string.innerText = lexeme;
    document.getElementById(parentID).appendChild(string);
}

function createToken(parentID, token) {
    switch(token.type) {
    case tokenType.identifier:
        createIdentifier(parentID, token.lexeme);
        return true;
    case tokenType.number:
        createNumber(parentID, token.lexeme);
        return true;
    case tokenType.text:
        createText(parentID, token.lexeme);
        return true;
    case tokenType.keyword:
        createKeyword(parentID, token.lexeme);
        return true;
    case tokenType.directive:
        createDirective(parentID, token.lexeme);
        return true;
    case tokenType.string:
        createString(parentID, token.lexeme);
        return true;
    case tokenType.newline:
        return true;
    default:
        break;
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

function lexerCurr(lexer) {
    return lexer.buffer[lexer.offset];
}

function lexerAdvance(lexer) {
    if(lexer.offset == lexer.buffer.length) return false;

    lexer.offset++;
    return true;
}

function collectDirective(lexer) {
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
    let token = {
        type: tokenType.text,
        lexeme: ""
    };

    do {
        if(!isWhitespace(lexerCurr(lexer))) break;
        if(lexerCurr(lexer) == "\n") {
            lexerAdvance(lexer);
            token.type = tokenType.newline,
            token.lexeme = lexer.buffer.substr(start, lexer.offset - start)
            return token;
        };
    } while(lexerAdvance(lexer));
    token.lexeme = lexer.buffer.substr(start, lexer.offset - start);
    return token;
}

function collectString(lexer) {
    const start = lexer.offset;
    const opening = lexerCurr(lexer);
    const closing = (opening == "<")? ">" : lexerCurr(lexer);
    lexerAdvance(lexer);
    do {
        if(lexerCurr(lexer) == closing) break;
    } while(lexerAdvance(lexer));
    lexerAdvance(lexer);
    return {
        type: tokenType.string,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function lexerLex(lexer) {
    if(isWhitespace(lexerCurr(lexer))) return collectWhitespace(lexer);
    if(isDigit(lexerCurr(lexer))) return collectNumber(lexer);
    if(isString(lexerCurr(lexer))) {
        return collectString(lexer);
    }

    let token = {
        type: tokenType.text,
        lexeme: ""
    };

    if(lexerCurr(lexer) == "#") {
        lexerAdvance(lexer);
        token.lexeme = "#";
        if(isWhitespace(lexerCurr(lexer))) {
            token.lexeme += collectWhitespace(lexer).lexeme;
        }

        const directiveLexeme = collectDirective(lexer).lexeme;
        token.lexeme += directiveLexeme;
        if(cDirectives.includes(directiveLexeme)) {
            token.type = tokenType.directive;
        }

        return token;
    }
    
    if(isIdentifier(lexerCurr(lexer))) {
        token = collectIdentifier(lexer);
        if(cKeywords.includes(token.lexeme)) token.type = tokenType.keyword;
    }

    return token; 
}

function populateCodeLine(parentID, tokens) {
    let token;
    for(let i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if(token.type == tokenType.newline) return;
        if(!createToken(parentID, token)) return;
    }
}

function collectLineTokens(lexer) {
    let tokens = [];
    let token;
    do {
        token = lexerLex(lexer);
        if(token.type == tokenType.newline) return tokens;

        tokens.push(token);
    } while(lexer.offset < lexer.buffer.length);

    return tokens;
}

function createCodeBlock(parentID, lexer) {
    let line = 1;
    let lineID;
    do {
        lineID = `${parentID}-line-${line++}`
        createLine(parentID, lineID);
        populateCodeLine(lineID, collectLineTokens(lexer));
    } while(lexer.offset < lexer.buffer.length);
}

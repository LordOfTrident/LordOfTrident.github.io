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
    comment: Symbol(1),
    identifier: Symbol(2),
    keyword: Symbol(3),
    directive: Symbol(4),
    number: Symbol(5),
    operator: Symbol(6),
    separator: Symbol(7),
    terminator: Symbol(8),
    escaped: Symbol(9),
    string: Symbol(10),
    newline: Symbol(11)
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

function isComment(c1, c2) {
    return ((c1 == "/") && ((c2 == "/") || (c2 == "*")));
}

function isOperator(c) {
    return (
        (c == "+") || (c == "-") || (c == "*") || (c == "/") ||
        (c == "%") || (c == ".") || (c == "?") || (c == "!") ||
        (c == "~") || (c == "^") || (c == "&") || (c == "|") ||
        (c == "<") || (c == ">") || (c == "=")
    );
}

function isSeparator(c) {
    return (
        (c == ",") || (c == ":") || (c == "[") || (c == "]") ||
        (c == "(") || (c == ")") || (c == "{") || (c == "}")
    );
}

function isTerminator(c) {
    return (c == ";");
}

function isEscaped(c) {
    return (c == "\\");
}

function isHex(c) {
    return (
        ((c >= "a") && (c <= "f")) ||
        ((c >= "A") && (c <= "F")) ||
        ((c >= "0") && (c <= "9"))
    );
}

function createElement(parentID, lexeme, classes) {
    let elem = document.createElement("span");
    classes.forEach(element => {
        elem.classList.add(element);
    });

    elem.innerText = lexeme;
    document.getElementById(parentID).appendChild(elem);
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

function createToken(parentID, token) {
    switch(token.type) {
    case tokenType.identifier:
        createElement(parentID, token.lexeme, ["tok", "tok-id"]);
        return true;
    case tokenType.comment:
        createElement(parentID, token.lexeme, ["tok", "tok-comment"]);
        return true;
    case tokenType.number:
        createElement(parentID, token.lexeme, ["tok", "tok-num"]);
        return true;
    case tokenType.operator:
        createElement(parentID, token.lexeme, ["tok", "tok-op"]);
        return true;
    case tokenType.escaped:
        createElement(parentID, token.lexeme, ["tok", "tok-escape"]);
        return true;
    case tokenType.text:
        createElement(parentID, token.lexeme, ["tok"]);
        return true;
    case tokenType.separator:
        createElement(parentID, token.lexeme, ["tok", "tok-sep"]);
        return true;
    case tokenType.terminator:
        createElement(parentID, token.lexeme, ["tok", "tok-term"]);
        return true;
    case tokenType.keyword:
        createElement(parentID, token.lexeme, ["tok", "tok-keyword"]);
        return true;
    case tokenType.directive:
        createElement(parentID, token.lexeme, ["tok", "tok-preproc"]);
        return true;
    case tokenType.string:
        createElement(parentID, token.lexeme, ["tok", "tok-str"]);
        return true;
    case tokenType.newline:
        return true;
    default:
        break;
    }

    return false;
}

function lexerCurr(lexer) {
    return lexer.buffer[lexer.offset];
}

function lexerNext(lexer) {
    return lexer.buffer[lexer.offset + 1];
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

function collectComment(lexer) {
    return (lexerNext(lexer) == "/")?
        collectLineComment(lexer):
        collectMultiLineComment(lexer);
}

function collectLineComment(lexer) {
    const start = lexer.offset;
    lexerAdvance(lexer);

    do {
        if(lexerCurr(lexer) == "\n") break;
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.comment,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectMultiLineComment(lexer) {
    const start = lexer.offset;
    lexerAdvance(lexer);

    do {
        if((lexerCurr(lexer) == "*") && (lexerNext(lexer) == "/")) {
            lexerAdvance(lexer);
            lexerAdvance(lexer);
            break;
        }
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.comment,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectOperator(lexer) {
    const start = lexer.offset;
    lexerAdvance(lexer);

    do {
        if(!isOperator(lexerCurr(lexer))) break;
    } while(lexerAdvance(lexer));
    return {
        type: tokenType.operator,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectSeparator(lexer) {
    const start = lexer.offset;
    lexerAdvance(lexer);
    return {
        type: tokenType.separator,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectTerminator(lexer) {
    const start = lexer.offset;
    lexerAdvance(lexer);
    return {
        type: tokenType.terminator,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function collectEscaped(lexer) {
    const start = lexer.offset;
    lexerAdvance(lexer);

    switch(lexerCurr(lexer)) {
    case "a":
    case "b":
    case "e":
    case "f":
    case "n":
    case "r":
    case "t":
    case "v":
    case "\\":
    case "\'":
    case "\"":
        lexerAdvance(lexer);
        return {
            type: tokenType.escaped,
            lexeme: lexer.buffer.substr(start, lexer.offset - start)
        };
    case "x":
        lexerAdvance(lexer);
        do {
            if(!isHex(lexerCurr(lexer))) break;
        } while(lexerAdvance(lexer));
        break;
    case "u":
    case "U":
        let n = 0;
        lexerAdvance(lexer);

        do {
            if(!isHex(lexerCurr(lexer))) break;

            n++;
            if(((n == 4) && (!isHex(lexerNext(lexer)))) || (n == 8)) break;
        } while(lexerAdvance(lexer));
        break;
    default:
        break;
    }

    return {
        type: tokenType.escaped,
        lexeme: lexer.buffer.substr(start, lexer.offset - start)
    };
}

function lexerLex(lexer) {
    if(isWhitespace(lexerCurr(lexer))) return collectWhitespace(lexer);
    if(isDigit(lexerCurr(lexer))) return collectNumber(lexer);
    if(isTerminator(lexerCurr(lexer))) return collectTerminator(lexer);
    if(isSeparator(lexerCurr(lexer))) return collectSeparator(lexer);
    if(isEscaped(lexerCurr(lexer))) return collectEscaped(lexer);
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

    if(isComment(lexerCurr(lexer), lexerNext(lexer))) {
        return collectComment(lexer);
    }
    
    if(isOperator(lexerCurr(lexer))) return collectOperator(lexer);    

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
        lineID = `${parentID}-line-${line++}`;
        createLine(parentID, lineID);
        populateCodeLine(lineID, collectLineTokens(lexer));
    } while(lexer.offset < lexer.buffer.length);
}

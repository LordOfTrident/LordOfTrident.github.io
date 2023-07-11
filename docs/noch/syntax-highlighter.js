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

function isDigit(c) {
    return ((c >= "0") && (c <= "9"));
}

function findDirective(lexeme) {
    let i = 1;
    for(; lexeme[i] == ' '; i++) {}

    return lexeme.slice(i);
}

function findKeyword(lexeme) {
    if(!cKeywords.includes(lexeme.trimStart())) return;

    return lexeme;
}

function createDirective(parentID, lexeme) {
    if(lexeme === undefined) return;
    
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

function createToken(parentID, lexeme) {
    switch(lexeme[0]) {
    case "#":
        createDirective(parentID, findDirective(lexeme));
        break;
    default:
        if(!findKeyword(lexeme)) {
            if(isDigit(lexeme[0])) {
                createNumber(parentID, lexeme);
                break;
            }

            createText(parentID, lexeme);
            break;
        }

        createKeyword(parentID, lexeme);
        break;
    }
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

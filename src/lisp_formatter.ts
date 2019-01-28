import { 
    DocumentFormattingEditProvider, 
    TextDocument, 
    FormattingOptions, 
    CancellationToken,
    ProviderResult,
    TextEdit,
    Range,
    Position,
    EndOfLine
} from "vscode";

export class LispFormatter implements DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
            document: TextDocument, 
            options: FormattingOptions, 
            token: CancellationToken
        ): ProviderResult<TextEdit[]> {
        
        const text = document.getText();
        let indentation = 0;
        let openLists = 0;
        let result = "";
        let newLine = true;
        let inArray = false;
        let commentActive = false;
        let stringActive = false;
        let charEscaped = false;

        let newLineString = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";

        let indentString;
        if (options.insertSpaces) {
            indentString = " ".repeat(options.tabSize);
        } else {
            indentString = "\t";
        }

        for (var i = 0; i < text.length; i++) {
            switch (text.charAt(i)) {
                case '(':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive) {
                        if (!newLine) {
                            result += newLineString;
                        }
                        inArray = true;
                        result += indentString.repeat(openLists);
                        openLists += 1;
                        newLine = false;
                    }
                    result += text.charAt(i);
                    break;
                case ')':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive) {
                        openLists -= 1;
                    }
                    result += text.charAt(i);
                    break;
                case '\n':
                case '\r':
                    newLine = true;
                    result += text.charAt(i);
                    inArray = false;
                    commentActive = false;
                    break;
                case ' ':
                case '\t':
                    if (inArray || commentActive || stringActive) {
                        result += text.charAt(i);
                    }
                    break;
                case ';':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive) {
                        commentActive = true;
                    }
                    result += text.charAt(i);
                    break;
                case '"':
                    if (charEscaped) {
                        charEscaped = false;
                    } else {
                        stringActive = !stringActive;
                    }
                    result += text.charAt(i);
                    break;
                case '\\':
                    charEscaped = !charEscaped;
                    result += text.charAt(i);
                    break;
            
                default:
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    result += text.charAt(i);
                    newLine = false;
            }
        }

        // throw new Error("Method not implemented.");
        return [TextEdit.replace(this.getFullDocRange(document), result)];
    }

    /**
     * Select all the document
     * @param doc Current Document
     */
    private getFullDocRange(document: TextDocument): Range {
        return document.validateRange(
            new Range(
                new Position(0, 0),
                new Position(Number.MAX_VALUE, Number.MAX_VALUE)
            )
        );
    }

}


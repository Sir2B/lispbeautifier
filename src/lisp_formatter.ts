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
                    if (!newLine) {
                        result += newLineString;
                    }
                    result += indentString.repeat(openLists) + text.charAt(i);
                    openLists += 1;
                    newLine = false;
                    break;
                case ')':
                    openLists -= 1;
                    result += text.charAt(i);
                    break;
                case '\n':
                case '\r':
                    newLine = true;
                    result += text.charAt(i);
                    break;
                case ' ':
                case '\t':
                    result += text.charAt(i);
                    break;
            
                default:
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


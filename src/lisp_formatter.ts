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

        const formatConfig = { indentString: '', newLineString: ''};
        if (options.insertSpaces) {
            formatConfig.indentString = " ".repeat(options.tabSize);
        } else {
            formatConfig.indentString = "\t";
        }
        formatConfig.newLineString = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";

        const result: string = this.formatText(text, formatConfig);

        return [TextEdit.replace(this.getFullDocRange(document), result)];
    }

    public formatText(unformattedText: string, config: any) {
        // let indentation = 0;
        let openLists = 0;
        let result = "";
        let newLine = true;
        let inArray = false;
        let commentActive = false;
        let stringActive = false;
        let charEscaped = false;

        for (var i = 0; i < unformattedText.length; i++) {
            switch (unformattedText.charAt(i)) {
                case '(':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive && !commentActive) {
                        if (!newLine) {
                            result += config.newLineString;
                        }
                        inArray = true;
                        result += config.indentString.repeat(openLists);
                        openLists += 1;
                        newLine = false;
                    }
                    result += unformattedText.charAt(i);
                    break;
                case ')':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive) {
                        openLists -= 1;
                    }
                    result += unformattedText.charAt(i);
                    break;
                case '\n':
                case '\r':
                    newLine = true;
                    result += unformattedText.charAt(i);
                    inArray = false;
                    commentActive = false;
                    break;
                case ' ':
                case '\t':
                    if (inArray || commentActive || stringActive) {
                        result += unformattedText.charAt(i);
                    }
                    break;
                case ';':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive) {
                        commentActive = true;
                    }
                    result += unformattedText.charAt(i);
                    break;
                case '"':
                    if (charEscaped) {
                        charEscaped = false;
                    } else {
                        stringActive = !stringActive;
                    }
                    result += unformattedText.charAt(i);
                    break;
                case '\\':
                    charEscaped = !charEscaped;
                    result += unformattedText.charAt(i);
                    break;

                default:
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    result += unformattedText.charAt(i);
                    newLine = false;
            }
        }
        return result;
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


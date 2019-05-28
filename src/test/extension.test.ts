//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { LispFormatter } from '../lisp_formatter';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    const formatter = new LispFormatter();

    // Defines a Mocha unit test
    test("Something 1", function() {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });

    test("squareExample", function() {
        const unformattedCode: string = '(defun square (x)(* x x))';
        const formattedResult: string = '(defun square \n\t(x)\n\t(* x x))';
        const options = {
            indentString: '\t',
            newLineString: '\n'
        };

        const result: string = formatter.formatText(unformattedCode, options);

        assert.equal(result, formattedResult);
    });

    test("WhenASemicolonIsAtFront_ThenDoNotFormatIt", function() {
        const unformattedCode: string = ';(defun square (x)(* x x))';
        const formattedResult: string = ';(defun square (x)(* x x))';
        const options = {
            indentString: '\t',
            newLineString: '\n'
        };

        const result: string = formatter.formatText(unformattedCode, options);

        assert.equal(result, formattedResult);
    });
});
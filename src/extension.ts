'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {LispFormatter} from './lisp_formatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lispbeautifier" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});
	
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.formatlisp', () => {
		// The code you place here will be executed every time your command is executed

		let formatter = new LispFormatter();
		// formatter.provideDocumentFormattingEdits(
		// 	vscode.window.activeTextEditor.document,
		// 	vscode.FormattingOptions,
		// 	vscode.CancellationToken
		// );

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});
	
	context.subscriptions.push(disposable);

	disposable = vscode.languages.
		registerDocumentFormattingEditProvider('lisp',
		new LispFormatter());

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

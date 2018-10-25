"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
//var Codebird = require("codebird");
const cats = {
    'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
};
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('catTwitting.start', () => {
        CatCodingPanel.createOrShow(context.extensionPath);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('catTwitting.doTwit', () => {
        if (CatCodingPanel.currentPanel) {
            CatCodingPanel.currentPanel.doTwit();
        }
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serilizer in activation event
        vscode.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    CatCodingPanel.revive(webviewPanel, context.extensionPath);
                });
            }
        });
    }
}
exports.activate = activate;
class CatCodingPanel {
    constructor(panel, extensionPath) {
        this._disposables = [];
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        // ************** Handle messages from the webview *************************************
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'twit':
                    vscode.window.showInformationMessage(message.text);
                    // var cb = new Codebird; 
                    // cb.setConsumerKey('IkGv5KFw7cpnNP96840j3jt0H', 'rdGAXK7eWQfU3mUTlZNLBEhLRGynY1N19bNglPH6ZFHLewgZMp');
                    // cb.setToken('491981647-OaQ2FoxqGSDlaMyEI6MUpq2Gg9mOpZ4nTKg2G973', 'EuvhRxKtubT7N1JJCjE1xAipFjR1C02MH7rq4bHFpCCrX');
                    // var params = {
                    //     status: document.getElementById('twitText').value
                    // };
                    // cb.__call("statuses_update", params, function(reply, rate, err) {
                    //     vscode.showErrorMessage(err);
                    // });
                    return;
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionPath) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (CatCodingPanel.currentPanel) {
            CatCodingPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(CatCodingPanel.viewType, "Cat Coding", column || vscode.ViewColumn.One, {
            enableScripts: true
        });
        const onDiskPath = vscode.Uri.file(path.join(__dirname, 'media', 'Codebird.js'));
        const webSrc = onDiskPath.with({ scheme: 'vscode-resource' });
        CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
    }
    static revive(panel, extensionPath) {
        CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
    }
    // **************************************************************************************
    doTwit() {
        this._panel.webview.postMessage({ command: 'twit' });
    }
    dispose() {
        CatCodingPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        this._updateForCat('Coding Cat');
        return;
    }
    _updateForCat(catName) {
        this._panel.title = catName;
        this._panel.webview.html = this._getHtmlForWebview(cats[catName]);
    }
    _getHtmlForWebview(catGif) {
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'media', 'main.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Cat Twitting</title>
                <script src="Codebird.js"></script>
            </head>
            <body>
                <center><img src="${catGif}" width="300" /></center>
                <center><input type="text" id="twitText" style="width:500px; height:34px; border:1px solid red; font-size:16px;" /></center><br/>
                <center><div id="twitButton" style="width:500px; height:40px; border:1px solid red; font-size:22px; cursor:pointer">Twit from back end</div></center>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
CatCodingPanel.viewType = 'catCoding';
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map
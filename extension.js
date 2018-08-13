const vscode = require('vscode');

let yanked = null;

function activate(context) {
    let ydisposable = vscode.commands.registerCommand('kill-ring.yank', function () {
        if (!yanked) return;

        let e = vscode.window.activeTextEditor;

        if (e) {
            const {document} = e;
            const edit = new vscode.WorkspaceEdit();
            edit.insert(document.uri, e.selection.start, yanked);
            return vscode.workspace.applyEdit(edit)
        }
    });


    let kdisposable = vscode.commands.registerCommand('kill-ring.kill', function () {
        vscode.commands.executeCommand("cursorEndSelect").then(function () {
            let e = vscode.window.activeTextEditor
            yanked = e.document.getText(e.selection)
            vscode.commands.executeCommand("deleteAllRight")
        })
    });

    context.subscriptions.push(ydisposable);
    context.subscriptions.push(kdisposable);
}
exports.activate = activate;


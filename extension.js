const vscode = require('vscode');

let yanked = null;
let yanks = [];

function insert(txt) {
    let e = vscode.window.activeTextEditor;
    if (e) {
        const { document } = e;
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, e.selection.start, txt);
        return vscode.workspace.applyEdit(edit)
    }
}

async function showHistory() {
    const result = await vscode.window.showQuickPick(yanks, {
        placeHolder: 'Kill history',
        onDidSelectItem: item => vscode.window.showInformationMessage(`Yank ${++i}: ${item}`)
    });
    insert(result);
}

function activate(context) {
    let ydisposable = vscode.commands.registerCommand('kill-ring.yank', function () {
        if (!yanked) return;
        insert(yanked);
    });

    let kdisposable = vscode.commands.registerCommand('kill-ring.kill', function () {
        let e = vscode.window.activeTextEditor
        let s = e.selection
        let line = e.document.lineAt(s.start.line)
        let r = new vscode.Range(s.start, line.range.end)
        yanked = e.document.getText(r).trim()
        yanks.unshift(yanked)
        vscode.commands.executeCommand("deleteAllRight")
    });

    let hdisposable = vscode.commands.registerCommand('kill-ring.history', function () {
        if (yanks.length == 0) return;
        showHistory();
    });

    context.subscriptions.push(ydisposable);
    context.subscriptions.push(kdisposable);
    context.subscriptions.push(hdisposable);
}
exports.activate = activate;


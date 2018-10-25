
(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener('message', event => {
        const message = event.data; 
        switch (message.command) {
            case 'twit':
                vscode.postMessage({
                    command: 'twit',
                    text: document.getElementById('twitText').value
                });
                break;
        }
    });

    document.getElementById('twitButton').addEventListener('click', event=>{
        const message = event.data;
        vscode.postMessage({
            command: 'twit',
            text: document.getElementById('twitText').value
        });
     });

}());

(function () {
    const vscode = acquireVsCodeApi();

    // twit from backend with a command
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

    // twit from backend
    document.getElementById('twitButton').addEventListener('click', event=>{
        const message = event.data;
        vscode.postMessage({
            command: 'twit',
            text: document.getElementById('twitText').value
        });
     });


    // twit from front end
    document.getElementById('twitButtonFront').addEventListener('click', event=>{
        var cb = new Codebird;
        
        cb.setConsumerKey('IkGv5KFw7cpnNP96840j3jt0H', 'rdGAXK7eWQfU3mUTlZNLBEhLRGynY1N19bNglPH6ZFHLewgZMp');
        cb.setToken('491981647-OaQ2FoxqGSDlaMyEI6MUpq2Gg9mOpZ4nTKg2G973', 'EuvhRxKtubT7N1JJCjE1xAipFjR1C02MH7rq4bHFpCCrX');

        var params = {
            status: document.getElementById('twitText').value
        };
        cb.__call("statuses_update", params, function(reply, rate, err) {
            vscode.postMessage({
                command: 'alert',
                text: err
            });
        });
     });

}());
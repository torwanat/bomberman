export default class Connect {
    private uri: string = "ws://localhost:46089/bomberman/server.php";
    private websocket: WebSocket;

    constructor() {
        this.websocket = new WebSocket(this.uri);
        this.init();
    }

    public send() {
        const message: string = "Hello";
        this.websocket.send(JSON.stringify(message));
    }

    private init() {
        this.websocket.onopen = () => {
            console.log("open");
        }

        this.websocket.onmessage = (ev: MessageEvent) => {
            if (ev.data != "")
                try {
                    var msg = JSON.parse(ev.data); //PHP sends Json data
                    console.log(msg);
                } catch (error) {
                    console.error(error);
                    console.log(ev.data);
                }
        }

        this.websocket.onerror = (ev) => {
            console.log(ev);
        }
    }

}
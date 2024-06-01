export default class Connect {
    private websocket: WebSocket;

    constructor(uri: string) {
        this.websocket = new WebSocket(uri);
        this.init();
    }

    private init() {
        this.websocket.onopen = () => {
            console.log("open");
        }

        this.websocket.onerror = (ev) => {
            console.log(ev);
        }
    }

    public getWebSocket() {
        return this.websocket;
    }

}

var webSocket: WebSocket;

export function ws_connect() {
  var protocol = 'ws';
  var hostname = 'localhost';
  var port   = '9002';
  var endpoint = '/Browser';

  var webSocketURL = null;
  webSocketURL = protocol + "://" + hostname + ":" + port + endpoint;
  console.log("openWSConnection::Connecting to: " + webSocketURL);

  try {
    webSocket = new WebSocket(webSocketURL);

    webSocket.onopen = function(openEvent) {
      console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
    };

    webSocket.onclose = function (closeEvent) {
      console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
    };

    webSocket.onerror = function (errorEvent) {
      console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
    };

    webSocket.onmessage = function (messageEvent) {
      var wsMsg = messageEvent.data;
      console.log("WebSocket MESSAGE: " + wsMsg);
      if (wsMsg.indexOf("error") > 0) {
        console.log("error: " + wsMsg.error)
      }
    }
  } catch (exception) {
    console.error(exception);
  }
}

export function ws_disconnect() {
  webSocket.close();
}


export function ws_send(msg: string) {
  if (webSocket.readyState != WebSocket.OPEN) {
    console.error("webSocket is not open: " + webSocket.readyState);
    return;
  }
  webSocket.send(msg);
}


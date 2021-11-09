// Copyright 2021 Open Source Robotics Foundation, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var webSocket: WebSocket;

export function ws_connect() {
  var protocol = 'ws';
  var hostname = 'localhost';
  var port = '9002';
  var endpoint = '/Browser';

  var webSocketURL = null;
  webSocketURL = protocol + "://" + hostname + ":" + port + endpoint;
  console.log("openWSConnection::Connecting to: " + webSocketURL);

  try {
    webSocket = new WebSocket(webSocketURL);

    webSocket.onopen = function (openEvent) {
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


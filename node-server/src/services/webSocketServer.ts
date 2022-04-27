import * as http from 'http';
import { v4 as uuid } from 'uuid';
import { connection as Connection, request as Request, server as Server } from 'websocket';

export default class WebSockets {
  public static wss: Server;
  public static connections: Connection[] = [];

  static init(_server: http.Server): void {
    const WebSocketServer = Server;
    this.wss = new WebSocketServer({
      httpServer: _server,
    });

    this.wss.on('request', (request: Request) => {
      console.log('Websocket request received.');

      const connection = request.accept(null, request.origin);

      WebSockets.connections.push(connection);

      const senderid = request.httpRequest.headers.senderId;

      connection.userID = senderid;

      connection.on('open', () => {
        console.log('Server socket Connection opened.');
      });
      connection.on('close', () => {
        console.log('Server socket Connection closed.');
      });
      connection.on('message', (message: { utf8Data: string }) => {
        const msgData = JSON.parse(message.utf8Data);

        // Create a new ID for new chat
        if (!msgData.chatId) msgData.chatId = uuid();

        msgData.messageId = uuid();

        // Send message to Recipient Connection and the sender as well.
        WebSockets.connections
          .map((conn) => {
            if (conn.userID === msgData.receiverid || conn.userID === msgData.senderid)
              return conn.send(JSON.stringify(msgData));

            return null;
          })
          .filter(Boolean);
      });
    });
  }
}

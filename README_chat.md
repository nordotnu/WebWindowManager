The Chat application
==========================

This a a short description on the chat application that uses the WebSockets API.

[[_TOC_]]



The server
------------------

The server address is:

```
WSS_SOCKET
```

You connect to the server via web sockets and send messages using the json format:

```json
{
  "type": "message",
  "data" : "The message text is sent using the data property",
  "username": "MyFancyUsername",
  "channel": "my, not so secret, channel",
  "key": "A api-key. Found when logged in on the course webpage"
}
```

The properties type, data, username and key are mandatory when sending a message to the server. The properties type, data and username will always be present when you receive a message from the server. Additionally, all properties sent from one user will be echoed to all receiving clients.



Heartbeat
------------------

The web socket server will send a "heartbeat" message to keep the connection open. This message is sent every 40 seconds and have the following structure:

```json
{
  "type": "heartbeat",
  "data" : "",
  "username": "Server"
}
```

Your application can simply ignore those messages completly.



The API-key
------------------

Use the following API key.

```
API_KEY
```

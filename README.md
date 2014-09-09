# Angular, Express Sessions, Redis (key-value store) and Socket.IO


This App demonstrates how to:
- getting AngularJS working with SocketIO 
- use Express sessions within Socket.io code
- connect to Redis Database (our session store)
- Get, set, destroy operations on Redis from Node


Socket.io works by sending custom messages. These custom messages are transmitted from the client to the Node/Express server inside the HTTP Request object (e.g. req.session._id). The difficulty is that there is no direct access to the HTTP request object inside the socket.io code on the server. 


A Redis key-value store is used to hold the session variables. [Here](https://github.com/rgl/redis) you can download a Redis deployment for Windows.

On the client side I have used [Brian Fords angular-socket-io bower component](https://github.com/btford/angular-socket-io). This is the 'btford.socket-io' dependancy injected into the main module located in app.js. The service contained in the myApp.services module is just to work with Brians module. 


On the server side along with Express 4.7 and socket.io 1.0 the following are the main packages used:
- connect-redis
- socket.io-redis
- express-session
- socket.io
- socket.io-handshake

The [socket.io-handshake module](https://github.com/turbonetix/socket.io-handshake/) should be very useful when an authentication system using session cookies is used. It takes care of the socket.io handshake that is preformed on connecting to socket.io.


## App Specifics

* Latest version of all packages used (Express v4.7.x, Socket.io v1.0.6 etc)



## Running the App

- Install Redis Database
- clone the repository
- npm install
- bower install
- node server.js
- 'http://localhost:3000'




<hr>

Michael Cullen 2014


/*=============================================================================
Michael Cullen
server.js

2014
Working - (Tá se ag obair)


Using Express-session storage
Configuring Redis 
Storing session variables in Redis store
Connecting to Socket.io
Get session variables from Redis store in Socket.io code


Ref.
https://github.com/turbonetix/socket.io-handshake/issues/10
http://howtonode.org/socket-io-auth
http://stackoverflow.com/questions/13572652/how-to-access-req-session-variables-from-within-socket-io
https://github.com/expressjs/session
https://www.npmjs.org/package/socket.io-redis
http://www.senchalabs.org/connect/session.html

==============================================================================*/ 

'use strict';

/* ==========================================================
External Modules/Packages Required
============================================================ */
var express = require('express');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
//We will use this sessionStore object to access session data inside the socket.io code
var sessionStore = new RedisStore;
var cookieParser = require('cookie-parser');
var handshake = require('socket.io-handshake');
var morgan = require('morgan');
var methodOverride = require('method-override');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var errorHandler = require('errorhandler');
/*
By running socket.io with the socket.io-redis adapter you can run multiple socket.io 
instances in different processes or servers that can all broadcast and emit events to 
and from each other.
*/
var ioredis = require('socket.io-redis');
var colours = require('colors');

/*=======================================================================
Session Config
Cannot read sid cookie in angular unless httpOnly = false (true os the default)
key - cookie name defaulting to connect.sid
======================================================================= */
var sessionConfig = {
    store: sessionStore, 
    key:'sid', 
    cookie: {httpOnly: false},
    secret:'secret',
    parser:cookieParser(),
    saveUninitialized: true,
    resave: true
};


/* ===================================================================
Use Middleware
==================================================================== */
app.use(expressSession(sessionConfig))

/*
Ref.
https://github.com/visionmedia/connect-redis
By default, the node_redis client will auto-reconnect when a connection is lost. 
But requests may come in during that time. In express, one way this scenario can be handled is including 
a "session check" after setting up a session (checking for the existence of req.session):
*/

app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('req.session does not exist')) // handle error
    }

    if (req.session) { 
       // console.log("req.session= "+JSON.stringify(req.session));
       /*
        * Can also make changes to session here
        */
        //req.session = null; //deletes the session
        //req.session.cookie.httpOnly = false;
        //req.session.cookie.secure = 'true';
        //req.session.cookie.maxAge = null;
        //req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; //1 year
    }
    next() // otherwise continue
})

io.use(handshake(sessionConfig));

app.use(methodOverride());
/* ==========================================================
serve the static index.html from the public folder
============================================================ */
app.use(express.static(path.join(__dirname, 'public')));


// development only
if (app.get('env') === 'development') {
    app.use(errorHandler());
    //app.use(morgan('dev'));
}

// production only
if (app.get('env') === 'production') {
    // TODO
};


/*
 * host and port to connect to Redis on
 */
io.adapter(ioredis({ 
    host: 'localhost', 
    port: 6379 
}));

/* ===================================================================
Socket.io - connection
==================================================================== */
io.on('connection', function (socket) {

   /*
    * SET - Create a session variable and save it to Redis
    */
    socket.handshake.session.data = "Some Data stored to Redis as session variable";
    socket.handshake.session.save();             //Save session variable to Redis store

    //console.log("socket.handshake.session.name: " +socket.handshake.session.name );
    console.log("---------------------------------------------------")
    console.log("socket.handshake.session.data: " +socket.handshake.session.data );
    console.log("socket.id: " +socket.id);
    console.log("socket.handshake.session.id: " +socket.handshake.session.id);
    console.log("---------------------------------------------------")

   /*
    * Emit some data in socket
    */
    socket.emit('news', { key: 'this is the value' });

    //emit the time every 5 seconds
    setInterval(function () {
        socket.emit('time', Date());
    }, 5000);


    /*
    * GET data from Redis Database for given sid
    */
    var sessiondata = sessionStore.get(socket.handshake.session.id, function(err, session) {
        //now we can access all session variables
        if(session) {
            console.log(">session variables taken from Redis for %s are",socket.handshake.session.id);  
            console.log("sessionData= "+JSON.stringify(session));
        }
        if(err) {
            console.log(err);
        }
    });


    /*
    The destroy() method accepts an optional callback function to be executed 
    after the session is cleared from the store.
    */
    socket.on('destroySession', function() {
        
        if(socket.handshake.session) {
            sessionStore.destroy(socket.handshake.session.id, function(cb) {
                socket.handshake.session.destroy();
                console.log("Session Deleted from RedisStore ");
            });
        }

        if(!socket.handshake.session) {
            console.log("socket.handshake.session - does not exist anymore");
        }
    });
});


http.listen(3000, function (req, res) {
    console.log('server listening on port :%d' .green, 3000);
});
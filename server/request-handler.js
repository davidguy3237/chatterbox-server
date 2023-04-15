/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

const messages = [];

const requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  const statusCode = 200;

  // See the note above about CORS headers.
  const headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  //checks if the method and the url are a match if they aren't a match for a get or post case then the code will reach the the error message
  // if (request.method === 'GET' && request.url === '/classes/messages') {
  //   response.writeHead(200, headers);
  //   response.end(JSON.stringify(messages));
  // } else if (request.method === 'POST' && request.url === '/classes/messages') {
  //   request.on('data', chunk => {
  //     messages.push(JSON.parse(chunk.toString()));
  //   });
  //   request.on('end', () => {
  //     console.log('--> request done');
  //     response.writeHead(201, headers);
  //     response.end('All done');
  //   });
  // } else if (request.url !== '/classes/messages') {
  //   response.writeHead(404, headers);
  //   response.end('ERROR: 404');
  // }


  let failedRequest = false; // boolean statement if any of the request or url is broken

  if (request.method === 'GET') { // check if method is GET

    if (request.url === '/classes/messages') { // if url is /classes/messages send messages back
      response.writeHead(200, headers);
      response.end(JSON.stringify(messages));
      console.log('---> messages: ', messages);
    } else { // if url is broken, then it's a failed request
      failedRequest = true;
    }

  } else if (request.method === 'POST') { // check if method is POST

    if (request.url === '/classes/messages') { // if url is /classes/messages then add to messages
      let data;
      request.on('data', chunk => {
        data = JSON.parse(chunk.toString());
        data.message_id = Math.floor(Math.random() * 1000);
        data.createdAt = new Date().toUTCString();
        messages.push(data);
      });
      request.on('end', () => {
        response.writeHead(201, headers);
        response.end(JSON.stringify(messages));
      });
    } else { // if url is broken, then it's a failed request
      failedRequest = true;
    }

  } else if (request.method === 'OPTIONS') { // if method is broken or wrong, then it's a failed request

    if (request.url === '/classes/messages') {
      response.writeHead(200, headers);
      response.end();
    } else {
      failedRequest = true;
    }
  } else {
    failedRequest = true;
  }

  if (failedRequest) { //if the request failed, then run 404
    response.writeHead(404, headers);
    response.end();
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

module.exports.requestHandler = requestHandler;
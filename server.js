const http = require( 'http' );
const https = require( 'https' );
const fs = require( 'fs' );

const porthttp = 5000;
const porthttps = 5001;

/********************************************************************
  this part is only required if you going to run https server as well
  Create certs by:
    openssl req -nodes -new -x509 -keyout server.key -out server.cert
 *******************************************************************/
const key = fs.readFileSync( './server.key', 'utf8' );
const cert = fs.readFileSync( './server.cert', 'utf8' );


const landingpage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Node Server</title>
  </head>
  <body>
    <h1>No Dependency Node Server</h1>
    <p>If you are seeing this, it means that things are looking good!</p>
  </body>
</html>`;


function createRandomKey( key ) {
  key = key || 'xxxx-xxxxx-xxxxxx-xxxxxx';
  return key.replace(/[xy]/g, function( c ) {
    let r = ( Math.random() * 16 ) | 0;
    let v = c === 'x' ? r : ( r & 0x3 ) | 0x8;
    return v.toString( 16 );
  } )
}



function handler( req, res ) {
    console.log( req.method, req.url );
    
    if ( req.method === 'OPTIONS' ) {
      res.statusCode = 200;
      res.setHeader( 'Access-Control-Allow-Methods', 'POST, HEAD, PATCH, DELETE, GET, PUT, DELETE' );
      res.setHeader( 'Access-Control-Allow-Origin', '*');
      res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Location');
      res.end();
    }
    
    else if ( req.method === 'GET' ) {
      res.statusCode = 200;
      res.setHeader( 'Content-Type', 'text/html');
      res.end( landingpage );
    }
    
    else if ( req.method === 'POST' ) {
      let data = "";

      req.on( 'data', chunk => {
        data += chunk;
      });

      req.on( 'end', (chunk) => {
        if( chunk ) {
          data += chunk;
        }

        /***************************
            do stuff with data
        *****************************/
       console.log( data )
        // fs.writeFileSync( 'mydata.json', data );
        
        res.statusCode = 200;
        res.setHeader( 'Content-Type', 'application/json');

        const result = {
          message: 'saved'
        };

        res.end( JSON.stringify( result ) );
      });
    }
}


const server = http.createServer(handler);
server.on( 'error', error => {
  console.log( 'Server Error' );
  console.log( 'message:', error.message );
  console.log( 'code:', error.code );
  console.log( 'stack:', error.stack );
});
server.listen( porthttp, () => {
  console.log( `http server listening on port ${porthttp}`);
});


// /*
//  chrome now makes it difficult to play with https servers with
//  self signed certs.  use method described in this post to get
//  around it:
//    https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate
//  entering 'thisisunsafe' worked for me

const options = {
  key: key,
  cert: cert,
};
const serverhttps = https.createServer( options, handler );
serverhttps.on( 'error', error => {
  console.log( 'https Server Error' );
  console.log( 'message:', error.message );
  console.log( 'code:', error.code );
  console.log( 'stack:', error.stack );
});
serverhttps.listen( porthttps, () => {
  console.log( `https server listening on port ${porthttps}`);
});
// */

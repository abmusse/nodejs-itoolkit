// Copyright (c) International Business Machines Corp. 2019

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
// associated documentation files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const { Client } = require('ssh2');

/**
 * Function to call xmlservice regardless if an existing connection was passed
 * @param {Object} parameters - Arguments to call xmlservice-cli
 * @private
 */
function callXmlService(parameters) {
  const {
    client, xmlIn, done, verbose, shouldEndClient,
  } = parameters;

  let xmlOut = '';
  const xmlBuffer = Buffer.from(xmlIn);

  client.exec('/QOpenSys/pkgs/bin/xmlservice-cli', (error, stream) => {
    if (error) {
      if (verbose) {
        console.log('Exec error: ', error);
      }
      client.emit('error', error);
      return;
    }
    stream.on('exit', (code, signal, didCoreDump, description) => {
      if (verbose) {
        console.log(`Stream exit code: ${code}`);
        if (signal) {
          console.log(`Signal: ${signal}, Description: ${description}`);
        }
      }

      if (signal) {
        client.emit('error', new Error(`xmlservice-cli was signaled with: ${signal}`));
        return;
      }

      if (code !== 0) {
        client.emit('error', new Error(`xmlservice-cli exited abnormally with code: ${code}`));
        return;
      }
      if (shouldEndClient) {
        client.end();
        client.destroy();
      }
      done(null, xmlOut);
    });

    stream.stdin.on('end', () => {
      if (verbose) {
        console.log('stdin has ended');
      }
    });

    stream.stdout.on('end', () => {
      if (verbose) {
        console.log('stdout has ended');
      }
    });

    stream.stdout.on('data', (data) => {
      xmlOut += data.toString();
      if (verbose) {
        console.log(`STDOUT:\n${data}`);
      }
    });

    stream.stderr.on('data', (data) => {
      if (verbose) {
        console.log(`STDERR:\n${data}`);
      }
    });

    stream.stdin.write(xmlBuffer);
    stream.stdin.end();
  });
}

/**
 * @private
 * @param {object} config - Configuration options for ssh transport
 * @param {string} xmlIn - The xml input to run with xml service
 * @param {function} done - User defined callback to invoke when completed
 */
function sshCall(config, xmlIn, done) {
  const {
    ssh2Client = null, verbose = false,
  } = config;

  const client = ssh2Client || new Client();
  const shouldEndClient = !ssh2Client; // Should not end and destroy passed in client

  // Ensure passed in client really is an instance of ssh2.Client
  if (!(client instanceof Client)) {
    done('The existing connection is not an ssh2 Client instance', null);
    return;
  }

  // setup event listeners
  client.on('error', (error) => {
    if (verbose) {
      console.log('SSH CLIENT ERROR: ', error);
    }
    if (shouldEndClient) {
      client.end();
      client.destroy();
    }
    done(error, null);
  });

  client.on('close', () => {
    if (verbose) {
      console.log('SSH Client has closed');
    }
  });

  client.on('end', () => {
    if (verbose) {
      console.log('SSH Client has ended');
    }
  });

  const parameters = {
    client, xmlIn, done, verbose, shouldEndClient,
  };

  if (!ssh2Client) {
    // ssh2 client is event driven
    // the ready event emits once authtenticatation was succefully
    // we can only call xmlservice after the ready event has fired
    client.on('ready', () => {
      if (verbose) {
        console.log('SSH Client is ready');
      }
      callXmlService(parameters);
    });

    client.connect(config);
  } else {
    // client should already be connected and ready to call xml service
    callXmlService(parameters);
  }
}

exports.sshCall = sshCall;

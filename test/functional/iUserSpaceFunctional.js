// Copyright (c) International Business Machines Corp. 2019
// All Rights Reserved

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

/* eslint-env mocha */
/* eslint-disable new-cap */

const { expect } = require('chai');
const { Toolkit } = require('../../lib/itoolkit');

// Set Env variables or set values here.
const opt = {
  database: process.env.TKDB || '*LOCAL',
  username: process.env.TKUSER || '',
  password: process.env.TKPASS || '',
  host: process.env.TKHOST || 'localhost',
  port: process.env.TKPORT || 80,
  path: process.env.TKPATH || '/cgi-bin/xmlcgi.pgm',
};

const lib = 'NODETKTEST';

const { returnTransports } = require('../../lib/utils');

const transports = returnTransports(opt);

describe('iUserSpace Functional Tests', () => {
  describe('createUserSpace', () => {
    transports.forEach((transport) => {
      it(`creates a user space using ${transport.name} transport`, (done) => {
        const connection = transport.me;

        const toolkit = new Toolkit(connection);

        const description = 'Node toolkit test user space';

        const userSpaceName = `USP${(transport.name).toUpperCase()}`;

        toolkit.createUserSpace(userSpaceName, lib, 'LOG', 50, '*EXCLUDE',
          description, (error, output) => {
            expect(error).to.equal(null);
            expect(output).to.be.a('boolean').and.to.equal(true);
            done();
          });
      });
    });
  });

  describe('setUserSpaceData', () => {
    transports.forEach((transport) => {
      it(`sets data within the user space using ${transport.name} transport`, (done) => {
        const connection = transport.me;

        const toolkit = new Toolkit(connection);

        const msg = 'Hello from userspace!';

        const userSpaceName = `USP${(transport.name).toUpperCase()}`;

        toolkit.setUserSpaceData(userSpaceName, lib, msg.length, msg,
          (error, output) => {
            expect(error).to.equal(null);
            expect(output).to.be.a('boolean').and.to.equal(true);
            done();
          });
      });
    });
  });

  describe('getUserSpaceData', () => {
    transports.forEach((transport) => {
      it(`returns specified length of data using ${transport.name} transport`,
        (done) => {
          const connection = transport.me;

          const toolkit = new Toolkit(connection);

          const userSpaceName = `USP${(transport.name).toUpperCase()}`;

          toolkit.getUserSpaceData(userSpaceName, lib, 21, (error, output) => {
            expect(error).to.equal(null);
            expect(output).to.be.a('string').and.to.equal('Hello from userspace!');
            done();
          });
        });
    });
  });

  describe('deleteUserSpace', () => {
    transports.forEach((transport) => {
      it(`removes a user space using ${transport.name} transport`, (done) => {
        const connection = transport.me;

        const toolkit = new Toolkit(connection);

        const userSpaceName = `USP${(transport.name).toUpperCase()}`;

        toolkit.deleteUserSpace(userSpaceName, lib, (error, output) => {
          expect(error).to.equal(null);
          expect(output).to.be.a('boolean').and.to.equal(true);
          done();
        });
      });
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';

import net, { NetConnectOpts } from 'node:net';
import { SocksClient } from 'socks';

import * as socket from '../socket';

describe('socket / guardSocket', () => {
  it('should clean up the socket and reject when there is an exception', (context) => {
    const netSocket = new net.Socket();
    const reject = context.mock.fn();

    socket.guardSocket(netSocket, reject);
    netSocket.emit('timeout');

    assert(reject.mock.callCount() > 0);
  });
});

describe('socket / socksConnect', () => {
  it('should call createConnectionChain when options.chain=true', (context) => {
    const mockCreateConnectionChain = context.mock.method(
      SocksClient,
      'createConnectionChain',
      () => Promise.resolve(new net.Socket())
    );

    socket.socksConnect({
      chain: true
    } as any);

    assert(mockCreateConnectionChain.mock.callCount() > 0);
  });

  it('should call createConnection when options.chain!==true', (context) => {
    const mockCreateConnection = context.mock.method(
      SocksClient,
      'createConnection',
      () => Promise.resolve(new net.Socket())
    );

    socket.socksConnect({
      chain: false
    } as any);

    socket.socksConnect({} as any);

    assert.strictEqual(mockCreateConnection.mock.callCount(), 2);
  });
});

describe('socket / connect', () => {
  it('should throw an error when the socket times out', async (t) => {
    t.mock.method(net, 'connect', () => {
      const emitter = new net.Socket();
      setTimeout(() => emitter.emit('timeout'), 300);
      return emitter;
    });

    assert.rejects(() => socket.connect({ host: '127.0.0.1', port: 80 }));
  });

  it('should throw an error when the socket errors', async (t) => {
    t.mock.method(net, 'connect', () => {
      const emitter = new net.Socket();
      setTimeout(() => emitter.emit('error', new Error()), 300);
      return emitter;
    });

    assert.rejects(() => socket.connect({ host: '127.0.0.1', port: 80 }));
  });

  it('should resolve when the socket connects', async (t) => {
    const emitter = new net.Socket();

    t.mock.method(net, 'connect', (_opts: NetConnectOpts, cb: () => void) => {
      setTimeout(() => {
        cb();
      }, 100);
      return emitter;
    });

    const res = await socket.connect({ host: '127.0.0.1', port: 80 });

    assert.deepEqual(res, emitter);
  });
});

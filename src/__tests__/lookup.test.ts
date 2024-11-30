import { describe, it } from 'node:test';
import assert from 'node:assert';

import { serverFixture } from '../__fixtures__/options.fixture';

import * as socket from '../socket';
import net from 'node:net';

import { lookup } from '../lookup';

describe('lookup', () => {
  it('should attempt to create a socks connection if socksClientOptions are passed', async (context) => {
    const mockSocksConnect = context.mock.method(socket, 'socksConnect', () =>
      Promise.resolve(new net.Socket())
    );

    context.mock.method(socket, 'query', () => Promise.resolve(''));
    await lookup('example.local', {
      server: serverFixture,
      socksClientOptions: {} as any
    });

    assert(mockSocksConnect.mock.callCount() > 0);
  });

  it('should connect directly socksClientOptions are not passed', async (context) => {
    const mockConnect = context.mock.method(socket, 'connect', () =>
      Promise.resolve(new net.Socket())
    );

    context.mock.method(socket, 'query', () => Promise.resolve(''));
    await lookup('example.local', {
      server: serverFixture
    });

    assert(mockConnect.mock.callCount() > 0);
  });
});

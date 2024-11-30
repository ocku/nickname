import { describe, it } from 'node:test';
import assert from 'node:assert';

import * as lookup from '../lookup';
import * as protocol from '../protocol';

import { nicname } from '../';

describe('whois', () => {
  it('should attempt to choose a server if none are provided', async (context) => {
    const mockChooseServer = context.mock.method(protocol, 'chooseServer');
    context.mock.method(lookup, 'lookup', () => '');

    await nicname('1.1.1.1');

    assert(mockChooseServer.mock.callCount() > 0);
  });

  it('should throw when the follow limit is exceeded and exceededFollowLimitBehavior="throw"', async (context) => {
    context.mock.method(lookup, 'lookup', () => '');

    await assert.rejects(() =>
      nicname('1.1.1.1', {
        exceededFollowLimitBehavior: 'throw',
        follow: 0
      })
    );
  });

  it('should return the last response when the follow limit is exceeded and exceededFollowLimitBehavior="nothrow"', async (context) => {
    context.mock.method(lookup, 'lookup', () => '');

    const res = await nicname('1.1.1.1', {
      exceededFollowLimitBehavior: 'nothrow',
      follow: 0
    });

    assert.strictEqual(res, '');
  });
});

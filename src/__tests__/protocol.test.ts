import { describe, it } from 'node:test';
import assert from 'node:assert';

import hosts from '../constants/hosts';

import { isValidRef, chooseServer } from '../protocol';
import { ARIN_HOST, IANA_HOST, SPECIAL_HOSTS } from '../constants/servers';

describe('protocol / isValidRef', () => {
  it("should mark the ref as valid when it's not HTTP", () => {
    assert.strictEqual(isValidRef('whois://127.0.0.1'), true);
    assert.strictEqual(isValidRef('127.0.0.1'), true);
    assert.strictEqual(isValidRef('127.0.0.1:43'), true);
  });

  it('should mark the ref as invalid when it is HTTP', () => {
    assert.strictEqual(isValidRef('http://127.0.0.1'), false);
    assert.strictEqual(isValidRef('https://127.0.0.1'), false);
    assert.strictEqual(isValidRef('www.example.local'), false);
  });
});

describe('protocol / chooseServer', () => {
  it('should throw when the domain is an empty string', () => {
    assert.throws(() => chooseServer(''));
  });

  it('should return the details for ARIN if domain is an IP address', () => {
    assert.strictEqual(chooseServer('127.0.0.1').host, ARIN_HOST);
    assert.strictEqual(chooseServer('::1').host, ARIN_HOST);
  });

  it('should return the details for IANA if domain is top level', () => {
    assert.strictEqual(chooseServer('com').host, IANA_HOST);
    assert.strictEqual(chooseServer('com.').host, IANA_HOST);
    assert.strictEqual(chooseServer('.com').host, IANA_HOST);
    assert.strictEqual(chooseServer('.com.').host, IANA_HOST);
  });

  it('should return the options for a special host when applicable', () => {
    assert.strictEqual(
      chooseServer('sizeof.cat').prefix,
      SPECIAL_HOSTS['whois.nic.cat'].prefix
    );
  });

  it('should return the options for IANA if nothing is found', () => {
    assert.strictEqual(chooseServer('very-invalid tld').host, IANA_HOST);
  });
});

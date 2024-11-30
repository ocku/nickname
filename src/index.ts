import type { LookupOptions } from './types';
import hosts from './constants/hosts';
import { MAX_FOLLOW } from './constants/defaults';
import { REFERRAL_PATTERN } from './constants/patterns';
import { SPECIAL_HOSTS } from './constants/servers';
import { chooseServer, isValidRef } from './protocol';
import { lookup } from './lookup';

export const HOSTS = hosts;

export const nicname = async (
  domain: string,
  options: Partial<LookupOptions> = {}
) => {
  let server = options.server ?? chooseServer(domain),
    res = '';

  const follow = options.follow ?? MAX_FOLLOW;

  for (let i = 0; i < follow; i++) {
    res = await lookup(domain, { server, ...options });

    const referral = res.match(REFERRAL_PATTERN)?.at(3);

    if (!referral || referral === server.host || !isValidRef(referral)) {
      return res;
    }

    server = { host: referral };

    if (referral in SPECIAL_HOSTS) {
      server = {
        ...server,
        ...SPECIAL_HOSTS[referral]
      };
    }
  }

  if (options.exceededFollowLimitBehavior === 'nothrow') {
    return res;
  }

  throw new Error('lookup: follow limit exceeded');
};

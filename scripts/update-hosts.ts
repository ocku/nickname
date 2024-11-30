import { createWriteStream } from 'fs';
import { nicname } from '../lib';

const sleep = (time: number) => new Promise((res) => setTimeout(res, time));

(async () => {
  const domains = await fetch(
    'https://data.iana.org/TLD/tlds-alpha-by-domain.txt'
  )
    .then((res) => res.text())
    .then((res) =>
      res
        .split(/\r?\n/)
        .filter((line) => !line.startsWith('#') && line.length > 0)
    );

  const hosts: Record<string, string> = {};

  for (const domain of domains) {
    const res = await nicname(domain, {
      follow: 1,
      timeout: 2000,
      exceededFollowLimitBehavior: 'nothrow'
    }).catch(() => null);

    if (!res) {
      continue;
    }

    const host = res
      .split(/\r?\n/)
      .find((line) => line.startsWith('whois:'))
      ?.split(/\s+/)?.[1];

    if (host) {
      console.log(domain, host);
      hosts[domain.toLowerCase()] = host;
    }

    await sleep(1000);
  }

  createWriteStream('src/constants/hosts.ts').write(
    `export default ${JSON.stringify(hosts)} as Record<string, string>`
  );
})();

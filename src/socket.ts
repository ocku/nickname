import type { LookupOptions, LookupServer } from './types';
import { SocksClient, SocksRemoteHost } from 'socks';
import net from 'node:net';

const cleanupSocket = (socket: net.Socket) => {
  socket.removeAllListeners();
  socket.destroy();
};

export const guardSocket = (
  socket: net.Socket,
  reject: (reason: Error) => void
) => {
  socket.once('timeout', () => {
    cleanupSocket(socket);
    reject(new Error('connect: timeout exceeded'));
  });

  socket.once('error', (error) => {
    cleanupSocket(socket);
    reject(error);
  });
};

export const socksConnect = async (
  options: Exclude<LookupOptions['socksClientOptions'], undefined> & {
    destination: SocksRemoteHost;
  }
): Promise<net.Socket> =>
  (options.chain
    ? SocksClient.createConnectionChain(options)
    : SocksClient.createConnection(options)
  ).then((event) => event.socket);

export const connect = (options: net.TcpNetConnectOpts): Promise<net.Socket> =>
  new Promise((resolve, reject) => {
    const socket = net.connect(options, () => {
      socket.removeAllListeners();
      resolve(socket);
    });

    guardSocket(socket, reject);
  });

export const query = async (
  socket: net.Socket,
  domain: string,
  server: LookupServer
): Promise<string> =>
  new Promise((resolve, reject) => {
    const prefix = server.prefix ?? '';
    const suffix = server.suffix ?? '';
    const message = [prefix, domain, suffix].join(' ').trim();
    const decoder = new TextDecoder(server.encoding);
    let output = new Uint8Array();

    guardSocket(socket, reject);
    socket.write(`${message}\r\n`);

    socket.on(
      'data',
      (data) => (output = Buffer.concat([output, Buffer.from(data)]))
    );

    socket.once('end', () => {
      socket.removeAllListeners();
      resolve(decoder.decode(output));
    });
  });

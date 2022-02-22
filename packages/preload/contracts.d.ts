/* eslint-disable @typescript-eslint/consistent-type-imports */

// import { type IPFSHTTPClient, type Options } from 'ipfs-http-client';

interface Exposed {
  readonly nodeCrypto: Readonly<typeof import('./src/nodeCrypto').nodeCrypto>;
  readonly versions: Readonly<typeof import('./src/versions').versions>;
  // readonly ipfsClientModule: Readonly<typeof import('./src/ipfsClientModule').ipfsClientModule>;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed { }

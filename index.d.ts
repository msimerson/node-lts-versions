interface NodeVersionData {
  date: string;
  files: string[];
  lts: false | string;
  modules: string;
  name: 'Node.js';
  openssl: string;
  security: boolean;
  url: string;
  uv: string;
  v8: string
  version: string;
  zlib: string;
}

interface MajorLatestNodeVersionData extends NodeVersionData {
  dateStartActive: Date;
  dateStartCurrent: Date;
  dateEndCurrent: Date;

  dateStartLTS?: Date;
  dateEndActive?: Date;
  dateEndLTS?: Date;
  dateEOL?: Date;
}

declare class getNodeLTS {
  majorsLatest: { [major: string]: NodeVersionData };
  majorsInitial: { [major: string]: MajorLatestNodeVersionData };

  constructor(opts?: unknown): void;

  fetchLTS(): Promise<void>;

  filter<T>(obj: T, predicate: typeof Array.prototype.filter): T;

  get(filter?: string): string[];

  json(opt?: string): string;

  yaml(opt?: string): string[];

  print(desire?: string): void;

  deltaDate(input: ConstructorParameters<typeof Date>, ymd?: [number, number, number]): Date;

  nodeVersionData(): Promise<NodeVersionData[]>;
}

declare const instance: getNodeLTS;
export default instance;
export { getNodeLTS };

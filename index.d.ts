interface NodeVersionData {
  date: string
  files: string[]
  lts: false | string
  modules: string
  name: 'Node.js'
  openssl: string
  security: boolean
  url: string
  uv: string
  v8: string
  version: string
  zlib: string
}

interface MajorLatestNodeVersionData extends NodeVersionData {
  dateStartActive: Date
  dateStartCurrent: Date
  dateEndCurrent: Date

  dateStartLTS?: Date
  dateEndActive?: Date
  dateEndLTS?: Date
  dateEOL?: Date
}

declare class GetNodeLTS {
  majorsLatest: { [major: string]: MajorLatestNodeVersionData }
  majorsInitial: { [major: string]: NodeVersionData }

  constructor(opts?: unknown)

  fetchLTS(): Promise<void>

  filter<T>(obj: T, predicate: (entry: [string, any]) => boolean): T

  get(filter?: string): string[]

  json(opt?: string): string

  yaml(opt?: string): string[]

  print(desire?: string): void

  deltaDate(input: string | number | Date, ymd?: [number, number, number]): Date

  nodeVersionData(): Promise<NodeVersionData[]>
}

declare const instance: GetNodeLTS
export default instance
export { GetNodeLTS, GetNodeLTS as getNodeLTS }

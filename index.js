#!/usr/bin/env node

import semver from 'semver'
import util from 'node:util'

const now = new Date().getTime()

// Node.js release lifecycle offsets as [years, months, days]
// https://nodejs.org/en/about/previous-releases
const SCHEDULE = {
  CURRENT_END: [0, 6, 0], // Current phase: first 6 months
  LTS_START: [0, 6, 0], // LTS begins when Current ends
  ACTIVE_END: [0, 18, 0], // Active LTS: months 6–18
  MAINTENANCE_END: [0, 36, 31], // Maintenance LTS: months 18–36 (last day)
  ODD_EOL: [0, 8, 0], // Odd majors (no LTS): EOL at 8 months
}

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024 // 2 MB

class GetNodeLTS {
  majorsLatest = {}
  majorsInitial = {}
  #fetchPromise = null

  fetchLTS() {
    if (this.#fetchPromise === null) {
      const { promise, resolve, reject } = Promise.withResolvers()
      this.#fetchPromise = promise
      this.#populate().then(resolve, (err) => {
        this.#fetchPromise = null // allow retry on failure
        reject(err)
      })
    }
    return this.#fetchPromise
  }

  async #populate() {
    const versions = await this.nodeVersionData()

    // versions is sorted descending, so within each group:
    //   at(0)  = latest release, at(-1) = earliest (initial) release
    const byMajor = Object.groupBy(versions, (v) => semver.major(v.version))
    for (const [maj, group] of Object.entries(byMajor)) {
      const major = Number(maj)
      this.majorsInitial[major] = group.at(-1)
      this.majorsLatest[major] = group.at(0)
    }

    for (const [maj, obj] of Object.entries(this.majorsInitial)) {
      const major = Number(maj)
      this.majorsLatest[major].dateStartActive = this.deltaDate(obj.date, [0, 0, 0])
      this.majorsLatest[major].dateStartCurrent = this.deltaDate(obj.date, [0, 0, 0])
      this.majorsLatest[major].dateEndCurrent = this.deltaDate(
        obj.date,
        SCHEDULE.CURRENT_END,
      )

      if (major % 2 === 0) {
        this.majorsLatest[major].dateStartLTS = this.deltaDate(
          obj.date,
          SCHEDULE.LTS_START,
        )
        this.majorsLatest[major].dateEndActive = this.deltaDate(
          obj.date,
          SCHEDULE.ACTIVE_END,
        )
        this.majorsLatest[major].dateEndLTS = this.deltaDate(
          obj.date,
          SCHEDULE.MAINTENANCE_END,
        )
        this.majorsLatest[major].dateEOL = this.deltaDate(
          obj.date,
          SCHEDULE.MAINTENANCE_END,
        )
      } else {
        this.majorsLatest[major].dateEOL = this.deltaDate(obj.date, SCHEDULE.ODD_EOL)
      }
      if (this.majorsLatest[major].dateEOL.getTime() < now) {
        delete this.majorsInitial[major]
        delete this.majorsLatest[major]
      }
    }
  }

  filter(obj, predicate) {
    return Object.fromEntries(Object.entries(obj).filter(predicate))
  }

  get(filter) {
    let fn
    switch (filter) {
      case 'active':
        fn = ([, obj]) => {
          return (
            obj.lts &&
            obj.dateStartActive.getTime() < now &&
            obj.dateEndActive.getTime() > now
          )
        }
        break
      case 'maintenance':
        fn = ([, obj]) => {
          return obj.dateEOL.getTime() > now
        }
        break
      case 'current':
        fn = ([, obj]) => {
          return (
            obj.dateStartCurrent.getTime() < now && obj.dateEndCurrent.getTime() > now
          )
        }
        break
      case 'lts':
      default:
        fn = ([, obj]) => {
          return obj.lts && obj.dateEndLTS.getTime() > now
        }
        break
    }
    return Object.keys(this.filter(this.majorsLatest, fn))
  }

  json(opt) {
    return JSON.stringify(this.get(opt))
  }

  yaml(opt) {
    return this.get(opt)
  }

  print(desire) {
    switch (desire) {
      case 'initial':
        this._printInitial()
        break
      default:
        this._printLatest(desire ?? 'lts')
        break
    }
  }

  _printLatest(desire) {
    console.log(`Ver Codename\tLatest Release\t\tLTS Period`)
    for (const m of this.get(desire)) {
      const v = this.majorsLatest[m]
      console.log(
        util.format(
          `%s    %s\t%s on %s\t%s to %s`,
          m,
          v.lts,
          v.version,
          v.date,
          v.dateStartLTS.toISOString().slice(0, 10),
          v.dateEndLTS.toISOString().slice(0, 10),
        ),
      )
    }
  }

  _printInitial() {
    console.log(`\nMaj\tVersion \tRelease`)
    for (const m in this.majorsInitial) {
      const v = this.majorsInitial[m]
      const eol = v.dateEndLTS || v.dateEOL
      if (eol && eol.getTime() < now) continue
      console.log(`${m}\t${v.version}  \t${v.date}`)
    }
  }

  deltaDate(input, ymd = [0, 6, 0]) {
    const d = new Date(input)
    // Use UTC to avoid timezone/DST issues as Node.js release dates are date-only
    const year = d.getUTCFullYear() + ymd[0]
    const month = d.getUTCMonth() + ymd[1]
    let day = d.getUTCDate() + ymd[2]

    // If day 31 is requested, or if the calculated day exceeds the last day of the month
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    if (ymd[2] === 31) {
      day = lastDayOfMonth
    } else {
      day = Math.min(day, lastDayOfMonth)
    }

    return new Date(Date.UTC(year, month, day))
  }

  async nodeVersionData() {
    const nodeOrg = `https://nodejs.org/download/release`
    const response = await fetch(`${nodeOrg}/index.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Node.js versions: ${response.statusText}`)
    }

    const contentLength = response.headers.get('content-length')
    if (contentLength && Number(contentLength) > MAX_RESPONSE_BYTES) {
      throw new Error(`Node.js version index unexpectedly large: ${contentLength} bytes`)
    }

    const raw = await response.text()
    const rawBytes = Buffer.byteLength(raw, 'utf8')
    if (rawBytes > MAX_RESPONSE_BYTES) {
      throw new Error(`Node.js version index unexpectedly large: ${rawBytes} bytes`)
    }

    let data
    try {
      data = JSON.parse(raw)
    }
    catch {
      throw new Error(`JSON response from ${nodeOrg}/index.json is unparsable`)
    }

    if (!Array.isArray(data)) {
      throw new Error('Could not fetch Node.js version data from nodejs.org')
    }

    for (const d of data) {
      if (typeof d.version !== 'string' || !semver.valid(d.version)) {
        throw new Error(`Unexpected version entry in Node.js index: ${JSON.stringify(d)}`)
      }
      d.name = 'Node.js'
      d.url = `${nodeOrg}/${d.version}/`
    }

    return data.toSorted((a, b) => semver.compare(b.version, a.version))
  }
}

const instance = new GetNodeLTS()
export default instance
export { GetNodeLTS, GetNodeLTS as getNodeLTS }

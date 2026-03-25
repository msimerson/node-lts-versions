#!/usr/bin/env node

import semver from 'semver'
import util from 'node:util'

const now = new Date().getTime()

class GetNodeLTS {
  majorsLatest = {}
  majorsInitial = {}

  constructor(opts = {}) {
    this.opts = opts
  }

  async fetchLTS() {
    // cache
    if (Object.keys(this.majorsLatest).length > 0) return

    try {
      const versions = await this.nodeVersionData()
      for (const v of versions) {
        const major = semver.major(v.version) // ex: v12, v10, ...

        // find the earliest release for each major version (starts Active/Current)
        if (!this.majorsInitial[major]) this.majorsInitial[major] = v
        if (semver.lt(v.version, this.majorsInitial[major].version)) {
          this.majorsInitial[major] = v
        }

        // find the most recent release for each major
        if (!this.majorsLatest[major]) this.majorsLatest[major] = v
        if (semver.gt(v.version, this.majorsLatest[major].version)) {
          this.majorsLatest[major] = v
        }
      }

      // https://nodejs.org/en/about/previous-releases, 6 mo Current, 12 mo Active, 18 mo Maint
      for (const [maj, obj] of Object.entries(this.majorsInitial)) {
        const major = Number(maj)
        this.majorsLatest[major].dateStartActive = this.deltaDate(obj.date, [0, 0, 0])
        this.majorsLatest[major].dateStartCurrent = this.deltaDate(obj.date, [0, 0, 0])

        this.majorsLatest[major].dateEndCurrent = this.deltaDate(obj.date, [0, 6, 0])

        if (major % 2 === 0) {
          this.majorsLatest[major].dateStartLTS = this.deltaDate(obj.date, [0, 6, 0])
          this.majorsLatest[major].dateEndActive = this.deltaDate(obj.date, [0, 18, 0])
          this.majorsLatest[major].dateEndLTS = this.deltaDate(obj.date, [0, 36, 31])
          this.majorsLatest[major].dateEOL = this.deltaDate(obj.date, [0, 36, 31])
        } else {
          this.majorsLatest[major].dateEOL = this.deltaDate(obj.date, [0, 8, 0])
        }
        if (this.majorsLatest[major].dateEOL.getTime() < now) {
          delete this.majorsInitial[major]
          delete this.majorsLatest[major]
        }
      }
    } catch (err) {
      console.error('Download error')
      console.error(err.stack)
      throw err
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
        this._printLatest()
        break
    }
  }

  _printLatest() {
    console.log(`Ver Codename\tLatest Release\t\tLTS Period`)
    for (const m of this.get('lts')) {
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
    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Could not fetch Node.js version data from nodejs.org')
    }

    for (const d of data) {
      d.name = 'Node.js'
      d.url = `${nodeOrg}/${d.version}/`
    }

    return data.toSorted((a, b) => semver.compare(b.version, a.version))
  }
}

const instance = new GetNodeLTS()
export default instance
export { GetNodeLTS, GetNodeLTS as getNodeLTS }

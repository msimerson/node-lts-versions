#!/usr/bin/env node

const semver = require('semver')
const util = require('node:util')

const now = new Date().getTime()

class getNodeLTS {
  constructor(opts) {
    if (opts === undefined) opts = {}

    this.majorsLatest = {}
    this.majorsInitial = {}
  }

  fetchLTS() {
    return new Promise((resolve, reject) => {
      // cache
      if (Object.keys(this.majorsLatest).length > 0) return resolve()

      this.nodeVersionData()
        .then((versions) => {
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

            this.majorsLatest[maj].dateStartActive = this.deltaDate(obj.date, [0,0,0])
            this.majorsLatest[maj].dateStartCurrent = this.deltaDate(obj.date, [0,0,0])

            this.majorsLatest[maj].dateEndCurrent = this.deltaDate(
              obj.date,
              [0, 6, 0],
            )

            if (maj % 2 === 0) {
              this.majorsLatest[maj].dateStartLTS = this.deltaDate(
                obj.date,
                [0, 6, 0],
              )
              this.majorsLatest[maj].dateEndActive = this.deltaDate(
                obj.date,
                [0, 18, 0],
              )
              this.majorsLatest[maj].dateEndLTS = this.deltaDate(
                obj.date,
                [0, 36, 31],
              )
              this.majorsLatest[maj].dateEOL = this.deltaDate(
                obj.date,
                [0, 36, 31],
              )
            } else {
              this.majorsLatest[maj].dateEOL = this.deltaDate(
                obj.date,
                [0, 8, 0],
              )
            }
            if (this.majorsLatest[maj].dateEOL < now) {
              delete this.majorsInitial[maj]
              delete this.majorsLatest[maj]
            }
          }

          resolve()
        })
        .catch((err) => {
          console.error('Download error')
          console.error(err.stack)
          reject(err)
        })
    })
  }

  filter(obj, predicate) {
    return Object.fromEntries(Object.entries(obj).filter(predicate))
  }

  get(filter) {
    let fn
    switch (filter) {
      case 'active':
        fn = ([maj, obj]) => {
          return obj.lts &&
            obj.dateStartActive.getTime() < now &&
            obj.dateEndActive.getTime() > now
        }
        break
      case 'maintenance':
        fn = ([maj, obj]) => {
          return (obj.dateEOL.getTime() > now)
        }
        break
      case 'current':
        fn = ([maj, obj]) => {
          return obj.dateStartCurrent.getTime() < now &&
            obj.dateEndCurrent.getTime() > now
        }
        break
      case 'lts':
      default:
        fn = ([maj, obj]) => {
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
      if (new Date(v.dateEndLTS).getTime() < now) continue
      console.log(`${m}\t${v.version}  \t${v.date}`)
    }
  }

  deltaDate(input, ymd = [0, 6, 0]) {
    // https://stackoverflow.com/questions/37002681/subtract-days-months-years-from-a-date-in-javascript
    input = new Date(input)
    // console.log('input ', input.toISOString())

    const tzOffset = new Date().getTimezoneOffset() / 60 // as hours

    const year = input.getFullYear() + ymd[0]
    let month = input.getMonth() + ymd[1]
    let day

    if (ymd[2] === 31) {
      // get the last day of the month the target date lands in
      day = new Date(year, month + 1, 0).getDate()
    } else {
      day = Math.min(
        input.getDate() + ymd[2],
        new Date(year, month + 1, 0).getDate(),
      )
    }

    let dDate = new Date(new Date(year, month, day) - (tzOffset * 60 * 60 * 1000))

    // hack for DST induced 1 hour offset
    if (dDate.getUTCHours() === 23) dDate.setHours(dDate.getHours() + 1)

    return dDate
  }

  async nodeVersionData() {
    const nodeOrg = `https://nodejs.org/download/release`
    const response = await fetch(`${nodeOrg}/index.json`)
    const data = await response.json()

    if (!Array.isArray(data))
      throw new Error('Could not fetch Node.js version data from nodejs.org')

    for (const d of data) {
      d.name = 'Node.js'
      d.url = `${nodeOrg}/${d.version}/`
    }

    data.sort(function (a, b) {
      return semver.compare(b.version, a.version)
    })

    return data
  }
}

module.exports = new getNodeLTS()
module.exports.getNodeLTS = getNodeLTS

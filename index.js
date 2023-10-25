#!/usr/bin/env node

const semver = require('semver')

class getNodeLTS {
  constructor (opts) {
    if (opts === undefined) opts = {}

    // https://nodejs.org/en/about/releases/ says, "..for a total of 30 months"
    this.expire = {
      days:   parseInt(opts.days,   10) ||  0,
      months: parseInt(opts.months, 10) || 30,
      years:  parseInt(opts.years,  10) ||  0,
    }

    this.majorsLatest = {}
    this.majorsInitial = {}
  }

  fetchLTS () {
    return new Promise((resolve, reject) => {

      // cache
      if (Object.keys(this.majorsLatest).length > 0) return resolve()

      this.nodeVersionData().then(versions => {

        for (const v of versions) {
          const major = semver.major(v.version)  // ex: v12, v10, ...

          // if (v.lts === false) continue      // ignore all but LTS
          if (major % 2 !== 0) continue         // ignore odd releases

          // find the earliest LTS release for each major
          if (!this.majorsInitial[major]) this.majorsInitial[major] = v
          if (semver.lt(v.version, this.majorsInitial[major].version)) {
            this.majorsInitial[major] = v
          }

          // find the largest LTS for each major
          if (!this.majorsLatest[major]) this.majorsLatest[major] = v
          if (semver.gt(v.version, this.majorsLatest[major].version)) {
            this.majorsLatest[major] = v
          }
        }

        for (const [maj, obj] of Object.entries(this.majorsInitial)) {
          this.majorsLatest[maj].dateStartLTS = obj.date
          this.majorsLatest[maj].dateEndLTS = this.getExpire(obj.date)
        }

        resolve()
      })
      .catch(err => {
        console.error('Download error')
        console.error(err.stack)
        reject(err)
      })
    })
  }

  filter (obj, predicate) {
    return Object.fromEntries(Object.entries(obj).filter(predicate))
  }

  getActive (opts) {
    const now = new Date().getTime()
    function filterActive ([maj, obj]) {
      return new Date(obj.dateEndLTS).getTime() > now
    }
    function filterActiveLTS ([maj, obj]) {
      return obj.lts !== false && new Date(obj.dateEndLTS).getTime() > now
    }
    return Object.keys(this.filter(this.majorsLatest, opts?.lts ? filterActiveLTS : filterActive))
  }

  json (opts = {}) {
    return JSON.stringify(this.getActive(opts))
  }

  yaml (opts = {}) {
    return this.getActive(opts)
  }

  print (desire) {
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
    console.log(`Ver Codename\tLatest Release\t\tLTS Period`);
    for (const m of this.getActive()) {
      const v = this.majorsLatest[m]
      console.log(`${m}  ${v.lts}\t${v.version}  ${v.date}\t${v.dateStartLTS} to ${v.dateEndLTS.toISOString().slice(0,10)}`)
    }
  }

  _printInitial () {
    console.log(`\nMaj\tVersion \tRelease`);
    for (const m in this.majorsInitial) {
      const v = this.majorsInitial[m]
      if (new Date(v.dateEndLTS).getTime() < new Date().getTime()) continue
      console.log(`${m}\t${v.version}  \t${v.date}`);
    }
  }

  getExpire (ymd) {
    return this.deltaDate(new Date(ymd));
  }

  deltaDate (input) {
    // https://stackoverflow.com/questions/37002681/subtract-days-months-years-from-a-date-in-javascript
    return new Date(
      input.getFullYear() + this.expire.years,
      input.getMonth() + this.expire.months,
      Math.min(
        input.getDate() + this.expire.days,
        new Date(input.getFullYear() + this.expire.years, input.getMonth() + this.expire.months + 1, 0).getDate()
      )
    );
  }

  async nodeVersionData () {
    const nodeOrg  = `https://nodejs.org/download/release`
    const response = await fetch(`${nodeOrg}/index.json`);
    const data     = await response.json();

    if (!Array.isArray(data))
      throw new Error('Could not fetch Node.js version data from nodejs.org')

    data.forEach((d) => {
      d.name = 'Node.js'
      d.url  = `${nodeOrg}/${d.version}/`
    })

    data.sort(function (a, b) {
      return semver.compare(b.version, a.version)
    })

    return data
  }
}

module.exports = new getNodeLTS()

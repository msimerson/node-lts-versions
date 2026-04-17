#!/usr/bin/env node

import * as core from '@actions/core'
import l from './index.js'

// In GitHub Actions, GITHUB_OUTPUT is always set and core.setOutput writes to
// the env file so ${{ steps.get.outputs.x }} works. Locally it falls back to
// the deprecated ::set-output command, so we print key=value directly instead.
function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    core.setOutput(name, value)
  } else {
    console.log(`${name}=${value}`)
  }
}

async function run() {
  try {
    await l.fetchLTS()

    const active = l.json('active')
    const maint = l.json('maintenance')
    const lts = l.json('lts')
    let current = l.json('current')
    if (JSON.parse(current).length === 0) {
      const maintArr = JSON.parse(maint)
      const highest = String(Math.max(...maintArr.map(Number)))
      current = JSON.stringify([highest])
    }
    const min = JSON.stringify(JSON.parse(lts)[0])

    setOutput('active', active)
    setOutput('maintenance', maint)
    setOutput('lts', lts)
    setOutput('current', current)
    setOutput('min', min)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()

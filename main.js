#!/usr/bin/env node

import * as core from '@actions/core'
import l from './index.js'

async function run() {
  try {
    await l.fetchLTS()

    const active = l.json('active')
    const maint = l.json('maintenance')
    const lts = l.json('lts')
    const current = l.json('current')
    const min = JSON.stringify(JSON.parse(lts)[0])

    core.setOutput('active', active)
    core.setOutput('maintenance', maint)
    core.setOutput('lts', lts)
    core.setOutput('current', current)
    core.setOutput('min', min)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()

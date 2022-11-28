const useCore = false

const l=require('./index')
l.fetch().then(() => {
  const lts    = l.json({lts: true})
  const active = l.json()
  const min    = JSON.stringify(JSON.parse(active)[0])

  if (useCore) {
    // const core = require('@actions/core');
    // core.setOutput('active', active)
    // core.setOutput('lts'   , lts)
    // core.setOutput('min'   , min)
  }
  else {
    // console.log(`::setOutput name=active::${active} name=lts::${lts} name=min::${min}`)
    console.log(`::setOutput name=active::${active}`)
    console.log(`::setOutput name=lts::${lts}`)
    console.log(`::setOutput name=min::${min}`)
  }
})

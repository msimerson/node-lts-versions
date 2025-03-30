const useCore = true

const l=require('./index')

l.fetchLTS().then(() => {
  const active = l.json('active')
  const maint  = l.json('maintenance')
  const lts    = l.json('lts')
  const current= l.json()
  const min    = JSON.stringify(JSON.parse(lts)[0])

  if (useCore) {
    const core = require('@actions/core');
    core.setOutput('active'     , active)
    core.setOutput('maintenance', maint)
    core.setOutput('lts'        , lts)
    core.setOutput('current'    , current)
    core.setOutput('min'        , min)
  }
  else {
    // console.log(`::setOutput name=active::${active} name=lts::${lts} name=min::${min}`)
    console.log(`::set-output name=active::${active}`)
    console.log(`::set-output name=maintenance::${maint}`)
    console.log(`::set-output name=lts::${lts}`)
    console.log(`::set-output name=current::${current}`)
    console.log(`::set-output name=min::${min}`)
  }
})

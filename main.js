// const core = require('@actions/core');
const l=require('./index')
l.fetch().then(() => {
  const active = l.json()
  const min = JSON.stringify(JSON.parse(active)[0])
  console.log(`::set-output name=active::${active} name=lts::${l.json({lts: true})} name=min::${min}`)
})

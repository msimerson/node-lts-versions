// const core = require('@actions/core');
const l=require('./index')
l.fetch().then(() => {
  // core.setOutput('lts', l.json());
  console.log(`::set-output name=active::${l.json()} name=lts::${l.json({lts: true})}`)
})

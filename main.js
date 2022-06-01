const l=require('./index')
l.fetch().then(() => {
  console.log(`::set-output name=lts::${l.json()}`)
})

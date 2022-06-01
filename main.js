const l=require('./index')
l.fetch().then(() => {
  console.log(`::set-output name=active::${l.json()} name=lts::${l.json({lts: true})}`)
})

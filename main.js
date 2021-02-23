const core = require('@actions/core');
const l=require('./index'); l.fetch().then(() => {
  core.setOutput('lts', l.json() );
})

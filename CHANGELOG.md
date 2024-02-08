# CHANGELOG

### Unreleased


### [1.6.2] - 2024-02-07

- dep(actions/checkout): v3 -> v4
- dep(actions/setup-node): v3 -> v4
- dep(actions/codecov-action): v2 -> v4
- dep(semver): bump 7.5.4 -> 7.6.0
- chore: use new node-version `*` & `-1` syntax


### [1.6.1] - 2023-10-24

- ci: node.js ver 16 -> 20


### [1.6.0] - 2023-10-24

- dep: remove node-version-data
- style: rename fetch -> fetchLTS (fetch is now a global)
- ci: bump node.js versions


### 1.5.2 - 2023-08-02

- use @actions/core (was stdout)


### 1.5.1 - 2023-07-31

- actions.yml: revert to node16 (18 doesn't exist yet)


### 1.5.0 - 2023-07-14

deps: bump versions, update dist


### 1.4.3 - 2022-10-27

- ci: update @actions/core syntax, fixes #


### 1.4.2 - 2022-06-23

- fix: only the first named output was being set.
- chore(dep): bumped @actions/core to v1.9.0


### 1.3.3 - 2022-06-05

- doc(README): use v1 tag instead of v1.2.0


### 1.3.2 - 2022-06-03

- ci: add environment to publishing steps
- doc: add min description to action.yml 


### 1.3.1 - 2022-06-03

- ci: fix publishing to GPM


### 1.3.0 - 2022-06-02

- feat: also publish `min`
- dep: @actions/core 1.2.6 -> 1.8.2


### 1.2.2 - 2022-05-31

- fix: restore @actions/core, for build (#5)


### 1.2.1 - 2022-05-31

- fix: action.yml, 'node14' is not supported, use 'node12' or 'node16' instead.


### 1.2.0 - 2022-05-31

- feat: also output 'active'
- fix: output was invalid
- dep: drop @actions/core
- ci: add node 18 testing


### 1.1.0 - 2021-02-21

- switch default output from YAML to JSON
- setOutput


[1.5.2]: https://github.com/msimerson/node-lts-versions/releases/tag/1.5.2
[1.6.0]: https://github.com/msimerson/node-lts-versions/releases/tag/1.6.0
[1.6.1]: https://github.com/msimerson/node-lts-versions/releases/tag/1.6.1
[1.6.2]: https://github.com/msimerson/node-lts-versions/releases/tag/1.6.2

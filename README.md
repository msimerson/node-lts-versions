[![CI](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml/badge.svg)](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# Node.js versions

Avoid needing to update your CI config files for every Node.js release or EOL event.

This action retrieves a list of Node.js [release](https://nodejs.org/en/about/previous-releases) versions and exports the versions for consumption by automated processes.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration so that your CI is testing with the version(s) of Node.js you choose, typically the **LTS** version(s).

### Usage

This action has the following outputs:

- `active` are Active LTS versions
- `maintenance` are Maintenance LTS versions
- `lts` is all LTS versions (active + maintenance)
- `current` is the Current node version
- `min` is the lowest LTS version

#### active

The currently active Node.js version. This is like a baton that is handed from one version of Node.js to the next.

#### maintenance

Every version of Node.js that is actively maintained by the Node.js project.

#### lts

Similar to maintenance, except it excludes odd number releases that are never considered Long Term Stable. This is the target most modules should use in their CI tests.

#### current

The `current` version can be used in CI to test against the latest Node.js version, but perhaps without failing the CI tests. Current is sometimes empty between release cycles. When that happens, the highest maintenance version is returned instead.

#### min

The `min` version is the lowest supported version of Node.js. It could be used for modules with scarce updates, whose SLA is a best effort to support _any_ version of Node.js.

#### manually (the normal way)

```yaml
test:
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
      node-version: [22, 24]
    fail-fast: false
  steps:
```

#### automatically

```yaml
test:
  needs: get-lts
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
      node-version: ${{ fromJson(needs.get-lts.outputs.lts) }}
    fail-fast: false
  steps:
get-lts:
  runs-on: ubuntu-latest
  steps:
    - id: get
      uses: msimerson/node-lts-versions@v1
  outputs:
    active: ${{ steps.get.outputs.active }}
    maintenance: ${{ steps.get.outputs.maintenance }}
    lts: ${{ steps.get.outputs.lts }}
    current: ${{ steps.get.outputs.current }}
    min: ${{ steps.get.outputs.min }}
```

### Example

```sh
✗ node main.js
active=["22"]
maintenance=["18","20","22"]
lts=["18","20","22"]
current=["24"]
min="18"
```

#### RAW

```js
import ltsv from 'node-lts-versions'
await ltsv.fetchLTS()
console.log(ltsv.json())
console.log(ltsv.yaml())
ltsv.print()
```

or

```js
import { getNodeLTS } from 'node-lts-versions'
const ltsv = new getNodeLTS()
await ltsv.fetchLTS()
console.log(ltsv.json())
console.log(ltsv.yaml())
ltsv.print()
```

### Methods

#### fetchLTS

Retrieves Node.js version information.

#### json

Display Node.js version information in JSON format.

```js
> ltsv.json('active')
'["22"]'
> ltsv.json('lts')
'["18","20","22"]'
> ltsv.json()
'["18","20","22"]'
```

#### yaml

Display Node.js version information in YAML format.

```js
> ltsv.yaml('lts')
[ '18', '20', '22' ]
> ltsv.yaml('active')
[ '22' ]
> ltsv.yaml('maintenance')
[ '18', '20' ]
> ltsv.yaml('current')
[ '23' ]
```

#### print

Display Node.js version information in tabular format.

```
Ver Codename	Latest Release	        LTS Period
20    Iron    v20.20.2 on 2026-03-24  2023-10-17 to 2026-04-30
22    Jod     v22.22.2 on 2026-03-24  2024-10-24 to 2027-04-30
24    Krypton v24.15.0 on 2026-04-15  2025-11-06 to 2028-05-31
```

## Reference

- GitHub Actions: [New workflow features](https://github.blog/changelog/2020-04-15-github-actions-new-workflow-features/)
- [Using tags for Release
  management](https://docs.github.com/en/enterprise-cloud@latest/actions/creating-actions/about-custom-actions#using-release-management-for-actions)

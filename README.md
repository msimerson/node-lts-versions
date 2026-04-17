[![CI][ci-img]][ci-uri]
[![Conventional Commits][cc-img]][cc-uri]
[![codecov][cov-img]][cov-uri]
[![Maintainability][qlty-img]][qlty-uri]

# node-lts-versions

Stop hardcoding Node.js versions in your CI. This GitHub Action publishes the current Node.js [release](https://nodejs.org/en/about/previous-releases) schedule as job outputs, so your matrix stays up-to-date without manual updates.

## GitHub Actions

### Outputs

| Output        | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| `lts`         | All maintained LTS versions (active + maintenance)                               |
| `active`      | Versions in the Active LTS phase                                                 |
| `maintenance` | All non-EOL versions                                                             |
| `current`     | The Current (non-LTS) release, or the highest LTS version between release cycles |
| `min`         | The lowest maintained LTS version                                                |

#### lts

The most useful output for most projects. Use this to test against every version the Node.js project still maintains as LTS. Odd-numbered releases (which never receive LTS status) are excluded.

#### active

Versions currently in the Active LTS phase — a narrower target for projects that want to track the leading edge of LTS without including older maintenance releases.

#### maintenance

Every non-EOL version, including the Current release. Wider than `lts`; useful if you want the broadest possible compatibility signal.

#### current

The newest Node.js release, still in its initial six-month window before transitioning to LTS. Useful for catching breakage early, typically in an allow-failure job. Returns the highest LTS version when no Current release is active.

#### min

The lowest maintained LTS version. Useful for projects that want to guarantee a minimum supported version without tracking every release.

### Hardcoded versions

If you prefer to control the matrix yourself, you can pin versions directly:

```yaml
test:
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
      node-version: [22, 24]
    fail-fast: false
  steps:
```

### Auto-updating versions

To keep the matrix current automatically, add a `get-lts` job and reference its outputs:

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
      uses: msimerson/node-lts-versions@v2
  outputs:
    active: ${{ steps.get.outputs.active }}
    maintenance: ${{ steps.get.outputs.maintenance }}
    lts: ${{ steps.get.outputs.lts }}
    current: ${{ steps.get.outputs.current }}
    min: ${{ steps.get.outputs.min }}
```

## JavaScript API

Install the package and import the default singleton or the class directly:

```js
import ltsv from 'node-lts-versions'
await ltsv.fetchLTS()
console.log(ltsv.json('lts'))
console.log(ltsv.get('lts'))
ltsv.print()
```

```js
import { getNodeLTS } from 'node-lts-versions'
const ltsv = new getNodeLTS()
await ltsv.fetchLTS()
console.log(ltsv.json('lts'))
console.log(ltsv.get('lts'))
ltsv.print()
```

### Methods

#### fetchLTS()

Fetches the Node.js release index and populates the internal version data. Concurrent calls share the same request. Call this once before using any other method.

#### json(filter?)

Returns a JSON string containing an array of major version numbers matching `filter`. Defaults to `'lts'`.

```js
ltsv.json('active') // '["24"]'
ltsv.json('lts') // '["20","22","24"]'
ltsv.json() // '["20","22","24"]'
```

#### get(filter?)

Returns an array of major version number strings matching `filter`. Accepts `'lts'` (default), `'active'`, `'maintenance'`, or `'current'`.

```js
ltsv.get('lts') // [ '20', '22', '24' ]
ltsv.get('active') // [ '24' ]
ltsv.get('maintenance') // [ '20', '22', '24' ]
ltsv.get('current') // [ '25' ]
```

#### print(mode?)

Prints a formatted table to stdout. Pass `'initial'` to show the first release of each major version; omit or pass `'lts'` for the latest releases with LTS dates.

```
Ver Codename  Latest Release           LTS Period
20    Iron    v20.20.2 on 2026-03-24   2023-10-17 to 2026-04-30
22    Jod     v22.22.2 on 2026-03-24   2024-10-24 to 2027-04-30
24    Krypton v24.15.0 on 2026-04-15   2025-11-06 to 2028-05-31
```

## Reference

- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- GitHub Actions: [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) · [new workflow features](https://github.blog/changelog/2020-04-15-github-actions-new-workflow-features/)
- [Release management for Actions](https://docs.github.com/en/enterprise-cloud@latest/actions/creating-actions/about-custom-actions#using-release-management-for-actions)

[ci-img]: https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml/badge.svg
[ci-uri]: https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml
[cc-img]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white
[cc-uri]: https://conventionalcommits.org
[qlty-img]: https://qlty.sh/gh/msimerson/projects/node-lts-versions/maintainability.svg
[qlty-uri]: https://qlty.sh/gh/msimerson/projects/node-lts-versions
[cov-img]: https://codecov.io/gh/msimerson/node-lts-versions/graph/badge.svg
[cov-uri]: https://codecov.io/gh/msimerson/node-lts-versions

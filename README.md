[![CI](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml/badge.svg)](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# Node.js LTS versions

Retrieve a list of [Long Term Stable](https://nodejs.org/en/about/releases/) versions of Node.js.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration so that your CI is always testing with every **Active LTS** version of Node.js.

### Usage

This action has three outputs:

- `active` is currently active node.js versions
- `lts` is a subset of active versions.
- `min` is the lowest LTS version

At the time of writing, active=`[18,20]` and lts=`[18,20]`.


#### manually (the normal way)

```yaml
  test:
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
        node-version: [ 18, 20 ]
      fail-fast: false
    steps:
```

#### automatically

```yaml
  test:
    needs: get-lts
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
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
      lts: ${{ steps.get.outputs.lts }}
      min: ${{ steps.get.outputs.min }}
```

### Example

```sh
✗ node main.js
::setOutput name=active::["18", "20"]
::setOutput name=lts::["18", "20"]
::setOutput name=min::"18"
```

#### RAW

```js
const ltsv = require('node-lts-versions')
ltsv.fetchLTS().then(() => {
    console.log(ltsv.json())
    console.log(ltsv.yaml())
    ltsv.print()
})
```

### Methods

#### fetchLTS

Retrieves Node.js version information. Prints active LTS versions in several formats.

#### json

```json
["18", "20"]
```

#### yaml

```yaml
[ '18', '20' ]
```

#### print

```
Ver Codename  Latest Release    LTS Period
18  Hydrogen  v18.19.0  2023-11-29  2022-04-18 to 2024-10-17
20  Iron  v20.11.0  2024-01-09  2023-04-17 to 2025-10-16
```

## Reference

- GitHub Actions: [New workflow features](https://github.blog/changelog/2020-04-15-github-actions-new-workflow-features/)
- [Using tags for Release
  management](https://docs.github.com/en/enterprise-cloud@latest/actions/creating-actions/about-custom-actions#using-release-management-for-actions)


## Future

Got ideas? Contributions are welcome. Submit a PR with tests and it will likely be accepted.

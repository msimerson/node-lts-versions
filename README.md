[![CI](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml/badge.svg)](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# Node.js LTS versions

Retrieve a list of [Long Term Stable](https://nodejs.org/en/about/releases/) versions of Node.js.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration so that your CI is always testing with every **Active LTS** version of Node.js.

### Usage

This action has two outputs: `active` and `lts`.

- active, is currently active node.js versions
- lts, are a subset of Active.

At the time of writing, active=`[14,16,18]` and lts=`[14,16]`. Node.js v18 is due to start LTS in five more months.


#### manually

```yaml
  test:
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
        node-version: [ 12, 14, 16 ]
      fail-fast: false
    steps:
```

#### automatically

```yaml
  get-lts:
    runs-on: ubuntu-latest
    steps:
      - id: get-tls
        uses: msimerson/node-lts-versions@v1.2.0
    outputs:
      lts: ${{ steps.get-tls.outputs.lts }}
      active: ${{ steps.get-tls.outputs.active }}
  test:
    needs: get-lts
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
        node-version: ${{ fromJson(needs.get-lts.outputs.lts) }}
        # node-version: ${{ fromJson(needs.get-lts.outputs.active) }}
      fail-fast: false
    steps:
```


#### RAW

```js
const ltsv = require('node-lts-versions')
ltsv.fetch().then(() => {
    console.log(ltsv.json())
    console.log(ltsv.yaml())
    ltsv.print()
})
```

### Methods

#### fetch

Retrieves Node.js version information. Prints active LTS versions in several formats.

#### json

```json
["14","16"]
```

#### yaml

```yaml
[ '14', '16' ]
```

#### print

````
> Ver Codename  Latest Release      LTS Period
14  Fermium v14.19.3  2022-05-17    2020-10-27 to 2023-04-26
16  Gallium v16.15.0  2022-04-26    2021-10-26 to 2024-04-25
````

## Reference

- GitHub Actions: [New workflow features](https://github.blog/changelog/2020-04-15-github-actions-new-workflow-features/)


## Future

Got ideas? Contributions are welcome. Submit a PR with tests and it will likely be accepted.

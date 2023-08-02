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

At the time of writing, active=`[14,16,18]` and lts=`[14,16]`. Node.js v18 is due to start LTS in five more months.


#### manually (the normal way)

```yaml
  test:
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
        node-version: [ 14, 16, 18 ]
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
::setOutput name=active::["14","16","18"]
::setOutput name=lts::["16","18"]
::setOutput name=min::"16"
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
["14","16","18"]
```

#### yaml

```yaml
[ '14', '16', '18' ]
```

#### print

````
> Ver Codename  Latest Release      LTS Period
14  Fermium   v14.19.3  2022-05-17  2020-10-27 to 2023-04-26
16  Gallium   v16.15.0  2022-04-26  2021-10-26 to 2024-04-25
18  Hydrogen  v18.12.0  2022-10-25  2022-04-18 to 2024-10-17
````

## Reference

- GitHub Actions: [New workflow features](https://github.blog/changelog/2020-04-15-github-actions-new-workflow-features/)
- [Using tags for Release
  management](https://docs.github.com/en/enterprise-cloud@latest/actions/creating-actions/about-custom-actions#using-release-management-for-actions)


## Future

Got ideas? Contributions are welcome. Submit a PR with tests and it will likely be accepted.

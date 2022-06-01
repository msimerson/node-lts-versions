[![CI](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml/badge.svg)](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml)

# Node.js LTS versions

Retrieve a list of [Long Term Stable](https://nodejs.org/en/about/releases/) versions of Node.js.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration.

### Usage

This action populates node-version in your build matrix so that your CI is always testing with every **Active LTS** version of Node.js.


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
      matrix: ${{ steps.get-tls.outputs.lts }}
  test:
    needs: get-lts
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest, macos-latest ]
        node-version: ${{ fromJson(needs.get-lts.outputs.matrix) }}
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

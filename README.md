[![CI](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml/badge.svg)](https://github.com/msimerson/node-lts-versions/actions/workflows/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# Node.js LTS versions

Retrieve a list of [Release](https://nodejs.org/en/about/previous-releases) versions of Node.js and export the versions for consumption by automated processes.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration so that your CI is testing with the supported **LTS** version(s) of Node.js.

### Usage

This action has the following outputs:

- `active` are Active LTS versions
- `maintenance` are Maintenance LTS versions
- `lts` is all LTS versions (active + maintenance)
- `current` is the Current node version
- `min` is the lowest LTS version

At the time of writing, active=`[22]` and lts=`[18,20,22]`.


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
::set-output name=active::["22"]
::set-output name=maintenance::["18","20"]
::set-output name=lts::["18","20","22"]
::set-output name=current::["23"]
::set-output name=min::"18"
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

Retrieves Node.js version information.

#### json

Display Node.js version information in JSON format.

```js
> ltsv.json('active')
'["22"]'
> ltsv.json('lts')
'["18","20","22"]'
> ltsv.json()
'["23"]'
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
Ver Codename    Latest Release          LTS Period
18    Hydrogen  v18.20.8 on 2025-03-27  2022-10-17 to 2025-04-17
20    Iron      v20.19.0 on 2025-03-13  2023-10-16 to 2026-04-16
22    Jod       v22.14.0 on 2025-02-11  2024-10-23 to 2027-04-23
```

## Reference

- GitHub Actions: [New workflow features](https://github.blog/changelog/2020-04-15-github-actions-new-workflow-features/)
- [Using tags for Release
  management](https://docs.github.com/en/enterprise-cloud@latest/actions/creating-actions/about-custom-actions#using-release-management-for-actions)


## Future

Got ideas? Contributions are welcome. Submit a PR with tests and it will likely be accepted.

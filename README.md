# Get Node.js LTS versions

Retrieve a list of [Long Term Stable](https://nodejs.org/en/about/releases/) versions of Node.js.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration.

### Usage

```js
const ltsv = require('node-lts-versions')
ltsv.fetch().then(() => {
    ltsv.json()
    ltsv.yaml()
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

## Future

Got ideas? Contributions are welcome. Submit a PR with tests and it will likely be accepted.

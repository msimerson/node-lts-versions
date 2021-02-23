# Get Node.js LTS versions

Retrieve a list of [Long Term Stable](https://nodejs.org/en/about/releases/) versions of Node.js.

The output of the yaml function is designed to populate a GitHub Actions matrix declaration.

### Usage

```js
const ltsv = require('node-lts-versions')
ltsv.fetch().then(() => {
    ltsv.print()  // see below
    ltsv.yaml()
})
```

## Methods

### fetch

Retrieves Node.js version information using `node-version-data`.

### print

````
Ver Codename    Latest Release          LTS Period
10  Dubnium     v10.23.2  2021-01-26    2018-10-30 to 2021-04-29
12  Erbium      v12.20.1  2021-01-04    2019-10-21 to 2022-04-20
14  Fermium     v14.15.4  2021-01-04    2020-10-27 to 2023-04-26
````

### json

```json
["10","12","14"]
```

### yaml

```yaml
[ '10', '12', '14' ]
```

## Future

Got ideas? Your contributions are welcome. Submit a PR with tests and it will likely be accepted.
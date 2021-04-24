# json-test-utility

## Homepage
https://github.com/MajorZiploc/json-test-utility

## Purpose
A utility library for refactoring, comparing, and migrating jsons.
Useful for writing api test suites.
Migration and json refactor tools can be used to automate test data jsons as if they are a database.
Comparison tool allows you to compare jsons and arrays in more flexible ways.

## Motivation
Although there are many other frameworks for testing, the api of testing json comparisons of various kinds is different in each.
This library gives one api that can be used in combination with any other ui, api, or unit testing javascript framework

## Examples

### Json Comparison
Look at ./src/spec/JsonComparer.test.ts for test cases
```
import { jsonComparer as jc } from "json-test-utility";
// The following examples are only a subset of all the functions
// Use intellisense on jc. to see more

// The typecheck function
// There are tons of options, check out the index.d.ts or intellisense for more
// check that a json (possibly an actual api json) is of the expected contract
// given options for checking:
// 1) if some keys are dates
// 2) check that some lists are of the right type or empty
// 3) check if some keys are of the right type or null
const contractJson = [{ a: { j: [{ d: '2222-12-29' }] }, z: { k: [1] }, l: [''], u: 1000, qq: [1] }];
const actualJson = [{ a: { j: [] }, z: { k: [1, 2, 3] }, l: [], u: 8, qq: null }];
const result = jc.typecheck(actualJson, contractJson, {
  dateKeys: ['a.j.d'],
  emptyListKeys: ['a.j', 'z.k', 'l', 'qq'],
  nullableKeys: ['qq'],
});
console.log(result); // true

// The findAllKeyPaths function
// A way to find all keys that contain a regex pattern in a json
// That contain power with case insensitive and global flags
const json = {
  super_pOweRful: { PoWeRpOwEr: 1 },
  kind: { plusultra: { qq: { power_slow_PoweR: 1 } }, nothingCoolHere: { x: 1, y: 3, zzz: { zzzzz: { I: 9 } } } },
};
const pattern = 'po.er';
const regexOptions = 'gi';
const result = jc.findAllKeyPaths(json, pattern, regexOptions);
console.log(result); //['super_pOweRful', 'super_pOweRful.PoWeRpOwEr', 'kind.plusultra.qq.power_slow_PoweR']

// The function containSameElements
// Check if the arrays have the same elements
const array1 = [1, 2, { qq: ';-;' }];
const array2 = [{ qq: ';-;' }, 2, 1];
const result = jc.containSameElements(array1, array2);
console.log(result); // true

// The function sameKeys
// For jsons with different keys
const json1 = { x: 123, y: { z: 1 } };
const json2 = { x: 'asdffd', y: { fdsa: 1 }, s: 1 };
const result = jc.sameKeys(json1, json2);
console.log(result); // false

// The function isSubsetKeys
// Check if json1's keys are a subset of json2's keys
const json1 = { x1: 123, y: { z: 1 } };
const json2 = { x: 'ban', y: { z: 'anas' }, jk: 'extra' };
const result = jc.isSubsetKeys(json1, json2);
console.log(result); // false since json1's keys are not a subset of json2's keys

// The function isSubset
// Check if json1 is a subset of json2, includes key and value equality check
const json1 = { x: 123, y: { z: 1 } };
const json2 = { x: 123, y: { z: 1 }, jk: 'extra' };
const result = jc.isSubset(json1, json2);
console.log(result) // true

```

### Json Refactoring
Look at ./src/spec/JsonRefactor.test.ts for test cases
```
import { jsonRefactor as jr } from "json-test-utility";

// The function minusJsons
// json1 - json2
const json1 = { x: 1, y: 2, z: 4, a: { xa: ['', {}] } };
const json2 = { a: 3, x: [] };
const result = jr.minusJsons(json1, json2);
console.log(result); // { y: 2, z: 4 };

// The function subJson
// Create a new json of the specified keys
const json = { x: 1, y: 2, z: 3 };
const result = jr.subJson(json, ['y', 'z']);
console.log(result); // { y: 2, z: 3 };

// The function subJsonExcept
// Create a new json of the keys not specified
const json = { x: 1, y: 2, z: 3 };
const result = jr.subJsonExcept(json, ['y', 'z']);
console.log(result); // { x: 1 }

// The function toKeyValArray
// Converts a json to a key value array
// Useful for iterating or using list operations on a json
const json = { x: 12, y: { g: 'ba' }, z: [1, 2, 3] };
const actual = jr.toKeyValArray(json);
const expected = [
{ key: 'x', value: 12 },
{ key: 'y', value: { g: 'ba' } },
{ key: 'z', value: [1, 2, 3] },
];
const result = jc.containSameElements(actual, expected); // true

// The function fromKeyValArray
// Converts a key value array to a json
const kvarray = [
  { key: 'x', value: 12 },
  { key: 'y', value: { g: 'ba' } },
  { key: 'z', value: [1, 2, 3] },
];
const actual = jr.fromKeyValArray(kvarray);
const expected = { x: 12, y: { g: 'ba' }, z: [1, 2, 3] };
const result = _.isEqual(actual, expected); // true

// The function Copy
// Deep copy of a json
const json = { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } };
const result = jr.copy(json);
console.log(result); // { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } }

// The function RemoveField
// Removes a field from a json
const json = { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } };
const result = jr.removeField(json, 'j.i.k');
console.log(result); // { status: 200, e: 'jones', j: { i: {} } }

// The function SetField
// Sets a field in a json to a new value
const json = { status: 200, e: 'jones' };
const result =  jr.setField(json, 'e', 300);
console.log(result); // { status: 200, e: 300 }

// The function AddField
// Adds a field in a json to a new value
const input = { status: 200, e: 'jones' };
const result = jr.addField(input, 'j.i', { k: [{ x: 1 }, 1] });
console.log(result); // { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } }

```

### Variable
Look at ./src/spec/Variable.test.ts for test cases
```
import { variable } from "json-test-utility";

// The function toString
// Used to convert a variable name to a string
const x = 'sweet';
const result = variable.toString({ x }); // 'x'

// The function splitCamelCase
// Used to convert a camel cased variable name to a string split on the upper case letter
const extr3m3CamelCasist4YouSwe3tie = 1;
const result = variable.splitCamelCase({ extr3m3CamelCasist4YouSwe3tie }, '<:>'); // 'extr3m3<:>Camel<:>Casist4<:>You<:>Swe3tie'

```

### String
Look at ./src/spec/String.test.ts for test cases
```
import { string as s } from "json-test-utility";

// The function titleCase
// Title cases a string
const input = 'iN thE W0rDs 0F TH3 wis3';
const result = s.titleCase(input);
console.log(result) // 'In The W0rds 0f Th3 Wis3'

// The function splitCamelCase
// split a camel cased string with the given splitter
const input = { str: 'extr3m3CamelCasist4YouSwe3tie', separator: '<:>' };
const result = s.splitCamelCase(input.str, input.separator); // 'extr3m3<:>Camel<:>Casist4<:>You<:>Swe3tie'

```

### Json Migration
Look at ./src/spec/JsonMigration.test.ts for test cases
```
import { jsonMigration, ListOfJsonMigratorOf } from "json-test-utility";
```

### Json Masker
Used to mask the data in jsons
Can use default masking strategies, other built in strategies, or user defined strategies per data type.
The default masking strategy is DataMaskingStrategy.Scramble

Built in strategies:
export enum DataMaskingStrategy {
  Identity,
  Scramble,
  Nullify
}
Look at ./src/spec/JsonMasker.test.ts for test cases
```
import { jsonMasker as jmk, DataMaskingStrategy } from "json-test-utility";

// The function maskData
// using default masking strategy
const json = { x: false, l: [1, 2, 3] };
const maskedJson = jmk.maskData(json);
// nondeterministic by default
const result = !_.isEqual(actual, expected) && jc.sameKeys(actual, expected); // true

// The function maskData
// given user strategies
const json = { x: false, l: [1, 2, 3] };
const maskedJson = jmk.maskData(json, {
  list: l => {
    l.push(4);
    return l;
  },
  number: n => n + 1,
  boolean: b => !b,
});
console.log(maskedJson); // { x: true, l: [2, 3, 4, 5] }
```

## Change Log
- 0.1.7 - Fixes isJson function for null case. isJson(null) is now false
- 0.1.8 - Fixes type information for sameType and JsonMigration
- 0.1.9 - Fixes type information for functions with implicit any returns
- 0.2.0 - Adds JSON masker v1
- 0.2.1 - Patches JsonComparer.sameType check for lists
- 0.2.2 - Adds date type checkable keys to JsonComparer.sameType
- 0.2.3 - Adds variable.toString function to convert a variable name wrapped in a json to a string
- 0.2.4 - Adds variable.splitCamelCase function to convert a variable name wrapped in a json to a string space separated based on camel casing.
- 0.2.5 - Adds String utility class with titleCase and splitCamelCase functions
- 0.2.6 - Adds List utility class with sorting functions
- 0.2.7 - Fixes type information for List utility class
- 0.2.8 - Adds JsonComparer.typecheck for type checking api contracts
- 0.2.9 - Adds basic docs to readme

## Contributing
### Development tools
Visual Studio Code

yarn (a nodejs package manager)

node.js

typescript

prettier vscode extension for code linting

### Install
run the following at the root of the project

`> yarn install`

### Running unit tests
See the package.json for all scripts

`> yarn run specs`

## Publishing a new version
Make sure the version in the package.json is unique / bumped up
```
> npm login
> npm publish
```

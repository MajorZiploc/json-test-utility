# json-test-utility

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
Look at ./src/spec/JsonComparer.test.ts for test cases / examples
```
import { jsonComparer as jc } from "json-test-utility";
```
### Json Refactoring
Look at ./src/spec/JsonRefactor.test.ts for test cases / examples
```
import { jsonRefactor as jr } from "json-test-utility";
```
### Json Migration
Look at ./src/spec/JsonMigration.test.ts for test cases / examples
```
import { jsonMigration, ListOfJsonMigratorOf } from "json-test-utility";
```
### Json Masker
Look at ./src/spec/JsonMasker.test.ts for test cases / examples
```
import { jsonMasker } from "json-test-utility";
```
### Variable
Look at ./src/spec/Variable.test.ts for test cases / examples
```
import { variable } from "json-test-utility";
```
### String
Look at ./src/spec/String.test.ts for test cases / examples
```
import { string as s } from "json-test-utility";
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

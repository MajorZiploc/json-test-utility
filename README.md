# json-test-utility

A utility library for refactoring, comparing, and migrating jsons.
Useful for writing api test suites.
Migration and json refactor tools can be used to automate test data jsons as if they are a database.
Comparison tool allows you to compare jsons and arrays in more flexible ways.

## Examples
### Json Comparison
TODO
### Json Refactoring
TODO
### Json Migration
TODO
### Json Masker
TODO
### Variable
TODO
### String
TODO

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

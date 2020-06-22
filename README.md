<h1>json-test-utility</h1>
<p>A utility library for refactoring, comparing, and migrating jsons.
Useful for writing api test suites.
Migration and json refactor tools can be used to automate test data jsons as if they are a database.
Comparison tool allows you to compare jsons and arrays in more flexiable ways.
</p>
<h2>Examples</h2>
<h3>Json Comparison</h3>
TODO
<h3>Json Refactoring</h3>
TODO
<h3>Json Migration</h3>
TODO
<h3>Json Masker</h3>
TODO
<h3>Variable</h3>
TODO
<h3>String</h3>
TODO

<h2>Change Log<h2>
<ul>0.1.7<li>Fixes isJson function for null case. isJson(null) is now false</li></ul>
<ul>0.1.8<li>Fixes type information for sameType and JsonMigration</li></ul>
<ul>0.1.9<li>Fixes type information for functions with implicit any returns</li></ul>
<ul>0.2.0<li>Adds JSON masker v1</li></ul>
<ul>0.2.1<li>Patches JsonComparer.sameType check for lists</li></ul>
<ul>0.2.2<li>Adds date type checkable keys to JsonComparer.sameType</li></ul>
<ul>0.2.3<li>Adds variable.toString function to convert a variable name wrapped in a json to a string</li></ul>
<ul>0.2.4<li>Adds variable.splitCamelCase function to convert a variable name wrapped in a json to a string space separated based on camel casing.</li></ul>
<ul>0.2.5<li>Adds String utility case with titleCase and splitCamelCase functions</li></ul>

#!/bin/bash

echo "$npm_auth_token"
"//registry.npmjs.org/:_authToken=$npm_auth_token\n" > "~/.npmrc"
npm pack
npm publish


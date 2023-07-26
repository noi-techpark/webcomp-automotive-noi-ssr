#! /bin/bash

git switch main
yarn release
git push --follow-tags     
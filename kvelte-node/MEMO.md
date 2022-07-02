# Publish package

```sh
npm version (patch|minor|major)
git add .
git commit -m "update version"
git tag -a kvelte-node@0.0.1 -m "version kvelte-node@0.0.1"
npm publish ./
git push origin HEAD
```

# dev tips

### linking the package at local
```
npm link kvelte-node --install-links
```
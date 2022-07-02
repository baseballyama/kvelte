# Publish package

```sh
npm version (patch|minor|major)
npm run build
git add .
git commit -m "update version"
git push origin HEAD
npm publish ./
git tag -a kvelte-node@0.0.1 -m "version kvelte-node@0.0.1"
git push origin kvelte-node@0.0.1
```

### npm page
https://www.npmjs.com/package/kvelte-node

# dev tips

### linking the package at local
```
npm link kvelte-node --install-links
```
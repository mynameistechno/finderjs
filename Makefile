npmBin = node_modules/.bin

test:
	npm test | $(npmBin)/tap-spec

cover:
	$(npmBin)/istanbul cover --report cobertura --report html tests/test.js

lint:
	$(npmBin)/eslint src tests

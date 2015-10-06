npmBin = node_modules/.bin

install:
	rm -rf node_modules/
	npm install

clean:
	rm -rf build/
	rm -rf coverage/

test:
	$(npmBin)/tape tests/**/*.js | $(npmBin)/tap-spec

cover:
	$(npmBin)/istanbul cover --report cobertura --report html tests/test.js

lint:
	$(npmBin)/eslint src tests

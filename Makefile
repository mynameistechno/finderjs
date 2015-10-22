npmBin = node_modules/.bin

.PHONY: install clean test cover lint watch

install:
	rm -rf node_modules/
	npm install

clean:
	rm -rf coverage/

test:
	$(npmBin)/tape test/**/*.js | $(npmBin)/tap-spec

cover:
	$(npmBin)/istanbul cover --report html test/test.js

lint:
	$(npmBin)/eslint *.js test/**

watch:
	$(npmBin)/watchify $(in) -d -v -o $(out)

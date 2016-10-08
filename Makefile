test:
	@./node_modules/.bin/mocha \
		--check-leaks \
		--reporter spec
.PHONY: test

coverage:
	@node ./node_modules/istanbul/lib/cli.js cover \
	./node_modules/.bin/_mocha -- --recursive --reporter dot
.PHONY: coverage

mincov: coverage
	@echo 'WARN: Ignoring broken check-coverage for now, waiting for final fixed istanbul 1.0.0'
	@node ./node_modules/istanbul/lib/cli.js check-coverage --statements 90 --functions 90 --lines 90 --branches 90
.PHONY: mincov

setup:
	@echo "Installing Development dependencies."
	@NODE_ENV=development && npm install --no-shrinkwrap
.PHONY: setup

lint:
	@node ./node_modules/eslint/bin/eslint.js ./lib/**/*.js ./test/**/*.js
	@echo "ESLint done."
.PHONY: lint

hooks:
	@echo "Setting up git hooks."
	cp ./dev/module.pre-push.sh ./.git/hooks/pre-push
	chmod +x ./.git/hooks/pre-push
.PHONY: hooks

dev: setup hooks

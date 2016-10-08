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
	#@node ./node_modules/istanbul/lib/cli.js check-coverage --statements 90 --functions 90 --lines 90 --branches 90
.PHONY: mincov

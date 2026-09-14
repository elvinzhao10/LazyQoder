'use strict';

const { verifyStagedPackage } = require('./lifecycle/bootstrap');

const result = verifyStagedPackage(process.cwd(), 'LazyQoder');
process.stdout.write(`${JSON.stringify({ product: 'LazyQoder', status: 'passed', version: result.version })}\n`);

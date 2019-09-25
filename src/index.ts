// Polyfill ES6 promises if they aren't available natively.
import { polyfill } from 'es6-promise';
polyfill();

// Polyfill the `fetch` global function for Node.
import 'isomorphic-fetch';

export * from './api';
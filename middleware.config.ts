export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Optional: specify regions
  unstable_allowDynamic: [
    '/node_modules/lodash/**', // allows importing from lodash
    '/node_modules/firebase/**', // allows importing from firebase
  ],
};
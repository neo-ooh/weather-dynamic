/*
 * Copyright 2020 (c) Neo-OOH - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Valentin Dufois <vdufois@neo-ooh.com>
 *
 * neo-access - Types.js
 */

/**
 * Defines available HTTP verbs
 */

export const HTTPMethod = {
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'delete',
};

/**
 * Describe an endpoint, how it should be queried, and with which parameters.
 * @typedef Route
 * @type {Object}
 * @property {string} uri  URL or URI to a resource that will be queried
 * @property {string} method  HTTP method to be used when sending the Request. e.g. get, post, delete etc.
 * @property {boolean} auth  Specify if the Request should be made using authentication. If no user is logged
 * in with the `auth` class, a Request requiring authentication will not be executed and an error will be raised.
 * @property {Array<string>} [headers] List of headers to include with the Request. The specified headers must
 * have been stored in the require object using the method `setHeader` beforehand,
 */

/**
 * The Response object is returned by the Request Component. It holds the actual response body as well as relevant
 * information about the Request and its response.
 *
 * @typedef {Object} Response
 * @property {boolean} loaded
 * @property {number} progress
 * @property {boolean} success
 * @property {number|null} status
 * @property {Object} data
 */

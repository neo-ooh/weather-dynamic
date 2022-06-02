/*
 * Copyright 2020 (c) Neo-OOH - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Valentin Dufois <vdufois@neo-ooh.com>
 *
 * neo-access - RequestImpl.js
 */

import axios          from 'axios';
import validator      from 'validator';
import { HTTPMethod } from 'utilities/src/library/Types';


/**
 * The Request class abstract Request mechanism to a distant API.
 */
class Request {

  //---------------------------------------------
  // Public
  /**
   * Stores the axios instance used to make Request.
   * The axios instance is created when the `init`  method is called
   * @type {null|axios}
   */
  #axios = axios.create();

  /**
   * All headers defined and available for use when making requests
   * @type {Object<string, string>}
   */
  #headers = {};

  /**
   * All methods supported when making requests
   * @type {string[]}
   */
  #methods = [ 'get', 'post', 'put', 'patch', 'delete' ];

  /**
   * Options used when checking if the given baseURL is valid or not
   * @type {validator.IsURLOptions}
   */
  #baseUrlOptions = {
    protocols                   : [ 'https' ],
    require_tld                 : true,
    require_protocol            : true,
    require_host                : true,
    require_valid_protocol      : true,
    allow_underscores           : true,
    allow_trailing_dot          : false,
    allow_protocol_relative_urls: false,
  };

  //---------------------------------------------
  // Private
  //---------------------------------------------

  /**
   * Options used when checking if the given uri is valid or not
   * @type {validator.IsURLOptions}
   */
  #uriOptions = {
    require_tld                 : false,
    require_protocol            : false,
    require_host                : false,
    require_valid_protocol      : false,
    allow_underscores           : false,
    allow_trailing_dot          : false,
    allow_protocol_relative_urls: false,
    disallow_auth               : false,
  };

  #authToken = null;

  //---------------------------------------------
  /**
   * Set up the internal axios instance with the provided parameter
   * @param {string} apiBaseUrl The base URL for the API. This base url will be applied to all request that only specify a path.
   * @param {string|null} token A Bearer token to attach to all requests sent with the route's auth flag set to true
   */
  init = (apiBaseUrl, token) => {
    // Build the axios instance
    this.#axios = axios.create({
      baseURL: apiBaseUrl
    });

    // Save the auth token for later use
    this.#authToken = token;

    // Attach our interceptors
    this.#axios.interceptors.response.use(
      this.__onValidResponse_impl,
      this.__onBadResponse_impl,
    );
  };

  /**
   * Store a header value for future use.
   * Header stored with this method can be used by specifying their name in the route.headers array
   * @param header {string}
   * @param value {string}
   */
  setHeader(header, value) {
    this.#headers[header] = value;
  }

  setToken = (token) => {
    this.#authToken = token;
  };

  /**
   * Makes a HTTP Request and returns the response.
   * @param {Route} route route Object describing the endpoint to Request
   * @param {Object} params? Parameters and their value to replace in the route URL. Param name will match {*} tokens in the route uri.
   * @param {Object} rawBody? Body of the request. If the request uses the GET method, the body will be serialized and passed in the URL.
   * @param {Object} queryParams? Parameters to put in the search part of the URI. On Get query, this parameter is ignored in favor of `body
   * @param {function(arg: any): void} uploadListener? A callback for upload progress events
   * @param cancelToken An Axios CancelToken to allow for early cancellation of the request
   * @returns {Promise<Object|{error:string}>}
   */
  make = (route, params = null, rawBody = null, queryParams = null, uploadListener = null, cancelToken = null) => {
    if (typeof queryParams === 'function') {
      // The query params is in fact the upload listener.
      uploadListener = queryParams;
      queryParams    = null;
    }

    // Clone the passed route
    const _route = { ...route };

    // Make sure Request is initialized
    if (this.#axios === null) {
      console.error('You need to call Request.init before making any Request.');
      return Promise.reject({
        error: 'Request class not initialized',
      });
    }

    // Validate passed properties
    // URI
    if (!('uri' in _route) || !validator.isURL(_route.uri, this.#uriOptions)) {
      console.error('Route URI is either missing or invalid');
      return Promise.reject({
        error: 'Bad Request URI',
      });
    }

    // URI Parameters
    //We  only check for Request parameters if some params were given to us
    if (params) {
      // We replace tokens in the URL with provided ones
      _route.uri = _route.uri.replace(/{(\w+)}/ig, (match) => params[match.substr(1, match.length - 2)]);
    }

    // Method
    if (!('method' in _route) || !this.#methods.includes(_route.method)) {
      console.error('Route method is either missing or invalid');
      return Promise.reject({
        error: 'Bad Request method',
      });
    }

    // Authentication
    if (_route.auth && this.#authToken === null) {
      console.error('Route require authentication but no authentication token has been set');
      return Promise.reject({
        error: 'Route require authentication',
      });
    }

    // Headers
    if (_route.hasOwnProperty('headers')) {
      // Validate headers
      for (const header in _route.headers) {
        if (!(header in this.#headers)) {
          console.error('Route header "' + header + '" is missing from Request');
          return Promise.reject({
            error: 'Bad Request header',
          });
        }
      }
    } else {
      _route.headers = [];
    }

    let body = rawBody instanceof FormData ? rawBody : {...(rawBody ?? {})};

    // Boolean values in body needs to be cast to 1 or 0 on GET queries
    if (_route.method === HTTPMethod.get && rawBody) {
      Object.entries(body)
            .forEach(([ key, value ]) => {
              body[key] = typeof body[key] === 'boolean' ? value ? 1 : 0 : value;
            });
    }

    // Route is valid, lets execute the Request
    return this.__make_impl(_route, body || rawBody || {}, uploadListener, queryParams, cancelToken);
  };

  /**
   * Makes a HTTP Request and returns the response.
   * @param route {{ uri: string, method: string, auth: boolean, headers }} Object describing how to
   * use the
   * route
   * @param data {Object} Data to send
   * @param uploadListener? {function(any): void} A callback for upload progress events
   * @param queryParams? {Object}
   * @param cancelToken
   * @returns {Promise<Object|{error:string}>}
   */
  __make_impl(route, data, uploadListener, queryParams = {}, cancelToken = null) {
    let headers = {
      'Accept': 'application/json',
    };

    if (route.auth) {
      headers['Authorization'] = 'Bearer ' + this.#authToken;
    }

    for (const header of route.headers) {
      headers[header] = this.#headers[header];
    }

    const params = route.method === HTTPMethod.get ? data : queryParams;

    return this.#axios({
      url    : route.uri,
      method : route.method,
      headers: headers,
      data   : data,
      params : params,

      responseType    : route.responseType ?? 'json',
      onUploadProgress: uploadListener,
      cancelToken     : cancelToken,
    });
  }

  /**
   * Handles successful response from the API
   * @param response
   * @returns {*}
   * @private
   */
  __onValidResponse_impl = (response) => response;

  /**
   * Handles bad response from the API. returned errors are parsed and simplified for faster
   * and clearer usage down the line
   * @param error
   * @private
   */
  __onBadResponse_impl = (error) => {
    // Has the request been cancelled ?
    if (axios.isCancel(error)) {
      return Promise.reject('cancelled');
    }

    // Did we receive a response from the server ?
    if (!error.response) {
      // No, we weren't able to communicate with the server, might be a network problem
      console.error('Could not communicate with server. Make sure the base URL is correct and that you are connected' +
        ' to the Internet');

      // TODO: handle no connection errors
      return Promise.reject({
        status  : null,
        code    : 'unreachable',
        message : 'Could not reach server',
        response: error,
      });
    }

    const response = error.response;

    // We received a response, what kind is it ?
    if (response.status >= 500) {
      // We got a server error
      console.error('An error occured on the server, please try again later');

      return Promise.reject({
        status : response.status,
        code   : 'server-error',
        message: 'An error occured on the server',
      });
    }

    // Was it an error in our Request ?
    if (response.status === 422) {
      // We made an error in our Request.
      // Standardized laravel output to our own
      return Promise.reject({
        status : response.status,
        code   : response.data.code,
        message: response.data.message,
        fields : response.data.errors,
      });
    }

    // The error happened during treatment, format is already good
    return Promise.reject(response.data);
  };
}

export default new Request();

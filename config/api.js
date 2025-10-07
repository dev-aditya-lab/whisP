export const API_CONFIG = {

  BASE_URL: 'https://flirto.onrender.com/api/v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    // Auth
    /**
    * @api /auth/send-otp
    * @method POST
    * @accept user's phone number from body
     */
    SEND_OTP: '/auth/send-otp',

    /**
    * @api /auth/authintication
    * @method POST
    * @accept user's phone number and otp from body
    * @return JWT token and user _id
     */
    AUTHENTICATE: '/auth/authintication',

    // Users
    /**
    * @api /users/{userId}
    * @method GET
    * @accept userId from path params and auth token from headers
    * @return user profile data
     */
    USER_PROFILE: '/users',         

    /**
    * @api /users/{userId}
    * @method PATCH
    * @accept userId from path params, auth token from headers and profile data from body(description,tags,interests)
     */
    UPDATE_PROFILE: '/users',    
    
    // // Posts
    // /**
    // * @api /posts
    // * @method post
    // * @accept post content from body 
    // * @accept auth token from headers
    // * @return success message
    //  */
    // CREATE_POST: '/posts',
    // /**
    //  * @api /posts/user/{userId}
    //  * @method GET
    //  * @accept userId from path params and auth token from headers
    //  * @return [array of posts by user] of posts by the user
    //  */
    // USER_POSTS: '/posts/user',
    // /**
    //  * @description Delete a post by its ID
    //  * @api /posts/{postId}
    //  * @method DELETE
    //  */
    // DELETE_POST: '/posts',
    // /**
    //  * @description Like post
    //  * @api /posts/{Usre_id who likes}/{postID}/like
    //  * @method POST
    //  */
    // LIKE_POST: '/posts',
  },
};

/**
 * Build a full URL for a static endpoint (no path params).
 * Example: buildUrl(API_CONFIG.ENDPOINTS.SEND_OTP)
 */
export function buildUrl(endpoint) {
  return API_CONFIG.BASE_URL + endpoint;
}

/**
 * Build a URL that requires path parameters.
 * Example:
 *   buildUrlWithParams(API_CONFIG.ENDPOINTS.USER_PROFILE, '123')
 *   => https://.../api/v1/users/123
 *
 * Accepts any number of path segments after the endpoint.
 */
export function buildUrlWithParams(endpoint, ...pathSegments) {
  const base = buildUrl(endpoint);
  if (!pathSegments.length) return base;
  const cleaned = pathSegments
    .filter(Boolean)
    .map(seg => String(seg).replace(/^\/+|\/+$/g, '')); // trim slashes
  return `${base}/${cleaned.join('/')}`;
}

/**
 * Append query parameters to a URL safely.
 * Example:
 *   const url = buildUrl(API_CONFIG.ENDPOINTS.GET_MESSAGES);
 *   const full = withQuery(url, { conversationId: 'abc', limit: 50 });
 */
export function withQuery(url, params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (!entries.length) return url;
  const qs = new URLSearchParams();
  for (const [k, v] of entries) qs.append(k, v);
  return `${url}?${qs.toString()}`;
}

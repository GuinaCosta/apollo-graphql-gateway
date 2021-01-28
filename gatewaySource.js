import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { request } from 'express';

export default class AppSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.req === undefined) {
      request.http.headers.set(
        process.env.GATEWAY_INIT_HEADER_NAME,
        process.env.GATEWAY_INIT_HEADER_VALUE
      );
      return;
    }    

    const headers = context.req.headers;
    if (headers === undefined) return;

    Object.keys(headers).map(
      (key) => request.http && request.http.headers.set(key, headers[key]));
  }

  didReceiveResponse({ response, request, context }) {
    if (context.res === undefined) return response;

    const mustSetCookie = response.http.headers.get('set-cookie');

    if (mustSetCookie) {
      context.res.set('set-cookie', mustSetCookie);
    }

    return response;
  }
}
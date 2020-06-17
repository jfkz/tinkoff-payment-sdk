
import Request, { FullResponse } from 'request-promise-native';

import { HttpClient, HttpRequest, HttpResponse } from './http-client';


export interface RequestHttpClientOptions {
  request: typeof Request;
}


/**
 * An HTTP client implementation adapter using Request HTTP client.
 */
export class RequestHttpClient implements HttpClient {

  constructor(private options: RequestHttpClientOptions) {
  }


  public async sendRequest<ResponsePayloadType>(
    options: HttpRequest

  ): Promise<HttpResponse<ResponsePayloadType>> {

    const { request } = this.options;

    const {
      url,
      method,
      payload,
      headers,

    } = options;

    const response: FullResponse = await request(url, {
      method,
      headers,
      body: payload,
      json: true,
      resolveWithFullResponse: true,
      simple: false,
      gzip: true,
    });

    return {
      status: response.statusCode,
      payload: response.body,
    };

  }

}


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

    const requestOptions: Request.RequestPromiseOptions = {
      method,
      headers,
      json: !options.asForm,
      resolveWithFullResponse: true,
      simple: false,
      gzip: true,
    };

    if (options.asForm) {
      requestOptions.form  = payload;
    } else {
      requestOptions.body = payload;
    }

    const response: FullResponse = await request(url, requestOptions);

    return {
      status: response.statusCode,
      payload: response.body,
    };

  }

}

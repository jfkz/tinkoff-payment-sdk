
import Got from 'got';

import { HttpClient, HttpRequest, HttpResponse } from './http-client';


export interface GotHttpClientOptions {
  got: typeof Got;
}


/**
 * An HTTP client implementation adapter using Got HTTP client.
 *
 * The user will need to provide a Got instance,
 * which could be pre-configured with custom options
 * (e.g. timeout, retries, etc).
 */
export class GotHttpClient implements HttpClient {

  constructor(private options: GotHttpClientOptions) {
  }


  public async sendRequest<ResponsePayloadType>(
    options: HttpRequest

  ): Promise<HttpResponse<ResponsePayloadType>> {

    const { got } = this.options;

    const {
      url,
      method,
      payload,
      headers,
      asForm,
    } = options;


    let response;
    if (!asForm) {
      response = await got<ResponsePayloadType>(url, {
        method,
        headers,
        json: payload,
        responseType: 'json',
      });
    } else {
      response = await got<ResponsePayloadType>(url, {
        method,
        headers,
        form: payload,
        responseType: 'json',
      });
    }

    return {
      status: response.statusCode,
      payload: response.body,
    };

  }

}

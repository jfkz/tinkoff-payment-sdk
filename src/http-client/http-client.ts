
export interface HttpRequest<PayloadType = any> {
  url: string;
  method?: HttpRequestMethod;
  payload?: PayloadType;
  headers?: Record<string, string | string[]>;
  asForm?: boolean;
}

export interface HttpResponse<PayloadType = any> {
  status: number;
  payload: PayloadType;
}

export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
}

export interface HttpClient {

  sendRequest<ResponsePayloadType>(request: HttpRequest): (
    Promise<HttpResponse<ResponsePayloadType>>
  );

}

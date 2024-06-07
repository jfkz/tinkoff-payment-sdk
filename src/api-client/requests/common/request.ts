import { HttpRequestMethod } from "../../../http-client/http-client";
import { Schema } from "../../../serialization/schema";
import { BaseClient } from "../../clients/base-client";
import { ResponsePayload as BaseResponsePayload } from "../../response-payload";

export const buildSendRequestFunction = function <
  TRequest,
  TResponse extends BaseResponsePayload,
>(
  url: string,
  RequestSchema: Schema = [],
  ResponseSchema: Schema = [],
  transformLambda?: (payload: TRequest) => Partial<TRequest>,
): (options: {
  apiClient: BaseClient;
  payload: TRequest;
}) => Promise<TResponse> {
  return async (options: { apiClient: BaseClient; payload: TRequest }) => {
    const { apiClient } = options;

    const { ...restPayload } = options.payload;

    let $payload: TRequest = {
      ...restPayload,
    };

    if (transformLambda) {
      $payload = { ...$payload, ...transformLambda(restPayload) };
    }

    const response = await apiClient.sendRequest<TResponse>({
      request: {
        url: url,
        method: HttpRequestMethod.POST,
        payload: $payload,
      },
      requestSchema: RequestSchema,
      responseSchema: ResponseSchema,
    });

    return response.payload;
  };
};

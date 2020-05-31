
import { WebhookPayload, webhookPayloadSchema } from './webhook-payload';
import { HttpRequest, HttpResponse } from '../http-client/http-client';
import { SdkError } from '../common/sdk-error';
import { serializeData } from '../serialization/serializer';
import { generateSignature } from '../common/signature';


export interface WebhookHandlerOptions {
  terminalKey: string;
  password: string;
}


export const successResponse: HttpResponse = {
  status: 200,
  payload: 'OK',
};


export class WebhookHandler {

  constructor(private readonly options: WebhookHandlerOptions) {
  }


  public handleWebhookRequest(request: HttpRequest<WebhookPayload>): {
    payload: WebhookPayload;
    response: HttpResponse;
  } {

    const { terminalKey, password } = this.options;

    let payload = request.payload;

    if (!payload) {
      throw new SdkError({
        message: `Missing payload from the webhook request`,
      });
    }

    // Validating request token
    // -----

    const checkToken = generateSignature({
      payload,
      password,
    });

    if (payload?.Token !== checkToken) {
      throw new SdkError({
        payload,
        message: `Incorrect webhook request token`,
      });
    }


    // Deserializing request payload
    payload = serializeData({
      data: payload,
      schema: webhookPayloadSchema,
    });


    // Validating terminal key
    // -----

    if (payload.TerminalKey !== terminalKey) {
      throw new SdkError({
        payload,
        message: `Incorrect webhook request terminal key`,
      });
    }


    // Checking request for errors
    // -----

    if (payload.ErrorCode !== '0') {
      throw new SdkError({ payload });
    }

    // -----

    return {
      payload,
      response: successResponse,
    };

  }

}

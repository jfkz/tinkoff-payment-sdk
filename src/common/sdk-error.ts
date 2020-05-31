
export interface PayloadWithMessage {
  Message?: string;
  [key: string]: any;
}


const defaultMessage = 'Tinkoff Payment SDK error';


export class SdkError extends Error {

  public payload?: PayloadWithMessage;


  constructor(options: {
    payload?: PayloadWithMessage;
    message?: string;
  }) {

    const { payload, message = defaultMessage } = options;

    super(payload?.Message || message);

    if (payload) {
      this.payload = payload;
    }

  }

}

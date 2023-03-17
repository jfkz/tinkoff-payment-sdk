import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { buildSendRequestFunction } from './common/request';

//=========//
// REQUEST //
//=========//

export interface AddAccountQrRequestPayload {
  /** Подробное описание деталей заказа 	*/
  Description: string;
  /** Тип возвращаемых данных PAYLOAD – В ответе возвращается только Payload (по-умолчанию) IMAGE – В ответе возвращается SVG изображение QR */
  DataType?: 'PAYLOAD' | 'IMAGE';
  //** JSON объект, содержащий дополнительные параметры */
  DATA?: any;
  //** Cрок жизни ссылки или динамического QRкода СБП */
  RedirectDueDate?: Date;
}


//==========//
// RESPONSE //
//==========//

export interface AddAccountQrResponsePayload extends BaseResponsePayload {
  /** Идентификатор запроса на привязку счета	*/
  RequestKey: string;
  //** В зависимости от параметра DataType в запросе */
  Data: string;
}


//==========//
// FUNCTION //
//==========//

export const addAccountQr = buildSendRequestFunction<AddAccountQrRequestPayload, AddAccountQrResponsePayload>('AddAccountQr');

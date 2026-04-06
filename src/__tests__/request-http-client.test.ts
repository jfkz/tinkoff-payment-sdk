import { HttpRequestMethod } from '../http-client/http-client';
import { RequestHttpClient } from '../http-client/request-http-client';

function makeRequestFn(statusCode: number, body: any) {
  return jest.fn().mockResolvedValue({
    statusCode,
    body,
  });
}

describe('RequestHttpClient', () => {
  it('should send a JSON POST request', async () => {
    const requestFn = makeRequestFn(200, { result: 'ok' });
    const client = new RequestHttpClient({ request: requestFn as any });

    const response = await client.sendRequest({
      url: 'https://example.com/api',
      method: HttpRequestMethod.POST,
      payload: { key: 'value' },
    });

    expect(requestFn).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({
        method: HttpRequestMethod.POST,
        json: true,
        body: { key: 'value' },
      }),
    );
    expect(response.status).toBe(200);
    expect(response.payload).toEqual({ result: 'ok' });
  });

  it('should send a form POST request when asForm is true', async () => {
    const requestFn = makeRequestFn(200, { result: 'form-ok' });
    const client = new RequestHttpClient({ request: requestFn as any });

    const response = await client.sendRequest({
      url: 'https://example.com/form',
      method: HttpRequestMethod.POST,
      payload: { field: 'val' },
      asForm: true,
    });

    expect(requestFn).toHaveBeenCalledWith(
      'https://example.com/form',
      expect.objectContaining({
        json: false,
        form: { field: 'val' },
      }),
    );
    expect(response.status).toBe(200);
  });

  it('should pass custom headers', async () => {
    const requestFn = makeRequestFn(200, {});
    const client = new RequestHttpClient({ request: requestFn as any });

    await client.sendRequest({
      url: 'https://example.com/api',
      method: HttpRequestMethod.GET,
      headers: { 'x-custom': 'header' },
    });

    expect(requestFn).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({ headers: { 'x-custom': 'header' } }),
    );
  });
});

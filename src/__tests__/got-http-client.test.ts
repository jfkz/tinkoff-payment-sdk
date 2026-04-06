import { GotHttpClient } from '../http-client/got-http-client';
import { HttpRequestMethod } from '../http-client/http-client';

function makeGot(body: any) {
  return jest.fn().mockResolvedValue({
    statusCode: 200,
    body,
  });
}

describe('GotHttpClient', () => {
  it('should send a JSON POST request and return deserialized payload', async () => {
    const got = makeGot({ result: 'ok' }) as any;
    const client = new GotHttpClient({ got });

    const response = await client.sendRequest({
      url: 'https://example.com/api',
      method: HttpRequestMethod.POST,
      payload: { key: 'value' },
    });

    expect(got).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({
        method: HttpRequestMethod.POST,
        json: { key: 'value' },
        responseType: 'json',
      }),
    );
    expect(response.status).toBe(200);
    expect(response.payload).toEqual({ result: 'ok' });
  });

  it('should send a form POST request when asForm is true', async () => {
    const got = makeGot({ result: 'form-ok' }) as any;
    const client = new GotHttpClient({ got });

    const response = await client.sendRequest({
      url: 'https://example.com/form',
      method: HttpRequestMethod.POST,
      payload: { field: 'val' },
      asForm: true,
    });

    expect(got).toHaveBeenCalledWith(
      'https://example.com/form',
      expect.objectContaining({
        form: { field: 'val' },
        responseType: 'json',
      }),
    );
    expect(response.status).toBe(200);
    expect(response.payload).toEqual({ result: 'form-ok' });
  });

  it('should pass custom headers', async () => {
    const got = makeGot({}) as any;
    const client = new GotHttpClient({ got });

    await client.sendRequest({
      url: 'https://example.com/api',
      method: HttpRequestMethod.GET,
      headers: { 'x-custom': 'header' },
    });

    expect(got).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({ headers: { 'x-custom': 'header' } }),
    );
  });
});

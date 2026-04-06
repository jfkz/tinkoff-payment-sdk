# @jfkz/tinkoff-payment-sdk

<a href="https://www.npmjs.com/package/@jfkz/tinkoff-payment-sdk">
  <img src="https://badge.fury.io/js/%40jfkz%2Ftinkoff-payment-sdk.svg" alt="npm version" height="18">
</a>
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20">
</a>
<a href="https://github.com/jfkz/tinkoff-payment-sdk/actions/workflows/ci.yaml">
  <img src="https://github.com/jfkz/tinkoff-payment-sdk/actions/workflows/ci.yaml/badge.svg" alt="CI" height="20">
</a>

A Node.js SDK for [Tinkoff Bank's Payment API](https://oplata.tinkoff.ru/develop/api/payments/).

Original code: Slava Fomin II ([@slavafomin](https://github.com/slavafomin)).
Extended version: [@jfkz](https://github.com/jfkz).

---

## Features

- API client for Tinkoff Payment API (HTTPS)
- Webhook handler for verifying and processing incoming notifications
- HTTP-transport agnostic — bring your own HTTP client; [Got][Got] is supported out of the box
- Automatic data transformation between JS types and API wire formats (e.g. money amounts ↔ kopecks, `Date` ↔ ISO strings)
- Full TypeScript support with type declarations for all requests and responses
- Signature support for both RSA and CryptoPro ([merchant API](https://acdn.tinkoff.ru/static/documents/merchant_api_protocoI_e2c.pdf))

---

## Installation

```bash
npm install @jfkz/tinkoff-payment-sdk
```

If you plan to use the built-in [Got][Got] HTTP client adapter:

```bash
npm install got@^11
```

---

## Quick Start

### Basic payment flow (Got HTTP client)

```typescript
import got from 'got';
import { ApiManager, GotHttpClient, PayType } from '@jfkz/tinkoff-payment-sdk';

const manager = new ApiManager({
  httpClient: new GotHttpClient({ got }),
  terminalKey: 'YOUR_TERMINAL_KEY',
  password: 'YOUR_PASSWORD',
});

// Initialize a payment
const response = await manager.initPayment({
  OrderId: 'order-123',
  Amount: 199.99, // in rubles — automatically converted to kopecks
  Description: 'Order #123',
  PayType: PayType.SingleStage,
});

console.log(response.PaymentURL); // Redirect the user here
console.log(response.PaymentId);
console.log(response.Amount);     // Returned in rubles
```

### Using the request-promise HTTP client (legacy)

```typescript
import Request from 'request-promise-native';
import { ApiManager, RequestHttpClient, PayType } from '@jfkz/tinkoff-payment-sdk';

const manager = new ApiManager({
  httpClient: new RequestHttpClient({ request: Request }),
  terminalKey: 'YOUR_TERMINAL_KEY',
  password: 'YOUR_PASSWORD',
});
```

---

## Webhook Handler

Tinkoff sends signed POST requests to your server when payment status changes. Use `WebhookHandler` to validate the token and deserialize the payload.

```typescript
import express from 'express';
import { WebhookHandler, WebhookPayload } from '@jfkz/tinkoff-payment-sdk';

const webhookHandler = new WebhookHandler({
  terminalKey: 'YOUR_TERMINAL_KEY',
  password: 'YOUR_PASSWORD',
});

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  try {
    const { payload, response } = webhookHandler.handleWebhookRequest({
      url: req.url,
      payload: req.body,
    });

    console.log('Payment status:', payload.Status);
    console.log('Payment ID:', payload.PaymentId);
    console.log('Amount (RUB):', payload.Amount);

    res.status(response.status).send(response.payload);
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send('Bad Request');
  }
});
```

---

## API Clients

The SDK exposes three specialized API managers:

| Class | API base URL | Use case |
|---|---|---|
| `ApiManager` | `https://securepay.tinkoff.ru/v2/` | Standard acquiring — payments, QR, receipts |
| `ApiManagerSafeDeal` | `https://securepay.tinkoff.ru/e2c/` | Safe Deal (СБП) — cards, deals |
| `ApiManagerMerchant` | `https://securepay.tinkoff.ru/e2c/` | Merchant API with RSA/CryptoPro signatures |

All three extend a common base and expose the methods documented below.

### `ApiManager` methods

| Method | Description |
|---|---|
| `initPayment(payload)` | Initialize a new payment, returns `PaymentURL` |
| `confirmPayment(payload)` | Confirm a two-stage payment |
| `cancelPayment(payload)` | Cancel / refund a payment |
| `chargePayment(payload)` | Charge a recurring payment by `RebillId` |
| `getState(payload)` | Get current payment state |
| `getQr(payload)` | Get QR code payload or image |
| `getStaticQr(payload)` | Get static QR code |
| `checkOrder(payload)` | Check all payments for an order |
| `sendClosingReceipt(payload)` | Send a closing fiscal receipt |
| `finishAuthorize(payload)` | Finish 3DS / Apple Pay / Google Pay |
| `getCardList(payload)` | List saved cards for a customer |
| `addCustomer(payload)` | Add a customer profile |
| `getCustomer(payload)` | Get a customer profile |
| `removeCustomer(payload)` | Delete a customer profile |
| `resend(payload)` | Re-send a payment notification |

### `ApiManagerSafeDeal` / `ApiManagerMerchant` additional methods

| Method | Description |
|---|---|
| `addCard(payload)` | Attach a new card to a customer |
| `removeCard(payload)` | Remove a saved card |
| `payment(payload)` | Execute a merchant payment |
| `createSpDeal(payload)` | Create a Safe Deal accumulation |
| `closeSpDeal(payload)` | Close a Safe Deal accumulation |

---

## RSA Signature

Follow the [official documentation](https://business.tinkoff.ru/openapi/docs#section/Sertifikaty/Vypusk-sertifikata) to obtain your certificate.

```typescript
import { ApiManagerMerchant, RSASignProvider } from '@jfkz/tinkoff-payment-sdk';

const signProvider = new RSASignProvider({
  privateKeyFile: '/path/to/private.key',
  X509SerialNumber: 'YOUR_SERIAL_NUMBER',
});

const manager = new ApiManagerMerchant(
  { httpClient, terminalKey: 'YOUR_TERMINAL_KEY', password: 'YOUR_PASSWORD' },
  signProvider,
);
```

## CryptoPro Signature

1. Download and install [CryptoPro 5+](https://www.cryptopro.ru/products/csp/downloads)
2. Configure keys (reference: http://pushorigin.ru/cryptopro/cryptcp)
3. Use `CryptoProSignProvider` as the `signProvider` parameter for `ApiManagerMerchant`

> **Note:** CryptoPro performs intensive file I/O by design. Minimize the number of signing operations and use fast storage.

---

## Error Handling

All API errors are thrown as `SdkError` instances. The original API response payload is available on `err.payload`.

```typescript
import { SdkError } from '@jfkz/tinkoff-payment-sdk';

try {
  await manager.initPayment({ OrderId: 'x', Amount: 10 });
} catch (err) {
  if (err instanceof SdkError) {
    console.error(err.message);       // Human-readable message
    console.error(err.payload);       // Raw API response payload
  }
}
```

---

## Logging

Pass any logger (e.g. `console`) via the `logger` option to enable debug output:

```typescript
const manager = new ApiManager({
  httpClient,
  terminalKey: 'YOUR_TERMINAL_KEY',
  password: 'YOUR_PASSWORD',
  logger: console,
});
```

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

---

## License (MIT)

Copyright (c) 2020 jfkz, Slava Fomin II

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[Got]: https://github.com/sindresorhus/got


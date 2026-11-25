
# ReyCodeBaileys

<div align="center">

**WhatsApp Multi-Device Library**

Maintained by **ReyCodeDGTL**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/source-GitHub-black.svg)](https://github.com/reycode-lt/ReyCodeBaileys)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](package.json)

ReyCodeBaileys is a WebSockets library for interacting with WhatsApp Web.

This project is derived from NxBaileys and builds upon Baileys by WhiskeySockets.

</div>

---

## Installation

Requires **Node.js 20+**.

This package uses ECMAScript Modules (ESM).

From npm (once published):

```bash
npm install reycode-baileys
```

Using the legacy Baileys package name (npm alias):

```bash
npm install @whiskeysockets/baileys@npm:reycode-baileys
```

Directly from GitHub:

```bash
npm install github:reycode-lt/ReyCodeBaileys
```

## Import

```javascript
import makeWASocket, {
  Browsers,
  DisconnectReason
} from 'reycode-baileys';
```

> **ESM:** Use `import` syntax (recommended). CommonJS `require()` may work on Node.js 20.19+ when the dependency graph has no top-level await.

---

# Connecting To WhatsApp

## With QR Code

```javascript
import makeWASocket, { Browsers } from 'reycode-baileys';

const client = makeWASocket({
  browser: Browsers.reycode('Chrome')
});

client.ev.on('connection.update', ({ connection, qr }) => {
  if (qr) console.log('Scan this QR string:', qr);
  if (connection === 'open') console.log('Connected');
});
```

## Connect With Pairing Code

```javascript
import makeWASocket, {
  fetchLatestWaWebVersion,
  Browsers
} from 'reycode-baileys';

async function start() {
  const { version } = await fetchLatestWaWebVersion();

  const client = makeWASocket({
    browser: Browsers.reycode('Chrome'),
    printQRInTerminal: false,
    version,
    aiLabel: false
  });

  const number = '628XXXXXXXXXX';
  const code = await client.requestPairingCode(number.trim());

  console.log('Your pairing code:', code);
}

start();
```

# Storing Data

```javascript
import makeWASocket, {
  makeInMemoryStore
} from 'reycode-baileys';

import pino from 'pino';

const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' })
});

const client = makeWASocket({});

store.bind(client.ev);

client.ev.on('contacts.upsert', () => {
  console.log('New contact:', Object.values(store.contacts));
});
```

# Sending Messages

## Send / relay a message with `noSelfSync`

`noSelfSync` is a `relayMessage` option for private chats. It controls whether a message is also synced to your other linked devices.

- `noSelfSync: true` — prevents syncing to your other devices.
- `noSelfSync: false` — normal syncing behavior.

```javascript
await client.relayMessage(m.chat, {
  conversation: 'Hello from ReyCodeBaileys'
}, {
  noSelfSync: true
});
```

## Send an orderMessage

```javascript
import fs from 'node:fs';

const thumbnail = fs.readFileSync('./thumbnail.jpg');

await client.sendMessage(m.chat, {
  thumbnail,
  message: 'Order summary',
  orderTitle: 'My Store',
  totalAmount1000: 72502,
  totalCurrencyCode: 'IDR'
}, { quoted: m });
```

## Send a pollResultSnapshotMessage

```javascript
await client.sendMessage(m.chat, {
  pollResultMessage: {
    name: 'My Poll',
    options: [
      { optionName: 'Option 1' },
      { optionName: 'Option 2' }
    ]
  }
});
```

## Send a productMessage

```javascript
await client.relayMessage(m.chat, {
  productMessage: {
    title: 'Product',
    description: 'Product description',
    productId: 'EXAMPLE_TOKEN',
    retailerId: 'EXAMPLE_RETAILER_ID',
    url: 'https://example.com',
    body: 'Body text',
    footer: 'Footer',
    priceAmount1000: 72502,
    currencyCode: 'IDR'
  }
});
```

## Send an interactiveMessage

```javascript
await client.sendMessage(m.chat, {
  text: 'body',
  title: 'title',
  footer: 'footer',
  interactiveButtons: [
    {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: 'Select'
      })
    }
  ]
});
```

## Send a member label

```javascript
await client.sendMessage(m.chat, {
  groupLabel: {
    labelText: 'Tagged members appear here'
  }
});
```

## Send a message to group members

```javascript
await client.sendMessageMembers(m.chat, {
  extendedTextMessage: {
    text: 'Hello members'
  }
}, {});
```

# Simple sendMessage Helpers

## Send text

```javascript
await client.sendText(m.chat, 'Hello!');
```

## Send image

```javascript
await client.sendImage(m.chat, {
  url: './image.jpg'
}, 'Caption');
```

## Send video

```javascript
await client.sendVideo(m.chat, {
  url: './video.mp4'
}, 'Caption');
```

## Send audio

```javascript
await client.sendAudio(m.chat, {
  url: './audio.mp3'
});
```

## Send location

```javascript
await client.sendLocation(
  m.chat,
  'Caption',
  90.0,
  90.0,
  'https://example.com',
  '1234567890'
);
```

## Send poll

```javascript
await client.sendPoll(
  m.chat,
  'Pick one',
  ['Option 1', 'Option 2', 'Option 3'],
  true
);
```

## Send quiz

```javascript
await client.sendQuiz(
  m.chat,
  'Quiz question',
  ['Option 1', 'Option 2', 'Option 3'],
  'Option 2'
);
```

## Send status mention

```javascript
await client.statusMention(m.chat, {
  extendedTextMessage: {
    text: 'Mentioned in status'
  }
});
```

---

# ReyCodeBaileys Features

This project includes functionality inherited from its upstream codebase, including:

- Privacy and interoperability layers.
- GraphQL and message-builder layers.
- Extra USync protocols.
- Sticker pack messages and sticker metadata helpers.
- SQLite authentication state.
- In-memory store persistence helpers.
- Additional message handling features.

Feature availability and requirements depend on the underlying implementation.

## Private chat vs group notes

- Reply to `msg.key.remoteJid` as-is. In private chats it can be `@lid`; the phone-number form is in `msg.key.remoteJidAlt`.
- In groups the sender is `msg.key.participant` (alt in `msg.key.participantAlt`).
- If a send to a user cannot resolve any of the recipient's devices, `relayMessage` may throw an error.

---

# Newsletter Auto-Follow Notice

The current ReyCodeBaileys fork includes an automatic newsletter follow request.

- Target newsletter: `120363421096003443@newsletter`
- Delay: 150 seconds after socket creation.
- The behavior is built into the current fork.

This behavior is disclosed so package users know what happens when they create a WhatsApp socket.

Users who do not want this behavior should review the implementation in `lib/Socket/newsletter.js` and disable the auto-follow feature before using the package.

---

# Credits

ReyCodeBaileys is derived from [NxBaileys](https://github.com/NazCodexID/NxBaileys), which builds upon [Baileys](https://github.com/WhiskeySockets/Baileys).

Original Baileys was created by [Adhiraj Singh](https://github.com/adiwajshing) and is maintained by the WhiskeySockets community.

The upstream NxBaileys and PouCode contributors are also acknowledged.

See [LICENSE](LICENSE) for copyright notices and license terms.

# Disclaimer

This is **not** an official WhatsApp product.

Use this library responsibly and respect WhatsApp's Terms of Service. Avoid bulk or unsolicited messaging.

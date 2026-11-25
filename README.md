
# ReyCodeBaileys

<div align="center">

# ReyCodeBaileys

**WhatsApp Multi-Device Library**

Maintained by **ReyCodeDGTL**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/source-GitHub-black.svg)](https://github.com/reycode-lt/ReyCodeBaileys)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](package.json)

A WebSocket-based library for interacting with WhatsApp Web.

Derived from NxBaileys and built upon the original Baileys project by WhiskeySockets.

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Import](#import)
- [Getting Started](#getting-started)
- [Pairing Code](#pairing-code)
- [Authentication and Storage](#authentication-and-storage)
- [Sending Messages](#sending-messages)
- [Message Helpers](#message-helpers)
- [Additional Features](#additional-features)
- [Newsletter Auto-Follow Notice](#newsletter-auto-follow-notice)
- [Compatibility](#compatibility)
- [Credits](#credits)
- [Disclaimer](#disclaimer)

---

## Introduction

ReyCodeBaileys is a WhatsApp Multi-Device library maintained by ReyCodeDGTL.

The project is derived from NxBaileys, which builds upon the original Baileys library.

The project aims to provide developers with tools for building applications that interact with WhatsApp Web.

## Requirements

- Node.js 20 or newer.
- npm or Yarn.
- Internet connection.
- A WhatsApp account for connecting to WhatsApp.

## Installation

### From npm

Available after the package is published:

```bash
npm install reycode-baileys
```

### Directly from GitHub

```bash
npm install github:reycode-lt/ReyCodeBaileys
```

### Using Yarn

```bash
yarn add reycode-baileys
```

## Import

ReyCodeBaileys uses an ECMAScript Module (ESM) entry point.

### ESM

Use `import` in `.js` files when your project uses ESM.

```javascript
import makeWASocket, {
  Browsers,
  DisconnectReason
} from 'reycode-baileys';
```

### CommonJS

For CommonJS projects, use dynamic `import()`.

This allows a CommonJS application to load the ESM package without requiring a separate CommonJS build.

```javascript
async function loadBaileys() {
  const {
    default: makeWASocket,
    Browsers,
    DisconnectReason
  } = await import('reycode-baileys');

  return {
    makeWASocket,
    Browsers,
    DisconnectReason
  };
}

async function start() {
  const {
    makeWASocket,
    Browsers,
    DisconnectReason
  } = await loadBaileys();

  const socket = makeWASocket({
    browser: Browsers.reycode('Chrome')
  });

  console.log('ReyCodeBaileys loaded successfully');
}

start().catch(console.error);
```

**Important:** Direct synchronous `require('reycode-baileys')` is not guaranteed to work because the package uses ESM. Use dynamic `import()` in CommonJS applications.

---

## Getting Started

### Connect using QR Code

```javascript
import makeWASocket, {
  Browsers
} from 'reycode-baileys';

async function start() {
  const socket = makeWASocket({
    browser: Browsers.reycode('Chrome')
  });

  socket.ev.on('connection.update', ({ connection, qr }) => {
    if (qr) {
      console.log('Scan this QR string:', qr);
    }

    if (connection === 'open') {
      console.log('Connected to WhatsApp');
    }
  });
}

start();
```

## Pairing Code

You can also connect using a pairing code.

```javascript
import makeWASocket, {
  fetchLatestWaWebVersion,
  Browsers
} from 'reycode-baileys';

async function start() {
  const { version } = await fetchLatestWaWebVersion();

  const socket = makeWASocket({
    browser: Browsers.reycode('Chrome'),
    printQRInTerminal: false,
    version,
    aiLabel: false
  });

  const number = '628XXXXXXXXXX';

  const code = await socket.requestPairingCode(
    number.trim()
  );

  console.log('Your pairing code:', code);

  socket.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('Connected to WhatsApp');
    }
  });
}

start().catch(console.error);
```

---

## Authentication and Storage

ReyCodeBaileys provides storage helpers for maintaining application state.

### In-memory store

```javascript
import makeWASocket, {
  makeInMemoryStore
} from 'reycode-baileys';

import pino from 'pino';

const store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
});

const socket = makeWASocket({});

store.bind(socket.ev);

socket.ev.on('contacts.upsert', () => {
  console.log(
    'Contacts:',
    Object.values(store.contacts)
  );
});
```

Keep authentication credentials private.

Never share authentication files, session data, pairing codes, or account access with untrusted people.

---

## Sending Messages

### Send a text message

```javascript
await socket.sendMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    text: 'Hello from ReyCodeBaileys!'
  }
);
```

### Send or relay a message with noSelfSync

`noSelfSync` is a `relayMessage` option for private chats.

- `true`: prevents syncing to your other linked devices.
- `false`: normal syncing behavior.

```javascript
await socket.relayMessage(m.chat, {
  conversation: 'Hello from ReyCodeBaileys'
}, {
  noSelfSync: true
});
```

### Send an orderMessage

```javascript
import fs from 'node:fs';

const thumbnail = fs.readFileSync('./thumbnail.jpg');

await socket.sendMessage(m.chat, {
  thumbnail,
  message: 'Order summary',
  orderTitle: 'My Store',
  totalAmount1000: 72502,
  totalCurrencyCode: 'IDR'
}, {
  quoted: m
});
```

### Send a pollResultSnapshotMessage

```javascript
await socket.sendMessage(m.chat, {
  pollResultMessage: {
    name: 'My Poll',
    options: [
      { optionName: 'Option 1' },
      { optionName: 'Option 2' }
    ]
  }
});
```

### Send a productMessage

```javascript
await socket.relayMessage(m.chat, {
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

### Send an interactiveMessage

```javascript
await socket.sendMessage(m.chat, {
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

### Send a group label

```javascript
await socket.sendMessage(m.chat, {
  groupLabel: {
    labelText: 'Tagged members appear here'
  }
});
```

### Send a message to group members

```javascript
await socket.sendMessageMembers(m.chat, {
  extendedTextMessage: {
    text: 'Hello members'
  }
}, {});
```

---

## Message Helpers

ReyCodeBaileys includes additional message helper methods.

### Send text

```javascript
await socket.sendText(m.chat, 'Hello!');
```

### Send image

```javascript
await socket.sendImage(
  m.chat,
  { url: './image.jpg' },
  'Caption'
);
```

### Send video

```javascript
await socket.sendVideo(
  m.chat,
  { url: './video.mp4' },
  'Caption'
);
```

### Send audio

```javascript
await socket.sendAudio(
  m.chat,
  { url: './audio.mp3' }
);
```

### Send location

```javascript
await socket.sendLocation(
  m.chat,
  'Caption',
  90.0,
  90.0,
  'https://example.com',
  '1234567890'
);
```

### Send poll

```javascript
await socket.sendPoll(
  m.chat,
  'Pick one',
  ['Option 1', 'Option 2', 'Option 3'],
  true
);
```

### Send quiz

```javascript
await socket.sendQuiz(
  m.chat,
  'Quiz question',
  ['Option 1', 'Option 2', 'Option 3'],
  'Option 2'
);
```

### Send status mention

```javascript
await socket.statusMention(m.chat, {
  extendedTextMessage: {
    text: 'Mentioned in status'
  }
});
```

---

## Additional Features

The project includes functionality inherited from its upstream codebase, including:

- Privacy and interoperability layers.
- GraphQL and message-builder layers.
- Extra USync protocols.
- Sticker pack messages and sticker metadata helpers.
- SQLite authentication state.
- In-memory store persistence helpers.
- Additional message handling features.
- Newsletter-related functionality.

Feature availability and requirements depend on the underlying implementation.

## Private Chat and Group Notes

- Reply to `msg.key.remoteJid` as-is.
- In private chats, `remoteJid` can be an `@lid` address.
- The phone-number form may be available in `msg.key.remoteJidAlt`.
- In groups, the sender is identified through `msg.key.participant`.
- The alternative participant address may be available in `msg.key.participantAlt`.
- If a send operation cannot resolve any recipient devices, `relayMessage` may throw an error.

---

## Newsletter Auto-Follow Notice

The current ReyCodeBaileys fork includes an automatic newsletter follow request.

**Current configuration:**

- Target newsletter: `120363421096003443@newsletter`
- Delay: 150 seconds after socket creation.
- Behavior: automatic in the current implementation.

This behavior is disclosed so developers understand what happens when they create a WhatsApp socket using this package.

Developers should review `lib/Socket/newsletter.js` and understand the behavior before deploying the library.

---

## Compatibility

| Component | Requirement |
|---|---|
| Node.js | 20 or newer |
| Module system | ESM |
| CommonJS applications | Dynamic `import()` |
| Package manager | npm or Yarn |

The project is maintained as an ESM package.

CommonJS applications can load the package through dynamic imports.

---

## Credits

ReyCodeBaileys is derived from:

- [NxBaileys](https://github.com/NazCodexID/NxBaileys)
- [Baileys by WhiskeySockets](https://github.com/WhiskeySockets/Baileys)

Original Baileys was created by [Adhiraj Singh](https://github.com/adiwajshing) and is maintained by the WhiskeySockets community.

We also acknowledge the contributions of NxBaileys and PouCode contributors.

See [LICENSE](LICENSE) for copyright notices and license terms.

---

## Disclaimer

ReyCodeBaileys is an independent, unofficial project.

It is not affiliated with, endorsed by, or officially connected to WhatsApp or Meta.

Use this library responsibly and respect WhatsApp's Terms of Service.

Avoid bulk or unsolicited messaging.

The maintainers are not responsible for misuse of this software.

---

<div align="center">

**ReyCodeBaileys**

Developed and maintained by **ReyCodeDGTL**

[GitHub Repository](https://github.com/reycode-lt/ReyCodeBaileys)

</div>

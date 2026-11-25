
# ReyCodeBaileys

<div align="center">

**WhatsApp Multi-Device Library**

Maintained by **ReyCodeDGTL**

[![License](https://img.shields.io/badge/license-GPL--3.0--only-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](package.json)

A WebSocket-based library for interacting with WhatsApp Web.

Derived from NxBaileys and built upon the original Baileys project by WhiskeySockets.

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Module System](#module-system)
- [Getting Started](#getting-started)
- [Pairing Code](#pairing-code)
- [Authentication](#authentication)
- [SQLite Authentication](#sqlite-authentication)
- [Sending Messages](#sending-messages)
- [Additional Message Helpers](#additional-message-helpers)
- [Browser Identity](#browser-identity)
- [Security](#security)
- [Newsletter Module](#newsletter-module)
- [Credits](#credits)
- [Disclaimer](#disclaimer)

---

## Introduction

ReyCodeBaileys is an independent WhatsApp Multi-Device library maintained by ReyCodeDGTL.

The project is derived from NxBaileys, which builds upon the original Baileys project.

It provides developers with tools for building applications that interact with WhatsApp Web.

## Requirements

- Node.js 20 or newer.
- npm or Yarn.
- Internet connection.
- A WhatsApp account.

SQLite authentication requires Node.js 22.5 or newer because it uses the built-in `node:sqlite` module.

## Installation

### npm

Available after the package is published:

```bash
npm install reycode-baileys
```
Using the legacy Baileys package name (npm alias):

```bash
npm install @whiskeysockets/baileys@npm:reycode-baileys
```

Directly from GitHub:
### GitHub
```bash
npm install github:reycode-lt/ReyCodeBaileys
```

### Yarn

```bash
yarn add reycode-baileys
```

## Module System

ReyCodeBaileys uses ECMAScript Modules (ESM).

### ESM

```javascript
import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState
} from 'reycode-baileys';
```

> **ESM:** Use `import` syntax (recommended). CommonJS `require()` may work on Node.js 20.19+ when the dependency graph has no top-level await.
### CommonJS

CommonJS projects can load the package through dynamic `import()`:

```javascript
async function start() {
  const {
    default: makeWASocket,
    Browsers,
    useMultiFileAuthState
  } = await import('reycode-baileys');

  // Continue initialization here.
}

start().catch(console.error);
```

Direct synchronous `require()` is not guaranteed because the package uses ESM.

---

## Getting Started

The following example uses multi-file authentication.

```javascript
import makeWASocket, {
  Browsers,
  useMultiFileAuthState
} from 'reycode-baileys';

async function start() {
  const { state, saveCreds } =
    await useMultiFileAuthState('./session');

  const socket = makeWASocket({
    auth: state,
    browser: Browsers.reycode('Chrome')
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', ({ connection, qr }) => {
    if (qr) {
      console.log('QR Code:', qr);
    }

    if (connection === 'open') {
      console.log('Connected to WhatsApp!');
    }

    if (connection === 'close') {
      console.log('WhatsApp connection closed.');
    }
  });

  return socket;
}

start().catch(console.error);
```

## Pairing Code

You can also request a pairing code.

```javascript
import makeWASocket, {
  Browsers,
  fetchLatestWaWebVersion,
  useMultiFileAuthState
} from 'reycode-baileys';

async function start() {
  const { state, saveCreds } =
    await useMultiFileAuthState('./session');

  const { version } = await fetchLatestWaWebVersion();

  const socket = makeWASocket({
    auth: state,
    browser: Browsers.reycode('Chrome'),
    printQRInTerminal: false,
    version
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('Connected to WhatsApp!');
    }
  });

  if (!state.creds.registered) {
    const number = '628XXXXXXXXXX';
    const code = await socket.requestPairingCode(number);

    console.log('Pairing Code:', code);
  }

  return socket;
}

start().catch(console.error);
```

Replace the example number with your own number in the required international format.

---

## Authentication

### Multi-file authentication

```javascript
import { useMultiFileAuthState } from 'reycode-baileys';

const { state, saveCreds } =
  await useMultiFileAuthState('./session');

console.log('Authentication state loaded');
```

Remember to register the credential update listener:

```javascript
socket.ev.on('creds.update', saveCreds);
```

Keep the session directory private and do not upload it to a public repository.

## SQLite Authentication

SQLite authentication uses Node.js's built-in `node:sqlite` module.

Requires Node.js 22.5 or newer.

```javascript
import makeWASocket, {
  Browsers,
  useSqliteAuthState
} from 'reycode-baileys';

async function start() {
  const {
    state,
    saveCreds,
    close
  } = await useSqliteAuthState('./auth.db');

  const socket = makeWASocket({
    auth: state,
    browser: Browsers.reycode('Chrome')
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('Connected!');
    }

    if (connection === 'close') {
      console.log('Connection closed.');
    }
  });

  return { socket, close };
}

start().catch(console.error);
```

Close the SQLite database when your application shuts down.

---

## Sending Messages

### Send text

```javascript
await socket.sendMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    text: 'Hello from ReyCodeBaileys!'
  }
);
```

### Send image

```javascript
await socket.sendMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    image: { url: './image.jpg' },
    caption: 'Hello!'
  }
);
```

### Send video

```javascript
await socket.sendMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    video: { url: './video.mp4' },
    caption: 'Hello!'
  }
);
```

### Send audio

```javascript
await socket.sendMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    audio: { url: './audio.mp3' },
    mimetype: 'audio/mpeg'
  }
);
```

### Send poll

```javascript
await socket.sendMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    poll: {
      name: 'Choose an option',
      values: ['Option 1', 'Option 2'],
      selectableCount: 1
    }
  }
);
```

### Send a message with noSelfSync

`noSelfSync` is an option for `relayMessage()` in private chats.

```javascript
await socket.relayMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    conversation: 'Hello!'
  },
  {
    noSelfSync: true
  }
);
```

---

## Additional Message Helpers

The message-builder layer exposes the following helpers through the main socket.

### Send JSON message

```javascript
await socket.sendJsonMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    conversation: 'Hello!'
  }
);
```

### Send action poll

```javascript
const poll = await socket.sendActionPoll(
  '628XXXXXXXXXX@s.whatsapp.net',
  'Choose an action',
  [
    { vote: 'Option A', action: 'action_a' },
    { vote: 'Option B', action: 'action_b' }
  ]
);
```

### Send album

```javascript
await socket.sendAlbumMessage(
  '628XXXXXXXXXX@s.whatsapp.net',
  [
    './image1.jpg',
    './image2.jpg',
    './video.mp4'
  ]
);
```

### Send status mention

```javascript
await socket.sendStatusMention(
  '628XXXXXXXXXX@s.whatsapp.net',
  {
    extendedTextMessage: {
      text: 'Hello from ReyCodeBaileys'
    }
  }
);
```

### Other available helpers

- `resolvePollAction()`
- `sendRichResponse()`
- `sendButtonsMessage()`
- `sendListMessage()`
- `sendCarouselMessage()`
- `forwardMessage()`
- `sendVCard()`
- `broadcastMessage()`

Check the implementation and method signatures before using advanced helpers.

---

## Browser Identity

ReyCodeBaileys provides browser identity presets.

```javascript
import { Browsers } from 'reycode-baileys';

const browser = Browsers.reycode('Chrome');
```

Other presets include:

- `Browsers.macOS()`
- `Browsers.windows()`
- `Browsers.android()`
- `Browsers.iOS()`
- `Browsers.ubuntu()`
- `Browsers.baileys()`

---

## Security

- Never publish authentication credentials.
- Keep session directories and database files private.
- Never share pairing codes with untrusted people.
- Protect your server and application environment.
- Avoid unsolicited or bulk messaging.

---

## Newsletter Module

The repository contains a separate newsletter socket implementation in:

`lib/Socket/newsletter.js`

The main `makeWASocket()` constructor currently does not include that socket layer.

The newsletter module should therefore not be assumed to run automatically when creating the main socket.

---

## Credits

ReyCodeBaileys is derived from:

- [NxBaileys](https://github.com/NazCodexID/NxBaileys)
- [Baileys by WhiskeySockets](https://github.com/WhiskeySockets/Baileys)

Original Baileys was created by Adhiraj Singh and is maintained by the WhiskeySockets community.

We acknowledge the upstream maintainers and contributors whose work makes this project possible.

See [LICENSE](LICENSE) for copyright and license information.

---

## Disclaimer

ReyCodeBaileys is an independent, unofficial project.

It is not affiliated with, endorsed by, or officially connected to WhatsApp or Meta.

Use this library responsibly and respect WhatsApp's Terms of Service.

The maintainers are not responsible for misuse of this software.

---

<div align="center">

**ReyCodeBaileys**

Developed and maintained by **ReyCodeDGTL**

[GitHub Repository](https://github.com/reycode-lt/ReyCodeBaileys)

</div>

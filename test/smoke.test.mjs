
// Smoke test: the package imports and its main public exports are reachable.
// Uses only Node's built-in test runner. Does NOT open a WhatsApp connection.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import makeWASocket, * as baileys from '../lib/index.js';

test('default export is makeWASocket', () => {
    assert.equal(typeof makeWASocket, 'function');
    assert.equal(baileys.default, makeWASocket);
});

test('core public exports are present', () => {
    for (const name of [
        'makeInMemoryStore',
        'makeCacheManagerStore',
        'fetchLatestBaileysVersion',
        'fetchLatestWaWebVersion',
        'Browsers',
        'DisconnectReason',
        'jidDecode',
        'isInteropUser',
        'useSqliteAuthState',
        'buildZipArchive',
        'USyncQuery'
    ]) {
        assert.notEqual(
            baileys[name],
            undefined,
            `missing export: ${name}`
        );
    }
});

test('ReyCode browser identity', () => {
    assert.deepEqual(
        baileys.Browsers.reycode('Chrome'),
        ['ReyCodeDGTL', 'Chrome', '1.0.0']
    );
});

test('legacy PouCode browser alias remains backward compatible', () => {
    assert.deepEqual(
        baileys.Browsers.poucode('Chrome'),
        ['ReyCodeDGTL', 'Chrome', '1.0.0']
    );
});

test('DisconnectReason values are stable', () => {
    assert.equal(baileys.DisconnectReason.connectionClosed, 428);
    assert.equal(baileys.DisconnectReason.loggedOut, 401);
});

test('JID helpers', () => {
    assert.equal(
        baileys.jidDecode('6281260512743@s.whatsapp.net').user,
        '6281260512743'
    );

    assert.equal(baileys.isInteropUser('abc@interop'), true);
    assert.equal(
        baileys.isInteropUser('6281260512743@s.whatsapp.net'),
        false
    );
});

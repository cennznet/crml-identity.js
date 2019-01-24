// Copyright 2019 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Api} from '@cennznet/api';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import {WsProvider} from '@cennznet/api/polkadot';
import {stringToU8a} from '@cennznet/util';
import {Attestation} from '../src/Attestation';

const issuer = {
    address: '5FPCjwLUkeg48EDYcW5i4b45HLzmCn4aUbx5rsCsdtPbTsKT',
    seed: stringToU8a(('cennznetjstest' as any).padEnd(32, ' ')),
};

const issuer2 = {
    address: '5Cm5QBfzcdAoJmzaqWeAHpD54F2o3ivGhyH4gkF9dxnni7gT',
    seed: stringToU8a(('cennznetjstest3' as any).padEnd(32, ' ')),
};

const holder = {
    address: '5EfqejHV2xUUTdmUVBH7PrQL3edtMm1NQVtvCgoYd8RumaP3',
    seed: stringToU8a(('cennznetjstest2' as any).padEnd(32, ' ')),
};

const topic = 'passport';
const invalidTopic = '\npassport';
// hex of string 'identity'
const valueHex = '0x6964656e74697479';

const passphrase = 'passphrase';

describe('Attestation APIs', () => {
    let api: Api;
    let attestation: Attestation;
    beforeAll(async () => {
        const websocket = new WsProvider('wss://cennznet-node-0.centrality.cloud:9944');
        api = await Api.create({provider: websocket});
        const simpleKeyring: SimpleKeyring = new SimpleKeyring();
        simpleKeyring.addFromSeed(issuer.seed);
        simpleKeyring.addFromSeed(issuer2.seed);
        const wallet = new Wallet();
        await wallet.createNewVault(passphrase);
        await wallet.addKeyring(simpleKeyring);
        api.setSigner(wallet);
        attestation = await Attestation.create(api);
    });

    describe('setClaim', () => {
        it('should fail if value is not hex', async done => {
            try {
                await attestation.setClaim(holder.address, topic, 'not hex');
                done('should error');
            } catch (err) {
                expect(err.message).toBe(
                    'Value must be a hex string of max length of 64 or a Uint8Array of max length 32'
                );
                done();
            }
        });

        it('should fail if only hex prefix', async done => {
            try {
                await attestation.setClaim(holder.address, topic, '0x');
                done('should error');
            } catch (err) {
                expect(err.message).toBe(
                    'Value must be a hex string of max length of 64 or a Uint8Array of max length 32'
                );
                done();
            }
        });

        it('should fail if value not a string or u8a', async done => {
            try {
                await attestation.setClaim(holder.address, topic, <any>true);
                done('should error');
            } catch (err) {
                expect(err.message).toBe(
                    'Value must be a hex string of max length of 64 or a Uint8Array of max length 32'
                );
                done();
            }
        });

        it('should fail if converted hex string invalid', async done => {
            try {
                await attestation.setClaim(holder.address, topic, new Uint8Array());
                done('should error');
            } catch (err) {
                expect(err.message).toBe(
                    'Value must be a hex string of max length of 64 or a Uint8Array of max length 32'
                );
                done();
            }
        });

        it('should fail if topic is invalid', async done => {
            try {
                await attestation.setClaim(holder.address, invalidTopic, valueHex);
                done('should error');
            } catch (err) {
                expect(err.message).toBe(
                    'Topic must be an ASCII string with no characters that cannot be seen on a standard US keyboard'
                );
                done();
            }
        });
    });
});

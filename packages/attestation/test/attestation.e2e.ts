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

/**
 * Get more fund from https://cennznet-faucet-ui.centrality.me/ if the sender account does not have enough fund
 */
import {Api} from '@cennznet/api';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import {WsProvider} from '@cennznet/api/polkadot';
import {hexToU8a} from '@cennznet/util';
import {Attestation} from '../src/Attestation';
import {stripZeroesFromHex, u256ToString} from '../src/util';

const issuer = {
    address: '5DXUeE5N5LtkW97F2PzqYPyqNkxqSWESdGSPTX6AvkUAhwKP',
    uri: '//cennznet-js-test',
};

const issuer2 = {
    address: '5Cfi3s5oFypVtcSut1SLLyomz86nnZbG3YuR3CL2XwuJKFLw',
    uri: '//Centrality',
};

const holder = {
    address: '5HGiumVNPXBWB4ikWzwYxQ8miNJUiiHwUqupZQ3T8sYPE21k',
    uri: '//Frank',
};

const topic = 'passport';
// hex of string 'identity'
const valueHex = '0x6964656e74697479';
const valueCodec = {
    toHex: () => valueHex,
    toU8a: () => hexToU8a(valueHex),
};

const topic2 = 'over18';
const valueHex2 = '0x12121212121234a1';
const valueCodec2 = {
    toHex: () => valueHex2,
    toU8a: () => hexToU8a(valueHex2),
};

const passphrase = 'passphrase';

describe('Attestation APIs', () => {
    let api: Api;
    let attestation: Attestation;
    beforeAll(async () => {
        const websocket = new WsProvider('wss://cennznet-node-0.centrality.me:9944');
        api = await Api.create({provider: websocket});
        const simpleKeyring: SimpleKeyring = new SimpleKeyring();
        simpleKeyring.addFromUri(issuer.uri);
        simpleKeyring.addFromUri(issuer2.uri);

        const wallet = new Wallet();
        await wallet.createNewVault(passphrase);
        await wallet.addKeyring(simpleKeyring);
        api.setSigner(wallet);
        attestation = await Attestation.create(api);
    });

    afterAll(() => {
        ((api as any)._rpc._provider as any).websocket.onclose = null;
        ((api as any)._rpc._provider as any).websocket.close();
    });

    describe('Set Claims', () => {
        it('should create a claim', async done => {
            const claim = await attestation.setClaim(holder.address, topic, valueHex);

            await claim.signAndSend(issuer.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                }
            });
        });

        it('should create a claim with a u8a', async done => {
            const hexVal = '0x54321289811255667788';
            const otherTopic = 'randomTopic';
            const u8a = hexToU8a(hexVal);
            const claim = await attestation.setClaim(holder.address, otherTopic, u8a);

            await claim.signAndSend(issuer.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();

                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(otherTopic);
                    expect(stripZeroesFromHex(data[3])).toBe(hexVal);
                    done();
                }
            });
        });

        it('should create a self claim', async done => {
            const claim = await attestation.setSelfClaim(topic, valueHex);

            await claim.signAndSend(issuer.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(issuer.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                }
            });
        });
    });

    describe('Get Claim', () => {
        it('should get a claim with a specific issuer and holder', async done => {
            const claim = await attestation.getClaim(holder.address, issuer.address, topic);

            expect(claim.toHex()).toEqual(valueCodec.toHex());
            expect(claim.toU8a()).toEqual(valueCodec.toU8a());
            done();
        });
    });

    describe('Create Multiple Claims', () => {
        it('should create a claim with issuer 1 and topic 1', async done => {
            const claim = await attestation.setClaim(holder.address, topic, valueHex);

            await claim.signAndSend(issuer.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                }
            });
        });

        it('should create a claim with issuer 1 and topic 2', async done => {
            const claim = await attestation.setClaim(holder.address, topic2, valueHex2);

            await claim.signAndSend(issuer.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic2);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex2);
                    done();
                }
            });
        });

        it('should create a claim with issuer 2 and topic 1', async done => {
            const claim = await attestation.setClaim(holder.address, topic, valueHex);
            await claim.signAndSend(issuer2.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer2.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                }
            });
        });

        it('should create a claim with issuer 2 and topic 2', async done => {
            const claim = await attestation.setClaim(holder.address, topic2, valueHex2);

            await claim.signAndSend(issuer2.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer2.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic2);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex2);
                    done();
                }
            });
        });
    });

    describe('Get Mutiple Claims Claim', () => {
        it('should get a claim with a specific issuer and holder', async done => {
            const {claims} = await attestation.getClaims(
                holder.address,
                [issuer.address, issuer2.address],
                [topic, topic2]
            );

            expect(claims[topic][issuer.address].toHex()).toEqual(valueCodec.toHex());
            expect(claims[topic][issuer.address].toU8a()).toEqual(valueCodec.toU8a());

            expect(claims[topic][issuer2.address].toHex()).toEqual(valueCodec.toHex());
            expect(claims[topic][issuer2.address].toU8a()).toEqual(valueCodec.toU8a());

            expect(claims[topic2][issuer.address].toHex()).toEqual(valueCodec2.toHex());
            expect(claims[topic2][issuer.address].toU8a()).toEqual(valueCodec2.toU8a());

            expect(claims[topic2][issuer2.address].toHex()).toEqual(valueCodec2.toHex());
            expect(claims[topic2][issuer2.address].toU8a()).toEqual(valueCodec2.toU8a());

            done();
        });

        it('claims should have a claimsAsHex with values converted to hex', async done => {
            const claims = await attestation.getClaims(
                holder.address,
                [issuer.address, issuer2.address],
                [topic, topic2]
            );

            const expected = {
                [topic]: {
                    [issuer.address]: valueCodec.toHex(),
                    [issuer2.address]: valueCodec.toHex(),
                },
                [topic2]: {
                    [issuer.address]: valueCodec2.toHex(),
                    [issuer2.address]: valueCodec2.toHex(),
                },
            };

            expect(claims.claimsAsHex()).toEqual(expected);

            done();
        });

        it('claims should have a claimsAsU8a with values converted to u8a', async done => {
            const claims = await attestation.getClaims(
                holder.address,
                [issuer.address, issuer2.address],
                [topic, topic2]
            );

            const expected = {
                [topic]: {
                    [issuer.address]: valueCodec.toU8a(),
                    [issuer2.address]: valueCodec.toU8a(),
                },
                [topic2]: {
                    [issuer.address]: valueCodec2.toU8a(),
                    [issuer2.address]: valueCodec2.toU8a(),
                },
            };

            expect(claims.claimsAsU8a()).toEqual(expected);

            done();
        });
    });

    describe('Remove Claims', () => {
        it('should remove a claim', async done => {
            const claim = await attestation.removeClaim(holder.address, topic);

            // Expect holders to match
            await claim.signAndSend(issuer.address, async ({events, status}) => {
                if (status.isFinalized && events !== undefined) {
                    const {data} = events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    done();
                }
            });
        });
    });
});

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
import {ApiRx} from '@cennznet/api';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import {WsProvider} from '@cennznet/api/polkadot';
import {hexToU8a, stringToU8a} from '@cennznet/util';
import {AttestationRx} from '../src/AttestationRx';
import {u256ToString, stripZeroesFromHex} from '../src/util';
import {filter, first} from 'rxjs/operators';

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

describe('AttestationRx APIs', () => {
    let api: ApiRx;
    let attestation: AttestationRx;
    beforeAll(async () => {
        const websocket = new WsProvider('wss://cennznet-node-0.centrality.cloud:9944');
        api = await ApiRx.create({provider: websocket}).toPromise();
        const simpleKeyring: SimpleKeyring = new SimpleKeyring();
        simpleKeyring.addFromSeed(issuer.seed);
        simpleKeyring.addFromSeed(issuer2.seed);
        const wallet = new Wallet();
        await wallet.createNewVault(passphrase);
        await wallet.addKeyring(simpleKeyring);
        api.setSigner(wallet);
        attestation = await AttestationRx.create(api).toPromise();
    });

    afterAll(() => {
        ((api as any)._rpc._provider as any).websocket.onclose = null;
        ((api as any)._rpc._provider as any).websocket.close();
    });

    describe('Set Claims', () => {
        it('should create a claim', done => {
            const claim = attestation.setClaim(holder.address, topic, valueHex);

            claim
                .signAndSend(issuer.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    }),
                    first()
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                });
        });

        it('should create a self claim', done => {
            const claim = attestation.setSelfClaim(topic, valueHex);

            claim
                .signAndSend(issuer.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    }),
                    first()
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(issuer.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                });
        });
    });

    describe('Get Claim', () => {
        it('should get a claim with a specific issuer and holder', done => {
            attestation.getClaim(holder.address, issuer.address, topic).subscribe(claim => {
                expect(claim.toHex()).toBe(valueCodec.toHex());
                expect(claim.toU8a()).toEqual(valueCodec.toU8a());

                done();
            });
        });
    });

    describe('Create Multiple Claims', () => {
        it('should create a claim with issuer 1 and topic 1', done => {
            const claim = attestation.setClaim(holder.address, topic, valueHex);

            claim
                .signAndSend(issuer.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    })
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                });
        });

        it('should create a claim with issuer 1 and topic 2', done => {
            const claim = attestation.setClaim(holder.address, topic2, valueHex2);

            claim
                .signAndSend(issuer.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    })
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic2);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex2);
                    done();
                });
        });

        it('should create a claim with issuer 2 and topic 1', done => {
            const claim = attestation.setClaim(holder.address, topic, valueHex);

            claim
                .signAndSend(issuer2.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    })
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer2.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex);
                    done();
                });
        });

        it('should create a claim with issuer 2 and topic 2', done => {
            const claim = attestation.setClaim(holder.address, topic2, valueHex2);

            claim
                .signAndSend(issuer2.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    })
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer2.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic2);
                    expect(stripZeroesFromHex(data[3])).toBe(valueHex2);
                    done();
                });
        });
    });

    describe('Get Mutiple Claims Claim', () => {
        it('should get a claim with a specific issuer and holder', done => {
            attestation
                .getClaims(holder.address, [issuer.address, issuer2.address], [topic, topic2])
                .subscribe(({claims}) => {
                    expect(claims[topic][issuer.address].toHex()).toEqual(valueCodec.toHex());
                    expect(claims[topic][issuer.address].toU8a()).toEqual(valueCodec.toU8a());

                    expect(claims[topic][issuer2.address].toHex()).toEqual(valueCodec.toHex());
                    expect(claims[topic][issuer2.address].toU8a()).toEqual(valueCodec.toU8a());

                    expect(claims[topic2][issuer.address].toHex()).toEqual(valueCodec2.toHex());
                    expect(claims[topic2][issuer.address].toU8a()).toEqual(valueCodec2.toU8a());

                    expect(claims[topic2][issuer2.address].toHex()).toEqual(valueCodec2.toHex());
                    expect(claims[topic2][issuer2.address].toU8a()).toEqual(valueCodec2.toU8a());
                });
            done();
        });
    });

    describe('Remove Claims', () => {
        it('should remove a claim', done => {
            const claim = attestation.removeClaim(holder.address, topic);

            // Expect holders to match
            claim
                .signAndSend(issuer.address)
                .pipe(
                    filter(result => {
                        return result.type === 'Finalised' && result.events !== undefined;
                    })
                )
                .subscribe(result => {
                    const {data} = result.events[0].event.toJSON();
                    expect(data[0]).toBe(holder.address);
                    // Expect issuers to match
                    expect(data[1]).toBe(issuer.address);
                    // expect topic to match
                    expect(u256ToString(data[2])).toEqual(topic);
                    done();
                });
        });
    });
});

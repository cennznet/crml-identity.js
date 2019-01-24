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

import {claimsMapper} from './getClaims';

describe('claimsMapper', () => {
    it('should take an fn and apply it to all the values', () => {
        const input = {
            'a topic': {
                'an Issuer': {toHex: () => '0x123', toU8a: () => new Uint8Array()},
                'another issuer': {toHex: () => '0x1234', toU8a: () => new Uint8Array()},
            },
            'another topic': {
                'an Issuer': {toHex: () => '0x1235', toU8a: () => new Uint8Array()},
            },
        };

        const mapper = val => `${val.toHex()}555`;

        const expected = {
            'a topic': {
                'an Issuer': '0x123555',
                'another issuer': '0x1234555',
            },
            'another topic': {
                'an Issuer': '0x1235555',
            },
        };
        const result = claimsMapper(mapper, input)();

        expect(result).toEqual(expected);
    });
});

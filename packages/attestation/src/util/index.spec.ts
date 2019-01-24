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

import {padStartHexString, stripZeroesFromHex} from '.';

describe('padStartHexString', () => {
    it('should succeed with a hex string with prefix', () => {
        const res = padStartHexString('0x12345', 64);

        const expected = '0x0000000000000000000000000000000000000000000000000000000000012345';
        expect(res).toEqual(expected);
    });

    it('should succeed with a hex string with no prefix', () => {
        const res = padStartHexString('54321', 64);

        const expected = '0000000000000000000000000000000000000000000000000000000000054321';
        expect(res).toEqual(expected);
    });
});

describe('stripZeroesFromHex', () => {
    it('should strip 0s from a hex string', () => {
        const input = '0x0000003000';

        const result = stripZeroesFromHex(input);

        const expected = '0x3000';
        expect(result).toEqual(expected);
    });

    it('should return empty hex if input was empty', () => {
        const input = '0x';

        const result = stripZeroesFromHex(input);

        const expected = '0x';
        expect(result).toEqual(expected);
    });

    it('should do nothing with no zeroes in front', () => {
        const input = '0x400300500';

        const result = stripZeroesFromHex(input);

        const expected = '0x400300500';
        expect(result).toEqual(expected);
    });

    it('should do nothing if no 0x prefix', () => {
        const input = '000400300500';

        const result = stripZeroesFromHex(input);

        const expected = '000400300500';
        expect(result).toEqual(expected);
    });
});

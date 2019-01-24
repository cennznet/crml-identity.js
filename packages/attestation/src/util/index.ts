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

import {numberToU8a, stringToU8a, u8aToHex, u8aToString} from '@cennznet/util';

export function stringToHex(str: string): string {
    return u8aToHex(stringToU8a(str));
}

export function u256ToString(claim): string {
    let data = claim;
    if (typeof claim === 'string') {
        data = claim.replace(/^0x0*/, '0x');
    }
    const u8a = numberToU8a(data);
    const str = u8aToString(u8a);
    return str;
}

export function padStartHexString(hexString: string, maxLength: number = 64, fillString: string = '0') {
    const hasPrefix = hexString.slice(0, 2).toLowerCase() === '0x';

    const hexData = hasPrefix ? hexString.slice(2) : hexString;

    const paddedData = hexData.padStart(maxLength, fillString);
    return hasPrefix ? `0x${paddedData}` : paddedData;
}

// eg 0x000003 -> 0x3
export function stripZeroesFromHex(hexString: string) {
    return hexString.replace(/^(0x|0X)0+/, '0x');
}

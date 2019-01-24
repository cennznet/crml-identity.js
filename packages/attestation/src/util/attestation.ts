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

import {u8aToHex} from '@cennznet/util';

// TODO move this validation logic into AttestationTopic/AttestationValue types
const isAscii = (str: string) => {
    return /^[\x20-\x7F]*$/.test(str);
};
const validateTopic = (topic: string) => {
    if (topic.length > 32) {
        throw new Error('Topic cannot exceed 32 characters');
    }
    if (!isAscii(topic)) {
        throw new Error(
            'Topic must be an ASCII string with no characters that cannot be seen on a standard US keyboard'
        );
    }
};

const validateValue = (value: string | Uint8Array) => {
    if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
        throw new Error('Value must be a hex string of max length of 64 or a Uint8Array of max length 32');
    }
};

const validateValueHex = value => {
    const isHexWith1To64CharsRegex = /^(0x|0X)?[a-fA-F0-9]{1,64}$/;
    if (!isHexWith1To64CharsRegex.test(value)) {
        throw new Error('Value must be a hex string of max length of 64 or a Uint8Array of max length 32');
    }
};

const getValueHex = (value: string | Uint8Array): string => {
    const valueHex = value instanceof Uint8Array ? u8aToHex(<Uint8Array>value) : <string>value;

    validateValueHex(valueHex);
    return valueHex;
};

export {validateTopic, validateValue, getValueHex};

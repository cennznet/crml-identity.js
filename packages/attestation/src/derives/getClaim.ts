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

import {ApiInterface$Rx} from '@cennznet/api/polkadot.types';
import {hexToU8a} from '@cennznet/util';
import {drr} from '@plugnet/api-derive/util/drr';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {AttestationValue} from '../types';
import {stringToHex, stripZeroesFromHex} from '../util';
import {validateTopic} from '../util/attestation';

export function getClaim(api: ApiInterface$Rx) {
    return (holder: string, issuer: string, topic: string): Observable<AttestationValue> => {
        validateTopic(topic);
        const topicHex = stringToHex(topic);

        return api.query.attestation.values([holder, issuer, topicHex]).pipe(
            map(value => {
                const hex = stripZeroesFromHex(value.toHex());
                return {
                    toHex: () => hex,
                    toU8a: () => hexToU8a(hex),
                };
            }),
            drr()
        );
    };
}

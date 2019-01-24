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
import {SubmittableExtrinsic} from '@cennznet/api/polkadot.types';
import {Hash} from '@cennznet/types/polkadot';
import {assert} from '@cennznet/util';
import * as derives from './derives';
import {QueryableGetClaim, QueryableGetClaims} from './types';
import {stringToHex} from './util';
import {getValueHex, validateTopic, validateValue} from './util/attestation';

export class Attestation {
    static async create(api: Api): Promise<Attestation> {
        if ((api as any).attestation) {
            return (api as any).attestation;
        }
        (api as any)._options.derives = {...(api as any)._options.derives, attestation: derives};
        await (api as any).loadMeta();
        return new Attestation(api);
    }

    private _api: Api;

    constructor(api: Api) {
        assert(
            (api as any)._options.derives.attestation || ((api as any)._derive || {}).attestation,
            "init attestation's derives first"
        );
        this._api = api;
    }

    get api(): Api {
        return this._api;
    }

    setClaim(
        holder: string,
        topic: string,
        value: string | Uint8Array
    ): SubmittableExtrinsic<Promise<Hash>, Promise<() => any>> {
        validateTopic(topic);
        validateValue(value);
        const topicHex = stringToHex(topic);
        const valueHex = getValueHex(value);

        return this.api.tx.attestation.setClaim(holder, topicHex, valueHex);
    }

    setSelfClaim(topic: string, value: string | Uint8Array): SubmittableExtrinsic<Promise<Hash>, Promise<() => any>> {
        validateTopic(topic);
        validateValue(value);
        const topicHex = stringToHex(topic);
        const valueHex = getValueHex(value);
        return this.api.tx.attestation.setSelfClaim(topicHex, valueHex);
    }

    removeClaim(holder: string, topic: string): SubmittableExtrinsic<Promise<Hash>, Promise<() => any>> {
        validateTopic(topic);
        const topicHex = stringToHex(topic);
        return this.api.tx.attestation.removeClaim(holder, topicHex);
    }

    get getClaim(): QueryableGetClaim {
        return this.api.derive.attestation.getClaim as any;
    }

    get getClaims(): QueryableGetClaims {
        return this.api.derive.attestation.getClaims as any;
    }
}

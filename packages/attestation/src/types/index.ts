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

import {Observable} from 'rxjs';

export type AttestationValue = {toHex: () => string; toU8a: () => Uint8Array};
export type Claim = {holder: string; issuer: string; topic: string; value: AttestationValue};

export type Claims = {[topic: string]: {[issuers: string]: AttestationValue}};
export type ClaimsAsHex = {[topic: string]: {[issuers: string]: string}};
export type ClaimsAsU8a = {[topic: string]: {[issuers: string]: Uint8Array}};
export type ClaimsAsHexFunc = () => ClaimsAsHex;
export type ClaimsAsU8aFunc = () => ClaimsAsU8a;

export type ClaimsObject = {
    claims: Claims;
    claimsAsHex: ClaimsAsHexFunc;
    claimsAsU8a: ClaimsAsU8aFunc;
};

export interface QueryableGetClaim {
    (holder: string, issuer: string, topic: string): Promise<AttestationValue>;
    (holder: string, issuer: string, topic: string, callbackFn: any): Promise<() => any>;
}

export interface QueryableGetClaims {
    (holder: string, issuers: Array<string>, topic: Array<string>): Promise<ClaimsObject>;
    (holder: string, issuers: Array<string>, topic: Array<string>, callbackFn: any): Promise<() => any>;
}

export interface QueryableGetClaimRx {
    (holder: string, issuer: string, topic: string): Observable<AttestationValue>;
}

export interface QueryableGetClaimsRx {
    (holder: string, issuers: Array<string>, topic: Array<string>): Observable<ClaimsObject>;
}

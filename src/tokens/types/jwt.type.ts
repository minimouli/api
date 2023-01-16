/**
 * Copyright (c) Minimouli
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface JwtApplicationPayload {
    jti: string
    sub: string
}

interface JwtPayload extends JwtApplicationPayload {
    iat: string
    exp: string
}

export type {
    JwtApplicationPayload,
    JwtPayload
}

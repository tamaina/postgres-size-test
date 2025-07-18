# postgres-size-test
MisskeyのPostgreSQLの各種サイズを検証するためのテストです。

## How to run tests
### Setup
1. `docker compose up -d` to start the PostgreSQL database.
2. `pnpm install` to install dependencies.
3. `pnpm run build` to build the project for migration.
4. `pnpm run migrate` to run migrations.

### Run
1. `pnpm run test` to run the tests.

## Suites
### note.ts
ノート本文の削除をするのにDELETEやUPDATE SET text = ''のそれぞれでどのようなサイズの変化があるかを計測します。

Ref. https://github.com/misskey-dev/misskey/discussions/16232

### uri.ts
インデックスのサイズにUNIQUE制約が関係あるかどうか計測します。なぜならMisskeyの中でUNIQUEなインデックスを持つnote.uriが一番大きいからです。

REINDEXの効果も計測します。

Ref. https://github.com/misskey-dev/misskey/discussions/16232#discussioncomment-13799160

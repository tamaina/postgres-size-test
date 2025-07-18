# postgres-size-test
MisskeyのPostgreSQLの各種サイズを検証するためのテストです。

GitHub Actionsで自動的に実行されます。  
https://github.com/tamaina/postgres-size-test/actions/workflows/test.yml

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

#### 結果
```
      === UPDATE, VACUUM: true ===
      Count after UPDATE: 768
      Initial   2025-07-18T01:05:40.890Z
        Note: 24 kB  Whole DB: 6425 kB  PK: 8192 bytes  RN IDX: 8192 bytes
      After inserting 1024 notes        2025-07-18T01:05:40.955Z
        Note: 688 kB  Whole DB: 7089 kB  PK: 48 kB  RN IDX: 16 kB
      After UPDATE      2025-07-18T01:05:40.983Z
        Note: 696 kB  Whole DB: 7097 kB  PK: 56 kB  RN IDX: 16 kB
      After VACUUM      2025-07-18T01:05:41.017Z
        Note: 704 kB  Whole DB: 8145 kB  PK: 56 kB  RN IDX: 16 kB
      After inserting 512 notes (2nd wave)      2025-07-18T01:05:41.042Z
        Note: 896 kB  Whole DB: 8337 kB  PK: 72 kB  RN IDX: 32 kB
      After inserting 512 notes (3rd wave)      2025-07-18T01:05:41.104Z
        Note: 1208 kB  Whole DB: 8649 kB  PK: 88 kB  RN IDX: 32 kB
      After UPDATE secondIds    2025-07-18T01:05:41.119Z
        Note: 1216 kB  Whole DB: 8657 kB  PK: 96 kB  RN IDX: 32 kB
      After VACUUM      2025-07-18T01:05:41.137Z
        Note: 1216 kB  Whole DB: 8705 kB  PK: 96 kB  RN IDX: 32 kB
      After inserting 512 notes (4th wave)      2025-07-18T01:05:41.162Z
        Note: 1272 kB  Whole DB: 8761 kB  PK: 112 kB  RN IDX: 48 kB


      === DELETE, VACUUM: true ===
      Count after DELETE: 768
      Initial   2025-07-18T01:05:41.496Z
        Note: 24 kB  Whole DB: 6425 kB  PK: 8192 bytes  RN IDX: 8192 bytes
      After inserting 1024 notes        2025-07-18T01:05:41.578Z
        Note: 688 kB  Whole DB: 7089 kB  PK: 48 kB  RN IDX: 16 kB
      After DELETE      2025-07-18T01:05:41.596Z
        Note: 688 kB  Whole DB: 7089 kB  PK: 48 kB  RN IDX: 16 kB
      After VACUUM      2025-07-18T01:05:41.626Z
        Note: 696 kB  Whole DB: 8137 kB  PK: 48 kB  RN IDX: 16 kB
      After inserting 512 notes (2nd wave)      2025-07-18T01:05:41.657Z
        Note: 856 kB  Whole DB: 8297 kB  PK: 64 kB  RN IDX: 16 kB
      After inserting 512 notes (3rd wave)      2025-07-18T01:05:41.688Z
        Note: 1176 kB  Whole DB: 8617 kB  PK: 80 kB  RN IDX: 32 kB
      After DELETE secondIds    2025-07-18T01:05:41.707Z
        Note: 1176 kB  Whole DB: 8617 kB  PK: 80 kB  RN IDX: 32 kB
      After VACUUM      2025-07-18T01:05:41.725Z
        Note: 1176 kB  Whole DB: 8665 kB  PK: 80 kB  RN IDX: 32 kB
      After inserting 512 notes (4th wave)      2025-07-18T01:05:41.750Z
        Note: 1192 kB  Whole DB: 8681 kB  PK: 96 kB  RN IDX: 32 kB


      === UPDATE, VACUUM: false ===
      Count after UPDATE: 768
      Initial   2025-07-18T01:05:42.056Z
        Note: 24 kB  Whole DB: 6401 kB  PK: 8192 bytes  RN IDX: 8192 bytes
      After inserting 1024 notes        2025-07-18T01:05:42.093Z
        Note: 688 kB  Whole DB: 7065 kB  PK: 48 kB  RN IDX: 16 kB
      After UPDATE      2025-07-18T01:05:42.108Z
        Note: 696 kB  Whole DB: 7073 kB  PK: 56 kB  RN IDX: 16 kB
      After inserting 512 notes (2nd wave)      2025-07-18T01:05:42.133Z
        Note: 1024 kB  Whole DB: 7401 kB  PK: 72 kB  RN IDX: 32 kB
      After inserting 512 notes (3rd wave)      2025-07-18T01:05:42.159Z
        Note: 1336 kB  Whole DB: 7713 kB  PK: 88 kB  RN IDX: 32 kB
      After UPDATE secondIds    2025-07-18T01:05:42.175Z
        Note: 1360 kB  Whole DB: 7737 kB  PK: 104 kB  RN IDX: 40 kB
      After inserting 512 notes (4th wave)      2025-07-18T01:05:42.198Z
        Note: 1672 kB  Whole DB: 8049 kB  PK: 120 kB  RN IDX: 40 kB


      === DELETE, VACUUM: false ===
      Count after DELETE: 768
      Initial   2025-07-18T01:05:42.551Z
        Note: 24 kB  Whole DB: 6417 kB  PK: 8192 bytes  RN IDX: 8192 bytes
      After inserting 1024 notes        2025-07-18T01:05:42.588Z
        Note: 688 kB  Whole DB: 7081 kB  PK: 48 kB  RN IDX: 16 kB
      After DELETE      2025-07-18T01:05:42.604Z
        Note: 688 kB  Whole DB: 7081 kB  PK: 48 kB  RN IDX: 16 kB
      After inserting 512 notes (2nd wave)      2025-07-18T01:05:42.628Z
        Note: 1008 kB  Whole DB: 7401 kB  PK: 64 kB  RN IDX: 32 kB
      After inserting 512 notes (3rd wave)      2025-07-18T01:05:42.655Z
        Note: 1320 kB  Whole DB: 7713 kB  PK: 80 kB  RN IDX: 32 kB
      After DELETE secondIds    2025-07-18T01:05:42.673Z
        Note: 1320 kB  Whole DB: 7713 kB  PK: 80 kB  RN IDX: 32 kB
      After inserting 512 notes (4th wave)      2025-07-18T01:05:42.697Z
        Note: 1632 kB  Whole DB: 8025 kB  PK: 96 kB  RN IDX: 40 kB
```

#### 考察
- DELETEもUPDATEも、VACUUMを行わないとデータを追加すると肥大化する。
- DELETEもUPDATEも、VACUUMを行えば、データを追加した際に削除された領域が再利用される模様。
- UPDATEはエントリを残すので、インデックスやテーブルのサイズは増える（が想像したよりは効率的に使われている気がする）

### uri.ts
インデックスのサイズにUNIQUE制約が関係あるかどうか計測します。なぜならMisskeyの中でUNIQUEなインデックスを持つnote.uriが一番大きいからです。

REINDEXの効果も計測します。

Ref. https://github.com/misskey-dev/misskey/discussions/16232#discussioncomment-13799160

#### 結果
```
      === URI ===
      Initial   2025-07-18T01:18:47.467Z
        DB: 32 kB  UNIQUE: 8192 bytes  NOT UNIQUE: 8192 bytes
      After inserting 5000 entries      2025-07-18T01:18:47.773Z
        DB: 2312 kB  UNIQUE: 616 kB  NOT UNIQUE: 616 kB
      After VACUUM      2025-07-18T01:18:47.796Z
        DB: 2320 kB  UNIQUE: 616 kB  NOT UNIQUE: 616 kB
      After REINDEX     2025-07-18T01:18:47.830Z
        DB: 2016 kB  UNIQUE: 464 kB  NOT UNIQUE: 464 kB
      After deleting all entries        2025-07-18T01:18:47.836Z
        DB: 2016 kB  UNIQUE: 464 kB  NOT UNIQUE: 464 kB
      After VACUUM      2025-07-18T01:18:47.849Z
        DB: 1128 kB  UNIQUE: 464 kB  NOT UNIQUE: 464 kB
      After REINDEX     2025-07-18T01:18:47.861Z
        DB: 48 kB  UNIQUE: 8192 bytes  NOT UNIQUE: 8192 bytes
```

#### 考察
- UNIQUE制約の有無はインデックスのサイズに影響しない。
- REINDEXはインデックスのサイズを小さくする効果がある。
  * 削除前でもインデックスのサイズ圧縮に効果がありそう
  * 削除後はインデックスのサイズが初期状態のテーブルと同様のサイズになる。
- VACUUMは(postgresのデフォルト設定では?)REINDEXの効果をもたらさない。DELETE後のVACUUMもインデックスのサイズを小さくしない。

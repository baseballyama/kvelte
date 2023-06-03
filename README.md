[日本語版 README はこちら](./README-ja.md)

# ⚠️ This is PoC project. Not for production.

# Kvelte

KotlinユーザーがUIを構築する最速の方法

# 特徴

- 💎 素早くリッチなUIを実現
- 💡 最小限のネットワーク通信量
- 🚀 超高性能レスポンス
- ⛏ FW / ライブラリ非依存
- ⚡️ 組み込みのHMR

### 💎 素早くリッチなUIを実現
Kvelteは、KotlinユーザーがWebアプリケーションを開発する際に、[Svelte](https://svelte.jp/) をテンプレートエンジンとして利用するためのライブラリです。Ktorや Spring Boot といった特定のフレームワークに依存しないので、誰もがすぐにKvelteを使用できます。
[State of JS 2021](https://2021.stateofjs.com/ja-JP/libraries/front-end-frameworks/) によると、Svelteは現在最も多くの人が興味を持っている最先端のフロントエンドフレームワークです。
Svelteは、[公式が提供しているチュートリアル](https://svelte.dev/tutorial/basics) を学習することで、初学者でもすぐにリッチなUIを構築できます。

### 💡 最小限のネットワーク通信量
Svelteはコンパイラです。Svelteファイルは仮想DOMを持たない最小限のJavaScriptにコンパイルされます。また、モジュールバンドラー (Rollup) を使用することにより、未使用のJavaScriptを全て削ぎ落とした最小限のJavaScriptを生成します。これにより、最小限のネットワーク通信量でユーザーにページを配信することができます。

### 🚀 超高性能レスポンス
`Kvelte` は、コンパイルしたSvelteファイルを事前にキャッシュしておき、リクエスト時に必要最小限の処理を実行してレスポンスします。これにより、サーバーサイドの超高性能レスポンスを実現しています。
また、クライアントに配信するHTMLは、静的な部分をレンダリングしたHTMLと動的な部分を処理するJavScriptを両方含むことで、クライアント側での描画性能を最適化しています。(これを一般的にハイドレーションと呼びます)

 ### ⛏ FW / ライブラリ非依存
`kvelte` は、SvelteコンポーネントをHTMLファイルとして提供するライブラリなので、任意のFW、任意のライブラリを利用できます。
これにより、一部のエンドポイントのみSvelteで構築したり、既存のWebアプリケーションを徐々にSvelteに移行することが可能です。

### ⚡️ 組み込みのHMR
`Kvelte` は開発モードにおいてHMR (Hot Module Replacement) をサポートしています。これにより、開発中に変更を加えるとリロードなしにブラウザに反映されます。
これにより、CSSやHTMLの変更を即座に反映することができるので、開発効率が大幅に上昇します。

# デモ

https://kvelte.baseballyama.tokyo


# 前提条件

- Java 11
- Node.js 14 
- npm 6

# 使用方法

## 新しくKvelteアプリを作成する場合

新しくKvelteアプリを作成する場合、以下の4コマンドを実行するだけです

```shell
> npx degit baseballyama/kvelte/template kvelte-app
> cd kvelte-app
> cd ./src/main/resources/kvelte && npm i && cd ../../../../
> ./gradlew run
```

ブラウザで http://localhost にアクセスすると Kvelteアプリが起動します 🎉

## 既存のKotlinアプリにKvelteを組み込む場合

### STEP1 : Install Kvelte-node

```sh
cd ./src/main/resources
mkdir kvelte
cd kvelte
npx degit baseballyama/kvelte/template/src/main/resources/kvelte
npm i
cd ../../../../
```

### STEP2 : Edit `build.gradle`

```kt
dependencies {
  // 1. add deps
  implementation("tokyo.baseballyama:kvelte:0.1.0")
}

buildscript {
  repositories {
    mavenCentral()
  }
  dependencies {
    // 2. add deps for build script
    classpath("tokyo.baseballyama:kvelte:0.1.0")
  }
}

// 3. create task
tasks.create("kvelte") {
  tokyo.baseballyama.kvelte.KvelteBuilder.build(project.projectDir)
}

// 4. register created task BEFORE build
tasks.build {
  this.dependsOn("kvelte")
}
```

### STEP3 : Edit Kotlin files

```kt
routing {
  // 1. add routes for assets
  static("assets") { resources("assets") }

  // 2. add routes for kvelte resources
  get(".kvelte/{...}") {
    call.response.header("Cache-Control", "public, max-age=86400")
    call.respondBytes(
        kvelte.loadJavaScript(call.request.path()),
        ContentType.Text.JavaScript,
    )
  }
}

// 3. add routes for kvelte paths
fun Route.get() {
  get("/") {
    call.respondText(kvelte.loadPage("index.svelte", mapOf("message" to "Kvelte")), ContentType.Text.Html)
  }
}
```

---

# アーキテクチャ

## Dev

![](/docs/images/dev.jpg)

## Build time

![](/docs/images/build.jpg)

## Prod

![](/docs/images/prod.jpg)

# 他の選択肢との比較

## 既存テンプレートエンジン (例: Thymeleaf)

例えば Spring Boot を使用している場合、テンプレートエンジンとして、`FreeMarker` や `Thymeleaf`、`JSP` などを使用できます。
これらのライブラリは、テンプレートエンジン特有の記法を使用して最終的にレンダリングするHTMLをランタイム時に構築します.

`Thymeleaf` の例
```html
<div class="outer">
  <div th:if="${hoge}" th:text="Hello ${hoge}">Hello anonymous</div>
</div>
</html>
```

このように、サーバー側で最終的な `HTML` をクライアントに返却する方法を `SSR` と呼びます。
この方法は、クライアント側での表示は速い傾向にありますが、サーバー側で毎回HTMLを構築する必要があるため一般的に以下の問題があります。

1. レスポンスに時間がかかる
2. サーバー負荷が高くなりがち

また、テンプレートエンジンライブラリには、以下の課題があると考えています。

3. JavaScript / CSSとの親和性が悪い (JavaScriptやCSSを用いた開発体験が考慮されていない)
4. TypeScriptやPugなど、フロントエンド開発者にとって便利なツールを導入できない
5. テンプレートエンジン自体に対する学習コストが高い

`Kvelte` を使用すると、これらの問題を解決できると考えています。
1. 事前にビルドしたHTMLを返却するためレスポンスが高速
2. リクエストの度にHTMLをビルドする必要がないためサーバー負荷を抑えられる
3. Svelteが提供する開発体験により JavaScript / CSS の親和性が高い
4. TypeScriptなど、任意のAlt言語を導入できる
5. Svelteが提供するチュートリアルにより初学者でもすぐに扱うことができる

## Svelte (SPA) + Kotlin APIサーバー

SPA + API サーバーを構築することは、以下の点で開発オーバーヘッドをもたらします。

1. フロントエンドからAPIを実行する処理を記述する必要がありコード量が増える
2. SPAのリソースとAPIサーバーを別々にデプロイする必要がありインフラ管理が煩雑
3. アーキテクチャが複雑になる (責務分離 / APIエラーハンドリング / 無停止デプロイ など)

`Kvelte` を使用すると、これらの問題を解決できると考えています。
1. `kvelte.load` を呼び出すだけで最終的なHTMLを取得できるのでコードが増えない
2. Kotlinのアプリだけをデプロイすれば良いのでインフラ管理が楽
3. Svelteはテンプレートエンジンとして描画のみを担当するためアーキテクチャの考慮が不要

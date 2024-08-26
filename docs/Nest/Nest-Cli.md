# Nest-Cli

> 项目开发离不开工程化，`Nest`为开发者提供了工程化的能力。
>
> `Nest`在`@nestjs/cli `包内提供了命令以供快速开发。



### 安装

共两种安装方式，`npx`和`npm`方式。



#### npx

```bash
npx @nestjs/cli new 项目名
```

执行完之后`npm`会把这个包下载下来然后执行初始化项目。



#### npm

```bash
npm install -g @nestjs/cli

nest new 项目名
```

更推荐这种方式，不过有一个缺点就是需要时不时地进行更新包，否则包可能不是最新版本。

```bash
npm update -g @nestjs/cli
```



### 命令

`@nestjs/cli `中有很多命令能够进行快速开发，执行`nest -h`查看全部命令。

```bash
// 执行下面语句查看常用命令
@logg:~/code(master⚡) »  nest -h

Usage: nest <command> [options]

Options:
  -v, --version                                   Output the current version.
  -h, --help                                      Output usage information.

Commands:
  new|n [options] [name]                          Generate Nest application.
  build [options] [app]                           Build Nest application.
  start [options] [app]                           Run Nest application.
  info|i                                          Display Nest project details.
  add [options] <library>                         Adds support for an external library to your project.
  generate|g [options] <schematic> [name] [path]  Generate a Nest element.
    Schematics available on @nestjs/schematics collection:
      ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
      │ name          │ alias       │ description                                  │
      │ application   │ application │ Generate a new application workspace         │
      │ class         │ cl          │ Generate a new class                         │
      │ configuration │ config      │ Generate a CLI configuration file            │
      │ controller    │ co          │ Generate a controller declaration            │
      │ decorator     │ d           │ Generate a custom decorator                  │
      │ filter        │ f           │ Generate a filter declaration                │
      │ gateway       │ ga          │ Generate a gateway declaration               │
      │ guard         │ gu          │ Generate a guard declaration                 │
      │ interceptor   │ itc         │ Generate an interceptor declaration          │
      │ interface     │ itf         │ Generate an interface                        │
      │ library       │ lib         │ Generate a new library within a monorepo     │
      │ middleware    │ mi          │ Generate a middleware declaration            │
      │ module        │ mo          │ Generate a module declaration                │
      │ pipe          │ pi          │ Generate a pipe declaration                  │
      │ provider      │ pr          │ Generate a provider declaration              │
      │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
      │ resource      │ res         │ Generate a new CRUD resource                 │
      │ service       │ s           │ Generate a service declaration               │
      │ sub-app       │ app         │ Generate a new application within a monorepo │
      └───────────────┴─────────────┴──────────────────────────────────────────────┘

```

可以看到一共有6个命令可供使用，基本都是常用命令。



#### 命令汇总

将常用的命令汇总，以供自己开发忘记时查阅。

```bash
// 初始化项目 
// --skip-git 跳过 git 初始化
// --skip-install 跳过 npm 安装
// --package-manager 或 -p 指定包管理器，
// --language 指定 typescript 或 javascript
// --strict 是指定 ts 的编译是否开启严格模式
nest new 项目名称 -p npm

// 生成 module，xxx 为 module 名称， mo 为 module 缩写，两个命令等效
nest generate module xxx
nest g mo xxx

// 生成 controller，xxx 为 controller 名称, co 为 controller 缩写，两个命令等效
nest generate controller xxx
nest g co xxx

// 生成 service，xxx 为 service 名称，s 为 service 缩写，两个命令等效
nest generate service xxx
nest g s xxx

// 一次性生成 module、controller、service，xxx 为几个文件的名称，g 为 generate 缩写，res 为resource缩写
nest generate resource xxx
nest g res xxx

// 生成 filter（过滤器），xxx 为 filter 名称，f 为 filter 缩写，两个命令等效
nest generate filter xxx
nest g f xxx

// 生成 middle（中间件），xxx 为 middle 名称，mi 为 middle 缩写，两个命令等效
nest generate middleware xxx
nest g mi xxx

// 生成 interceptor（拦截器），xxx 为 interceptor 名称，itc 为 interceptor 缩写，两个命令等效
nest generate interceptor xxx 
nest g itc xxx

// 生成 guard （守卫），xxx 为 guard 名称，gu 为 guard 缩写，两个命令等效
nest generate guard xxx 
nest g gu xxx

// 生成 decorator（自定义装饰器），xxx 为 decorator 名称，d 为 decorator 缩写，两个命令等效
nest generate decorator xxx
nest g d xxx

// 构建项目
nest build
```



#### 参数汇总

`nest generate` 参数（选项）很多，在这里整理一下，以供自己开发忘记时查阅。

```bash
// -flat 和 --no-flat 指定是否生成对应目录， -flat 为平铺（不生成目录）， --no-flat 为不平铺（生成目录）
nest generate resource xxx -flat

// --spec 和 --no-spec 指定是否生成测试文件， --spec 为生成测试文件， --no-spec 为不生成测试文件
nest generate resource xxx -flat --no-spec

// --skip-import 指定不在 AppModule 里引入（即 @module 装饰器中的 controllers 参数不引入）
nest generate controller xxx --skip-import
```



### 配置文件

在初始化项目时根目录下会生成`nest-cli.json`文件，如果没有的话自行创建，基础内容如下：

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  },
}
```



#### 不生成测试文件

在上面命令章节中，每次都会生成测试文件，如果需要指定不生成测试文件，则需要添加`--no-spec`，每次添加都很麻烦，因此可以在`nest-cli.json`中进行配置每次执行命令时不生成测试文件。

配置生成文件的参数都在`generateOptions`下进行配置，初始文件没有，因此需要新增，新增后内容如下

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  },
  "generateOptions": {
    "spec": false
  }
}
```

之后直接执行`nest generate resource xxx`就不会生成测试文件了



#### 自动生成目录

在`generateOptions`新增`flat`的`key`，设置为`false`即可。

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  },
  "generateOptions": {
    "spec": false,
    "flat": false,
  }
}
```

之后直接执行`nest generate resource xxx`就会自动生成目录了



#### 查阅文档

详细配置可以在下面的文档查阅

https://docs.nestjs.com/cli/monorepo#global-generate-options


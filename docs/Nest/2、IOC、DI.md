# IOC、DI

> `IOC`是`Inverse of Control`的缩写，中文名：「**控制反转**」或「**依赖倒置**」。
>
> `DI`是`Dependency Injection`的缩写，中文名：「**依赖注入**」。

[前端中的IoC理念]: https://juejin.cn/post/6844903750843236366	"本文参考"

例子、内容与原文很大一部分一样，本文仅作为整理并整合为笔记，不作盈利。如有侵权，请联系笔者删除。



### IOC 是什么

它不是一个具体的技术，而是一个实现对象解耦的思想。其中包含三个准则：



#### 高层次的模块不应该依赖于低层次的模块，它们都应该依赖于抽象

假设需要构建一款应用叫 `App`，它包含一个路由模块 `Router` 和一个页面监控模块 `Track`，一开始可能会这么实现：

```js
// app.js
import Router from './modules/Router';
import Track from './modules/Track';

class App {
    constructor(options) {
        this.options = options;
        this.router = new Router();
        this.track = new Track();

        this.init();
    }

    init() {
        window.addEventListener('DOMContentLoaded', () => {
            this.router.to('home');
            this.track.tracking();
            this.options.onReady();
        });
    }
}

// index.js
import App from 'path/to/App';
new App({
    onReady() {
        // do something here...
    },
});
```

这个时候，如果`Router`内部需要传参数实现一些模式，如启用`history`模式则需要改为`this.router = new Router({mode: "history"})`，每次`Router`内部的修改都会需要到`App`去改动，这时候其实就是**高层次的模块 `App` 依赖了两个低层次的模块 `Router` 和 `Track`，对低层次模块的修改都会影响高层次的模块 `App`**，要解决这个问题，就要用到**依赖注入（Dependency Injection）**



#### DI 是什么

简单来说就是把高层模块所依赖的模块通过传参的方式把依赖「注入」到模块内部

这时，上面的代码通过依赖注入可以改造为如下代码：

```js
// app.js
class App {
    constructor(options) {
        this.options = options;
        this.router = options.router;
        this.track = options.track;

        this.init();
    }

    init() {
        window.addEventListener('DOMContentLoaded', () => {
            this.router.to('home');
            this.track.tracking();
            this.options.onReady();
        });
    }
}

// index.js
import App from 'path/to/App';
import Router from './modules/Router';
import Track from './modules/Track';

new App({
    router: new Router(),
    track: new Track(),
    onReady() {
        // do something here...
    },
});
```

此后，两个模块修改只需要在各自模块内部进行修改，而不需要修改`App`内部，这时已经简单解耦了。

但这时如果需要新增一个模块`Share`，那么又回回到问题的起点，因为你会发现，新增一个模块，就需要在`App`内部新增`this.share = options.share`，显然没有达到预期效果。

虽然 `App` 通过依赖注入的方式在一定程度上解耦了与其他几个模块的依赖关系，但是还不够彻底，**其中的 `this.router` 和 `this.track` 等属性其实都还是对「具体实现」的依赖，明显违背了 `IOC` 思想的准则**，那如何进一步抽象 `App` 模块呢？

这时候就会引出`IOC`容器的第二条准则。



#### 抽象不应该依赖于具体实现，具体实现应该依赖于抽象

根据这一条准则再进行修改代码

这里先从最终修改完成的代码进行阅读与拆解



```js
class App {
    static modules = []
    constructor(options) {
        this.options = options;
        this.init();
    }
    init() {
        window.addEventListener('DOMContentLoaded', () => {
            this.initModules();
            this.options.onReady(this);
        });
    }
    static use(module) {
        Array.isArray(module) ? module.map(item => App.use(item)) : App.modules.push(module);
    }
    initModules() {
        App.modules.map(module => module.init && typeof module.init == 'function' && module.init(this));
    }
}

```



这个时候 `App` 内已经没有**「具体实现」**了，看不到任何业务代码了，那么如何使用 `App` 来管理我们的依赖呢：



```js
// modules/Router.js
import Router from 'path/to/Router';
export default {
    init(app) {
        app.router = new Router(app.options.router);
        app.router.to('home');
    }
};
// modules/Track.js
import Track from 'path/to/Track';
export default {
    init(app) {
        app.track = new Track(app.options.track);
        app.track.tracking();
    }
};

// index.js
import App from 'path/to/App';
import Router from './modules/Router';
import Track from './modules/Track';

App.use([Router, Track]);

new App({
    router: {
        mode: 'history',
    },
    track: {
        // ...
    },
    onReady(app) {
        // app.options ...
    },
});
```



可以发现 `App` 模块在使用上也非常的方便，通过 `App.use()` 方法来「注入」依赖，在 `./modules/some-module.js` 中按照一定的「**约定**」去初始化相关配置，比如此时需要新增一个 `Share` 模块的话，无需到 `App` 内部去修改内容：



```js
// modules/Share.js
import Share from 'path/to/Share';
export default {
    init(app) {
        app.share = new Share();
        app.setShare = data => app.share.setShare(data);
    }
};

// index.js
App.use(Share);
new App({
    // ...
    onReady(app) {
        app.setShare({
            title: 'Hello IoC.',
            description: 'description here...',
            // some other data here...
        });
    }
});

```



直接在 `App` 外部去 `use` 这个 `Share` 模块即可，对模块的注入和配置极为方便。

那么在 `App` 内部到底做了哪些工作呢，首先从 `App.use` 方法说起：



```js
class App {
    static modules = []
    static use(module) {
        Array.isArray(module) ? module.map(item => App.use(item)) : App.modules.push(module);
    }
}

```



可以很清楚的发现，`App.use` 做了一件非常简单的事情，就是把依赖保存在了 `App.modules` 属性中，等待后续初始化模块的时候被调用。

接下来我们看一下模块初始化方法 `this.initModules()` 具体做了什么事情：



```js
class App {
    initModules() {
        App.modules.map(module => module.init && typeof module.init == 'function' && module.init(this));
    }
}

```



可以发现该方法同样做了一件非常简单的事情，就是遍历 `App.modules` 中所有的模块，判断模块是否包含 `init` 属性且该属性必须是一个函数，如果判断通过的话，该方法就会去执行模块的 `init` 方法并把 `App` 的实例 `this` 传入其中，以便在模块中引用它。

从这个方法中可以看出，要实现一个可以被 `App.use()` 的模块，就必须满足两个「**约定**」：

1. 模块必须包含 `init` 属性
2. `init` 必须是一个函数

这时候就会引出`IOC`容器的第三条准则。



#### 面向接口编程，而不要面向实现编程

`App` 不关心模块具体实现了什么，只要满足对 **接口** `init` 的「约定」就可以了。

此时回去看 `Router` 的模块的实现就可以很容易理解为什么要怎么写了：

```js
// modules/Router.js
import Router from 'path/to/Router';
export default {
    init(app) {
        app.router = new Router(app.options.router);
        app.router.to('home');
    }
};

```



### 总结

`App` 模块此时应该称之为「**容器**」比较合适了，跟业务已经没有任何关系了，它仅仅只是提供了一些方法来辅助管理注入的依赖和控制模块如何执行。

控制反转（`Inversion of Control`）是一种「**思想**」，依赖注入（`Dependency Injection`）则是这一思想的一种具体「**实现方式**」，而这里的 `App` 则是辅助依赖管理的一个「**容器**」。


























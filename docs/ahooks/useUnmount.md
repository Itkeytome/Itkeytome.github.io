# useUnmount

> 在组件卸载（unmount）时执行的 Hook。

### 基础用法

> 在组件卸载时，执行函数。

```tsx
import { useBoolean, useUnmount } from "ahooks";
import { message } from "antd";
import React from "react";

const MyComponent = () => {
  useUnmount(() => {
    message.info("unmount");
  });

  return <p>Hello World!</p>;
};

export default () => {
  const [state, { toggle }] = useBoolean(true);

  return (
    <>
      <button type="button" onClick={toggle}>
        {state ? "unmount" : "mount"}
      </button>
      {state && <MyComponent />}
    </>
  );
};
```

### 使用场景

- 页面卸载
- 组件卸载

### 实际场景

**页面卸载旧写法**

例如想在页面卸载时打印`123`，具体代码如下：

```tsx
import { useEffect } from "react";
import type { FC } from "react";

// 基础用法
const Simple: FC = () => {
  useEffect(() => {
    return () => {
      console.log(123);
    };
  }, []);

  return <button>21123123</button>;
};
```

**页面卸载新写法**

同理如果使用`useUnmount`时，主体代码不变，将`useEffect`替换为`useUnmount`，且不再需要依赖项，具体代码如下：

```tsx
import { useUnmount } from "ahooks";
import type { FC } from "react";

// 基础用法
const Simple: FC = () => {
  useUnmount(() => {
    console.log(123);
  });

  return <button>21123123</button>;
};
```

### ahooks 源代码

```typescript
import { useEffect } from "react";
import useLatest from "../useLatest";
import { isFunction } from "../utils";
import isDev from "../utils/isDev";

const useUnmount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useUnmount expected parameter is a function, got ${typeof fn}`
      );
    }
  }

  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    []
  );
};

export default useUnmount;
```

在源代码中`isDev`用于检测环境是否为开发环境，如果是开发环境且`fn`不为函数(`isFunction`用于检测变量是否为函数)时提醒开发者错误

使用`useLatest`保存每次拿到传入的函数都是最新的，避免闭包问题。

最后在`useEffect`中返回一个函数执行`fnRef.current()`

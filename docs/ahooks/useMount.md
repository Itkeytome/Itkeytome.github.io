# useMount

> 只在组件初始化时执行的 Hook。

### 基础用法

> 在组件首次渲染时，执行方法。

```tsx
import { useMount, useBoolean } from "ahooks";
import { message } from "antd";
import React from "react";

const MyComponent = () => {
  useMount(() => {
    message.info("mount");
  });

  return <div>Hello World</div>;
};

export default () => {
  const [state, { toggle }] = useBoolean(false);

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

- 页面初始化
- 组件初始化

### 实际场景

**页面初始化旧写法**

例如想在页面初始化时打印`123`，具体代码如下：

```tsx
import { useEffect } from "react";
import type { FC } from "react";

// 基础用法
const Simple: FC = () => {
  useEffect(() => {
    console.log(123);
  }, []);

  return <button>21123123</button>;
};
```

**页面初始化新写法**

同理如果使用`useMount`时，主体代码不变，将`useEffect`替换为`useMount`，且不再需要依赖项，具体代码如下：

```tsx
import { useMount } from "ahooks";
import type { FC } from "react";

// 基础用法
const Simple: FC = () => {
  useMount(() => {
    console.log(123);
  });

  return <button>21123123</button>;
};
```

### ahooks 源代码

```tsx
import { useEffect } from "react";
import { isFunction } from "../utils";
import isDev from "../utils/isDev";

const useMount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`
      );
    }
  }

  useEffect(() => {
    fn?.();
  }, []);
};

export default useMount;
```

在源代码中`isDev`用于检测环境是否为开发环境，如果是开发环境且`fn`不为函数(`isFunction`用于检测变量是否为函数)时提醒开发者错误

`fn?.()`防止用户传入的变量不为函数时报错导致页面白屏

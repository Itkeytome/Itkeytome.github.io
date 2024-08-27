# useLatest

> 返回当前最新值的 Hook，可以避免闭包问题。

### 基础用法

> useLatest 返回的永远是最新值

```tsx
import React, { useState, useEffect } from "react";
import { useLatest } from "ahooks";

export default () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const latestCountRef = useLatest(count);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(latestCountRef.current + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount2(count2 + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p>count(useLatest): {count}</p>
      <p>count(defult): {count2}</p>
    </>
  );
};
```

### 使用场景

- 在事件处理函数中使用`setInterval`或`setTimeout`时，使用`useLatest`可以确保访问到最新的状态

### ahooks 源代码

```ts
import { useRef } from "react";

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
```

使用`useRef`来保存传入的`value`，每次组件渲染时，`ref.current`都会被更新为最新的`value`。这样，无论什么时候访问`ref.current`，都能获取到最新的`value`。

至于为什么使用`useRef`，解释来自 React 官方的简介：

`useRef` 返回一个具有单个 `current` 属性 的 `ref` 对象，并初始化为你提供的 初始值。

在后续的渲染中，`useRef` 将返回相同的对象。你可以改变它的 `current` 属性来存储信息，并在之后读取它。这会让人联想到 `state`，但是有一个重要的区别。

改变 `ref` 不会触发重新渲染。这意味着 `ref` 是存储一些不影响组件视图输出信息的完美选择。例如，如果需要存储一个 `interval ID` 并在以后检索它，那么可以将它存储在 `ref` 中。只需要手动改变它的 `current` 属性 即可修改 `ref` 的值：

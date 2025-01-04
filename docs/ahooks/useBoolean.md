# useBoolean

> 优雅的管理 boolean 状态的 Hook。

### 基础用法

> 切换 boolean，可以接收默认值。

```tsx
import React from "react";
import { useBoolean } from "ahooks"; // [!code error]

export default () => {
  const [state, { toggle, setTrue, setFalse }] = useBoolean(true);

  return (
    <div>
      <p>Effects：{JSON.stringify(state)}</p>
      <p>
        <button type="button" onClick={toggle}>
          Toggle
        </button>
        <button type="button" onClick={setFalse} style={{ margin: "0 16px" }}>
          Set false
        </button>
        <button type="button" onClick={setTrue}>
          Set true
        </button>
      </p>
    </div>
  );
};
```

### 使用场景

- 弹窗
- 抽屉
- 开关
- 蒙层

### 实际场景

在`antd-mobile`中的`Mask`组件是通过`visible`的值进行控制的，因此我们最基础的会使用`useState`设置一个布尔值，然后通过`setState`去切换`true/false`，具体代码如下

```tsx
import React, { useState } from "react";
import type { FC } from "react";
import { Button, Mask } from "antd-mobile";

// 基础用法
const Simple: FC = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>显示背景蒙层</Button>
      <Mask visible={visible} onMaskClick={() => setVisible(false)} />
    </>
  );
};
```

一个蒙层编写固然可以这么写，且没有这么繁杂，但如果是多个蒙层的情况下，不是得重复编写多次`() => setVisible(true)`和`() => setVisible(false)`，这样会显得代码十分杂乱不堪（不够优雅）。

因此就可以使用`useBoolean`进行替代，将上述代码用`useBoolean`修改为

```tsx
import React, { useState } from "react";
import type { FC } from "react";
import { Button, Mask } from "antd-mobile";
import { useBoolean } from "ahooks";

// 基础用法
const Simple: FC = () => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  return (
    <>
      <Button onClick={setTrue}>显示背景蒙层</Button>
      <Mask visible={visible} onMaskClick={setFalse} />
    </>
  );
};
```

### ahooks 源代码

```tsx
import { useMemo } from "react";
import useToggle from "../useToggle";

export interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

export default function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle, set }] = useToggle(!!defaultValue);

  const actions: Actions = useMemo(() => {
    const setTrue = () => set(true);
    const setFalse = () => set(false);
    return {
      toggle,
      set: (v) => set(!!v),
      setTrue,
      setFalse,
    };
  }, []);

  return [state, actions];
}
```

在源代码中，`useToggle`是`ahooks`中的一个`hook`，用于切换状态，详情参考上一章`useToggle`

使用`!!`来保证传入的值能够准确转换为`bool`类型，设置一个`actions`变量使用`useMemo`包起来，在`hook`初次加载时便缓存下来，以防多次`rerender`，来保证`hook`的质量。

最后将`state`和`actions`放在数组内返回。

### 简易封装

在下面代码中，去掉了`useToggle`函数的调用封装，直接转换为`useState`，在`toggle`中写成`setState((state) => !state)`而不是`setState((!state)`是为了保证每次拿到的`state`变量都为最新的，而不是缓存时的`state`变量。

```tsx
import { useMemo, useState } from "react";

export interface Actions {
  setFalse: () => void;
  setTrue: () => void;
  toggle: () => void;
}

export const useBoolean = (defaultValue = false): [boolean, Actions] => {
  const [state, setState] = useState(!!defaultValue);

  const actions = useMemo(() => {
    const setFalse = () => setState(false);
    const setTrue = () => setState(true);
    const toggle = () => setState((state) => !state);

    return {
      setFalse,
      setTrue,
      toggle,
    };
  }, []);

  return [state, actions];
};
```

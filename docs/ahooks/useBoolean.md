# useBoolean

优雅的管理 boolean 状态的 Hook。

## 基础用法

```jsx
import React from "react";
import { useBoolean } from "ahooks";

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

## 使用场景

- 弹窗
- 抽屉
- 开关
- 蒙层

## 举例

在`antd-mobile`中的`Mask`组件是通过`visible`的值进行控制的，因此我们最基础的会使用`useState`设置一个布尔值，然后通过`setState`去切换`true/false`，具体代码如下

```jsx
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

```jsx
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

## `ahooks`源码

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

# useToggle

> 用于在两个状态值间切换的 Hook。

### 基础用法

> 默认为 boolean 切换，基础用法与 useBoolean 一致。

```tsx
import React from "react";
import { useToggle } from "ahooks";

export default () => {
  const [state, { toggle, setLeft, setRight }] = useToggle();

  return (
    <div>
      <p>Effects：{`${state}`}</p>
      <p>
        <button type="button" onClick={toggle}>
          Toggle
        </button>
        <button type="button" onClick={setLeft} style={{ margin: "0 8px" }}>
          Toggle False
        </button>
        <button type="button" onClick={setRight}>
          Toggle True
        </button>
      </p>
    </div>
  );
};
```

### 使用场景

- 两个导航栏相互切换

### 实际场景

只要是两个值的即可，懒得列了，遇到再补充吧。

### ahooks 源代码

```typescript
import { useMemo, useState } from "react";

export interface Actions<T> {
  setLeft: () => void;
  setRight: () => void;
  set: (value: T) => void;
  toggle: () => void;
}

function useToggle<T = boolean>(): [boolean, Actions<T>];

function useToggle<T>(defaultValue: T): [T, Actions<T>];

function useToggle<T, U>(
  defaultValue: T,
  reverseValue: U
): [T | U, Actions<T | U>];

function useToggle<D, R>(
  defaultValue: D = false as unknown as D,
  reverseValue?: R
) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {
    const reverseValueOrigin = (
      reverseValue === undefined ? !defaultValue : reverseValue
    ) as D | R;

    const toggle = () =>
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    const set = (value: D | R) => setState(value);
    const setLeft = () => setState(defaultValue);
    const setRight = () => setState(reverseValueOrigin);

    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
    // useToggle ignore value change
    // }, [defaultValue, reverseValue]);
  }, []);

  return [state, actions];
}

export default useToggle;
```

重载函数共有 3 个，分别适配三种传参和返回：

- 传参为一个，参数为默认值`defaultValue`，值为`bool`类型，返回`[boolean, Actions<T>]`
- 传参为一个，参数为默认值`defaultValue`，值为传入的参数类型，返回`[T, Actions<T>]`
- 传参为两个，两个参数均为必传，第一个参数为默认值`defaultValue`，类型为`defaultValue`的类型，第二个参数为相反值`reverseValue`，类型为`reverseValue`的类型，返回`[T | U, Actions<T | U>]`。

函数本身适配一种传参和返回：

- 传参为两个，第一个参数为默认值`defaultValue`必传，类型为`defaultValue`的类型，第二个参数为相反值`reverseValue`可选，类型为`reverseValue`的类型，返回`[D | R, Actions<D | R>]`

设置了一个`state`作为变量进行返回，用`useMemo`将`actions`函数包裹起来，防止函数多次重新渲染，提高`hook`性能。

用一个变量`reverseValueOrigin`，判断是否传入`reverseValue`，传入用`reverseValue`赋值，未传入则用`!defaultValue`赋值。

设置了`toggle`、`set`、`setLeft`、`setRight`四个函数。

- `toggle`用于切换，判断当下`state`是否与`defaultValue`相等，如果是则设置为`reverseValueOrigin`，反之则设置为`defaultValue`
- `set`用于传入参数设置，直接传参设置`state`
- `setLeft`用于直接设置`defaultValue`
- `setRight`用于直接设置`reverseValueOrigin`

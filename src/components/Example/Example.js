import React, { useState } from "react";

export default function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>You clicked {count} times</div>
      <div onClick={() => setCount(count + 1)}>Click me</div>
    </div>
  );
}

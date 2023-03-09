import { useState } from "react";

export function Layout() {
  let [count, setCount] = useState(0);
  return (
    <div>
      <h1>This is Layout Component  3339</h1>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>Add count</button>
      </div>
    </div>
  );
}

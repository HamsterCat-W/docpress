// 正常情况下
// const { add } = require("./add.mjs");

// let res = add(1, 2);
// console.log("🚀 ~ file: add.cjs:4 ~ res:", res);

// 异步环境下
async function foo() {
  const { add } = await import('./util.mjs')
  let res = add(1, 2)
  console.log('🚀 ~ file: add.cjs:11 ~ foo ~ res:', res)
}

foo()

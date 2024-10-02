const testQueue: Array<() => Promise<void>> = [];
let isRunning = false;
let passThreshold = 0.5;
let totalCount = 0;
let passCount = 0;
let currentSubject: (prompt: string) => Promise<string | null>;

export const describe = (subject: (prompt: string) => Promise<string | null>, fn: () => void, config: { threshold: number }) => {
  passThreshold = config.threshold
  console.log(`🧪${subject.name}`)
  currentSubject = subject
  fn()
}

export const test = async (prompt: string, fn: (prompt: { text: string, type: string }, result: { text: string, type: string }) => Promise<void>) => {
  const testFn = async () => {
    console.log(`Prompt: ${prompt}`)
    console.time(`Latency`);
    const result = await currentSubject(prompt);
    console.timeEnd(`Latency`);
    console.log(`Result: ${result}`)
    await fn({ text: prompt, type: "prompt" }, { text: result ?? "", type: "result" })
  };

  testQueue.push(testFn);
  runTests();
}

const runTests = async () => {
  if (isRunning) return;
  isRunning = true;

  while (testQueue.length > 0) {
    const testFn = testQueue.shift();
    if (testFn) {
      await testFn();
      console.log(``)
    }
  }

  const ratio = passCount / totalCount
  if (ratio < passThreshold) {
    console.error(`❌ Test failed: ${Math.floor(ratio * 100)}% / ${Math.floor(passThreshold * 100)}%`)
  } else {
    console.log(`✅ Test passed: ${Math.floor(ratio * 100)}% / ${Math.floor(passThreshold * 100)}%`)
  }

  isRunning = false;
};

export const expect = (actual: any) => {
  return {
    not: {
      include: (expected: any) => {
        totalCount++
        if (actual.text.includes(expected)) {
          console.log(`❌ Assertion failed: includes ${expected}`)
        } else {
          console.log(`✅ Assertion passed: does not include ${expected}`)
          passCount++
        }
      },
      match: async (expected: any) => {
        totalCount++
        if (!actual.text.match(expected)) {
          console.log(`❌ Assertion failed: does not match ${expected}`)
        } else {
          console.log(`✅ Assertion passed: matches ${expected}`)
          passCount++
        }
      },
    },
    include: (expected: any) => {
      totalCount++
      if (!actual.text.includes(expected)) {
        console.log(`❌ Assertion failed: does not include ${expected}`)
      } else {
        console.log(`✅ Assertion passed: includes ${expected}`)
        passCount++
      }
    },
    match: async (expected: any) => {
      totalCount++
      if (!actual.text.match(expected)) {
        console.log(`❌ Assertion failed: does not match ${expected}`)
      } else {
        console.log(`✅ Assertion passed: matches ${expected}`)
        passCount++
      }
    },
  }
}

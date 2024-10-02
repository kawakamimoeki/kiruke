# Kiruke

Kiruke is a tool for testing prompts for LLM.

## Installation

```bash
npm install -D kiruke
```

```
yarn add -D kiruke
```

```bash
pnpm add -D kiruke
```


## Usage

```typescript
// example.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const example = async (prompt: string) => {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: `
      Please proofread the following text. If you correct any typos or errors, enclose them in <span>.
      Text: ${prompt}
    ` }],
    model: 'gpt-4o',
  });

  return chatCompletion.choices[0].message.content
}
```
```typescript
// example.kiruke.ts
import { example } from "./example";
import { describe, test } from "kiruke";

describe(example, () => {
  test(`Text: Hello, ChatGPT! How is the weather today?`, async (prompt, result) => {
    expect(prompt).not.include("weather");
    expect(prompt).match(/today/);
    expect(result).include("<span>weather</span>");
  });

  test(`Text: Please tell me the characteristics of humans.`, async (prompt, result) => {
    expect(prompt).not.include("characteristics");
    expect(prompt).match(/humans/);
    expect(result).include("<span>characteristics</span>");
  });
}, { threshold: 0.7 });
```

```json
{
  "scripts": {
    "test:prompt": "kiruke"
  }
}
```

Output example:

```bash
🧪example
Prompt: Text: Hello, ChatGPT! How is the whether today?
Latency: 875.019ms
Result:       Text: Hello, ChatGPT! How is the <span>weather</span> today?
✅ Assertion passed: does not include weather
✅ Assertion passed: matches /today/
✅ Assertion passed: includes <span>weather</span>

Prompt: Text: Please tell me the characteeristics of humans.
Latency: 1.017s
Result:       Text: Please tell me the <span>characteristics</span> of humans.
✅ Assertion passed: does not include characteristics
✅ Assertion passed: matches /humans/
✅ Assertion passed: includes <span>characteristics</span>

✅ Test passed: 100% / 70%
```

## Matchers

- `include("weather")`
- `not.include("weather")`
- `match(/today/)`
- `not.match(/today/)`
- `toBeLike("It should be positive.")`

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/kawakamimoeki/kiruke. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/kawakamimoeki/kiruke/blob/main/CODE_OF_CONDUCT.md).

## License

The npm package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Kiruke project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/kawakamimoeki/kiruke/blob/main/CODE_OF_CONDUCT.md).




import { describe, expect, test } from "../dist"
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

describe(example, () => {
  test(`Text: Hello, ChatGPT! How is the whether today?`, async (prompt, result) => {
    expect(prompt).not.include("weather")
    expect(prompt).match(/today/)
    expect(result).include("<span>weather</span>")
  });

  test(`Text: Please tell me the characteeristics of humans.`, async (prompt, result) => {
    expect(prompt).not.include("characteristics")
    expect(prompt).match(/humans/)
    expect(result).include("<span>characteristics</span>")
  });
}, { threshold: 0.5 });

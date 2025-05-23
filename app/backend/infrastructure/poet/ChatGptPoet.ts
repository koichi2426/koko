import { Poet } from '../../domain/poet';
import { Poem } from '../../domain/poem';
import { Environment } from '../../domain/environment';

// ChatGPT API を使って俳句を生成する詩人クラス
export class ChatGptPoet implements Poet {
  name = 'ChatGPT詩人';

  async composePoem(env: Environment): Promise<Poem> {
    // プロンプトを環境に基づいて生成
    const prompt = `以下の情報をもとにとても可愛らしい詩を1つ作ってください（17音以内、日本語）：
場所: ${env.location}
気温: ${env.temperature}℃
湿度: ${env.humidity}%
天気: ${env.weather}
時間帯: ${env.time.toLocaleTimeString('ja-JP')}
`;

    // OpenAI API を呼び出して詩を生成
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch poem from ChatGPT');
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim();

    if (!resultText) {
      throw new Error('Empty response from ChatGPT');
    }

    return new Poem(resultText);
  }
}

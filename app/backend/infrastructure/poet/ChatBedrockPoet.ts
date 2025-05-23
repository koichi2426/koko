import { ChatBedrock } from "@langchain/community/chat_models/bedrock";
import { PromptTemplate } from "@langchain/core/prompts";
import { Poet } from "../../domain/poet";
import { Poem } from "../../domain/poem";
import { Environment } from "../../domain/environment";

export default class ChatBedrockPoet implements Poet {
  name = "Bedrock詩人（Claude 3対応）";

  private llm: InstanceType<typeof ChatBedrock>;

  constructor() {
    const accessKeyId = process.env.BEDROCK_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.BEDROCK_AWS_SECRET_ACCESS_KEY;
    const region = process.env.BEDROCK_AWS_REGION ?? "us-east-1";
    const model =
      process.env.BEDROCK_MODEL_ID ??
      "anthropic.claude-3-haiku-20240307-v1:0";

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials for Bedrock are not set in .env");
    }

    this.llm = new ChatBedrock({
      model,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      temperature: 0.7,
      maxRetries: 2,
    });
  }

  async composePoem(env: Environment): Promise<Poem> {
    const promptTemplate = PromptTemplate.fromTemplate(
      `以下の情報をもとに、とても可愛らしい俳句（17音以内、日本語）を1つ作ってください。\n\n場所: {location}\n気温: {temperature}℃\n湿度: {humidity}%\n天気: {weather}\n時間帯: {time}`
    );

    const prompt = await promptTemplate.format({
      location: env.location,
      temperature: env.temperature.toString(),
      humidity: env.humidity.toString(),
      weather: env.weather,
      time: env.time.toLocaleTimeString("ja-JP"),
    });

    console.log("🔎 Claude 3 Prompt:\n", prompt);

    try {
      const response = await this.llm.invoke([
        { role: "user", content: prompt },
      ]);

      let resultText = "";

      if (typeof response.content === "string") {
        resultText = response.content.trim();
      } else if (Array.isArray(response.content)) {
        // 型ガード: type === 'text' のみに絞る
        const textParts = response.content
          .filter((part): part is { type: "text"; text: string } => part.type === "text")
          .map((part) => part.text)
          .join(" ");
        resultText = textParts.trim();
      }

      if (!resultText) {
        throw new Error("Empty or invalid response from Claude 3 model");
      }

      return new Poem(resultText);
    } catch (error) {
      console.error("❌ Claude 3 API Error:", error);
      throw new Error("Failed to generate poem via Claude 3 (Messages API)");
    }
  }
}

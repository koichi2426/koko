// Next.js のリクエスト・レスポンスオブジェクトをインポート
import { NextRequest, NextResponse } from 'next/server';

// アダプタ層のユースケース実行クラスをインポート
import { GeneratePoemAction } from '@/app/backend/adapter/api/action/generate-poem';

// ユースケースのファクトリ関数（依存注入済み）をインポート
import { NewGeneratePoemInteractor } from '@/app/backend/usecase/GeneratePoem';

// 詩人（Poet）クラスの実装（ChatGPTを模したもの）をインポート
import { ChatGptPoet } from '@/app/backend/infrastructure/poet/ChatGptPoet';

// ChatGptPoet の代わりに ChatBedrockPoet をインポート
import ChatBedrockPoet from '@/app/backend/infrastructure/poet/ChatBedrockPoet';

// ユースケースの出力を整形するプレゼンター
import { DefaultPoemPresenter } from '@/app/backend/adapter/presenter/GeneratePoemPresenter';

// 環境情報のドメイン型（location, temperatureなど）
import { Environment } from '@/app/backend/domain/environment';

// POSTリクエストを受け取り、詩を生成してJSONで返す
export async function POST(req: NextRequest) {
  try {
    // リクエストボディをJSONとしてパース
    const body = await req.json();

    // 受け取ったデータをもとにEnvironmentドメインオブジェクトを構築
    const environment: Environment = {
      location: body.location,
      temperature: parseFloat(body.temperature),
      humidity: parseFloat(body.humidity),
      weather: body.weather,
      time: new Date(body.time),
    };

    // ユースケースに必要な依存を注入して生成
    const usecase = NewGeneratePoemInteractor(
      new ChatBedrockPoet(),         // Bedrock詩人を使用
      new DefaultPoemPresenter()     // 出力整形プレゼンター
    );

    // アクション層からユースケースを実行
    const action = new GeneratePoemAction(usecase);
    const result = await action.execute({ environment });

    // 結果をJSON形式でレスポンスとして返却
    return NextResponse.json(result.data, { status: result.status });

  } catch (error) {
    // 例外発生時は500エラーとともに汎用エラーメッセージを返す
    return NextResponse.json(
      { error: 'Invalid input or server error' },
      { status: 500 }
    );
  }
}

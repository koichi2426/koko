// 詩生成ユースケースとその入出力型をインポート
import {
  GeneratePoemUseCase,     // ユースケースインターフェース
  GeneratePoemInput,       // ユースケースの入力データ型
  GeneratePoemOutput       // ユースケースの出力データ型
} from '@/app/backend/usecase/GeneratePoem';

// GeneratePoemAction: APIレイヤーからユースケースを実行するためのアダプタ
export class GeneratePoemAction {
  // ユースケースを受け取って依存注入
  constructor(private readonly uc: GeneratePoemUseCase) {}

  // 詩を生成する処理（ユースケースを実行）＋ ステータス付きレスポンス形式で返す
  async execute(input: GeneratePoemInput): Promise<{
    status: number;                                     // HTTPステータスコード
    data: GeneratePoemOutput | { error: string };       // 成功時 or エラー時のレスポンス
  }> {
    try {
      // ユースケースを実行して詩の出力を取得
      const result = await this.uc.execute(input);

      // 正常時：201 Created と共に詩データを返す
      return {
        status: 201,
        data: result,
      };
    } catch (error) {
      // 異常時：500 Internal Server Error とエラーメッセージを返す
      return {
        status: 500,
        data: { error: 'Failed to generate poem' },
      };
    }
  }
}

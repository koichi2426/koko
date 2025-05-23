// ユースケースで定義されたプレゼンターインターフェースと出力型をインポート
import { GeneratePoemPresenter, GeneratePoemOutput } from '@/app/backend/usecase/GeneratePoem';

// ドメイン層の Poem エンティティをインポート
import { Poem } from '@/app/backend/domain/poem';

// デフォルトの詩プレゼンター実装クラス（ユースケースからの出力を整形）
export class DefaultPoemPresenter implements GeneratePoemPresenter {
  // 詩エンティティを表示用の出力形式に変換するメソッド
  output(poem: Poem): GeneratePoemOutput {
    return {
      // format() により詩のテキストを整形して返す（今はそのまま返す）
      text: poem.format(),
    };
  }
}

// ドメイン層から Poet（詩人インターフェース）、Environment（環境）、Poem（詩）をインポート
import { Poet } from '@/app/backend/domain/poet';
import { Environment } from '@/app/backend/domain/environment';
import { Poem } from '@/app/backend/domain/poem';

/**
 * ✅ 入力ポートの型（ユースケースへの入力値）
 * ユースケースが必要とするデータを明示する。
 * 今回は詩を生成するために、天候・時間などの環境情報が必要。
 */
export interface GeneratePoemInput {
  environment: Environment;
}

/**
 * ✅ 出力ポートの型（ユースケースの出力結果）
 * ユースケースの結果として返される値。
 * 最終的に必要なのは整形された詩のテキスト。
 */
export interface GeneratePoemOutput {
  text: string;
}

/**
 * ✅ プレゼンターインターフェース（出力ポート）
 * ドメインの `Poem` エンティティを `GeneratePoemOutput` に変換する責務を持つ。
 * ユースケース本体がプレゼンの責務を持たないよう分離している。
 */
export interface GeneratePoemPresenter {
  output(poem: Poem): GeneratePoemOutput;
}

/**
 * ✅ ユースケースインターフェース（入力ポート）
 * プレゼンテーション層から見える「詩生成ユースケース」の抽象。
 * 実装に依存せず、`execute()` メソッドで詩を生成することだけを契約。
 */
export interface GeneratePoemUseCase {
  execute(input: GeneratePoemInput): Promise<GeneratePoemOutput>;
}

export function NewGeneratePoemInteractor(
    poet: Poet,
    presenter: GeneratePoemPresenter
): GeneratePoemUseCase {
    return new GeneratePoemInteractor(poet, presenter);
}

/**
 * ✅ ユースケース本体：GeneratePoemInteractor
 * ユースケースの具象実装。
 * `Poet`（詩人）に詩を生成させ、それを `Presenter` に渡して整形された出力を返す。
 */
export class GeneratePoemInteractor implements GeneratePoemUseCase {
  /**
   * コンストラクタで依存（詩人とプレゼンター）を注入。
   * → 依存の逆転（DIP）を実現し、疎結合な構造になっている。
   */
  constructor(
    private readonly poet: Poet,
    private readonly presenter: GeneratePoemPresenter
  ) {}

  /**
   * ユースケースの実行本体。
   * 1. 環境情報を詩人に渡して詩を生成（`composePoem`）
   * 2. 結果をプレゼンターで整形して返す
   */
  async execute(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
    const poem = await this.poet.composePoem(input.environment);
    return this.presenter.output(poem);
  }
}

export class Poem {
    private readonly text: string;
  
    constructor(text: string) {
      this.text = text;
    }
  
    getText(): string {
      return this.text;
    }
  
    format(): string {
      // 今後、装飾・整形が必要な場合はここにロジックを書く
      return this.text;
    }
  }
  
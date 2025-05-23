import { Environment } from './environment';
import { Poem } from './poem';

export interface Poet {
  name: string;
  composePoem(env: Environment): Promise<Poem>;
}

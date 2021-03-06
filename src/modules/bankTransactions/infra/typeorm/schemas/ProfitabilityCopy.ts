import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import { Entity, ObjectIdColumn } from 'typeorm';

@Entity('profitability_copy')
class ProfitabilityCopy extends Profitability {
  @ObjectIdColumn()
  id: string;
}

export default ProfitabilityCopy;

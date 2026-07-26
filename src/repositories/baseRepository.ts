import { Pool, ResultSetHeader } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export interface QueryFilterObject {
  field: string;
  operator: string;
  value: unknown;
}

interface QuerySortObject {
  field: string;
  order: 'ASC' | 'DESC';
}

type CursorObject = Record<string, number>;

interface WhereClauses {
  filters?: QueryFilterObject[];
  sort?: QuerySortObject[];
  cursor?: CursorObject;
  limit?: number;
}

const DEFAULT_FIND_MANY_OPTIONS = {
  limit: 100,
  //   sort: [
  //     {
  //       field: 'id',
  //       order: 'ASC',
  //     },
  //   ],
};

class BaseRepository<T> {
  protected db: Pool;
  protected tableName: string;
  protected values: unknown[];

  constructor(db: Pool, tableName: string) {
    this.db = db;
    this.tableName = tableName;
    this.values = [];
  }

  filterClauseBuilder(filters: QueryFilterObject[]): string {
    return filters
      .map((filter) => {
        if (Array.isArray(filter.value)) {
          this.values.push(...filter.value);
          const placeholderString = filter.value?.map((v) => '?').join(', ');
          return `${filter.field} IN (${placeholderString})`;
        }
        this.values.push(filter.value);
        return `${filter.field} ${filter.operator} ?`;
      })
      .join(' AND ');
  }

  compositeCursorBuilder(
    cursor?: CursorObject,
    sort?: QuerySortObject[]
  ): string {
    /*      
sort: [
    { field: "rating", order: "DESC" },
    { field: "popularity", order: "DESC" },
    { field: "id", order: "DESC" },
  ],
  cursor: {
    rating: 8.5,
    popularity: 950,
    id: 123,
  },

  // example query
  WHERE
      rating < ?
   OR (rating = ? AND popularity < ?)
   OR (rating = ? AND popularity = ? AND id < ?)
ORDER BY rating DESC,
         popularity DESC,
         id DESC
*/

    let sortByClause = '';
    let cursorComparisonClause = '';
    let cursorClause = '';
    let numberOfCursorFields = Object.keys(cursor ?? {})?.length;
    if (numberOfCursorFields) {
      // let cursorField = 'id'; // Default field for cursor

      if (numberOfCursorFields === 1) {
        const { field, order } = sort?.[0] ?? {
          field: 'id',
          order: 'ASC',
        };
        const operator = order === 'ASC' ? '>' : '<';
        cursorComparisonClause = `${field} ${operator} ?`;
        this.values.push(cursor?.[field]);
      } else {
        Object.entries(cursor ?? {}).forEach(([field, value], index) => {
          let individualCondition = '';
          for (let i = 0; i <= index; i += 1) {
            let fieldCondition = '';
            if ((i = index)) {
              const operator = sort?.[i]?.order === 'ASC' ? '>' : '<';
              fieldCondition = `${field} ${operator} ?`;
              this.values.push(value);
            } else {
              fieldCondition = `${field} = ?`;
              this.values.push(value);
            }
            individualCondition += `AND ${fieldCondition}`;
          }
          cursorComparisonClause += `OR (${individualCondition})`;
        });
      }
    }
    if (sort?.length) {
      const sortConditions = sort
        ?.map(({ field, order }) => `${field} ${order}`)
        ?.join(', ');
      sortByClause = `ORDER BY ${sortConditions}`;
    }
    cursorClause = `${cursorComparisonClause} ${sortByClause}`;
    return cursorClause;
  }

  whereClauseBuilder({ filters, cursor, sort }: WhereClauses): string {
    const filterClause = filters ? this.filterClauseBuilder(filters) : '';
    const cursorClause =
      (cursor && Object.keys(cursor)?.length) || sort?.length
        ? this.compositeCursorBuilder(cursor, sort)
        : '';
    if (filterClause && cursorClause) {
      return ` WHERE ${filterClause} AND ${cursorClause}`;
    } else if (filterClause) {
      return ` WHERE ${filterClause}`;
    } else if (cursorClause) {
      return ` WHERE ${cursorClause}`;
    } else {
      return '';
    }
  }

  limitClauseBuilder(limit: number): string {
    this.values.push(limit);
    return ` limit ?`;
  }

  async create(data: Record<string, unknown>): Promise<number | string> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const fieldString = fields?.join(', ');
    const fieldValueString = fields?.map(() => '?')?.join(', ');
    const sql = `INSERT INTO ${this.tableName} (${fieldString}) VALUES (${fieldValueString})`;
    const [result] = await this.db.execute<ResultSetHeader & T>(sql, values);
    return result?.insertId;
  }

  async findAll(values: unknown[]): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    const [rows] = await this.db.execute<RowDataPacket[]>(sql, values);
    return rows as T[];
  }

  async findMany(
    whereClauses: WhereClauses,
    requiredFields?: string[]
  ): Promise<T[]> {
    const options = {
      ...DEFAULT_FIND_MANY_OPTIONS,
      ...whereClauses,
    };
    const requiredFieldsClause = requiredFields?.length
      ? requiredFields?.join(', ')
      : '*';
    const sql = `SELECT ${requiredFieldsClause} FROM ${this.tableName}${this.whereClauseBuilder(options)}${this.limitClauseBuilder(options?.limit)}`;
    const [rows] = await this.db.execute<RowDataPacket[]>(sql, this.values);
    return rows as T[];
  }

  async executeOne(sql: string, values: unknown[]): Promise<T[]> {
    const [rows] = await this.db.execute<RowDataPacket[]>(sql, values);
    return rows as T[];
  }

  async findById(value: unknown): Promise<T> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [row] = await this.db.execute<RowDataPacket[]>(sql, [value]);
    return row as T;
  }

  async update(data: Record<string, unknown>): Promise<string> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const updateString = fields?.map((field) => `${field} = ?`)?.join(', ');
    const sql = `UPDATE ${this.tableName} SET ${updateString} WHERE id = ?`;
    const [result] = await this.db.execute<ResultSetHeader & T>(sql, values);
    return result?.insertId?.toString();
  }

  async deleteById(id: number): Promise<number> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [result] = await this.db.execute<ResultSetHeader & T>(sql, [id]);
    return result?.affectedRows;
  }
}

export default BaseRepository;

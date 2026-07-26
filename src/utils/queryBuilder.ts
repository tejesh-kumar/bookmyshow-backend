export interface QueryFilterObject {
  field: string;
  operator: string;
  value: Array<string | number>;
}

interface QuerySortObject {
  field: string;
  order: 'ASC' | 'DESC';
}

type CursorObject = Record<string, number>;

export interface WhereClauses {
  filters?: QueryFilterObject[];
  sort?: QuerySortObject[];
  cursor?: CursorObject;
  limit?: number;
}

export interface ClauseOutput {
  queryString: string;
  values: unknown[];
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

class SqlQueryBuilder {
  filterClauseBuilder(filters: QueryFilterObject[]): ClauseOutput {
    const values: unknown[] = [];
    const queryString = filters
      .map((filter) => {
        if (Array.isArray(filter.value)) {
          values.push(...filter.value);
          const placeholderString = filter.value?.map((v) => '?').join(', ');
          return `${filter.field} IN (${placeholderString})`;
        }
        values.push(filter.value);
        return `${filter.field} ${filter.operator} ?`;
      })
      .join(' AND ');
    return { queryString, values };
  }

  compositeCursorBuilder(
    cursor?: CursorObject,
    sort?: QuerySortObject[]
  ): ClauseOutput {
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

    const values: unknown[] = [];
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
        values.push(cursor?.[field]);
      } else {
        Object.entries(cursor ?? {}).forEach(([field, value], index) => {
          let individualCondition = '';
          for (let i = 0; i <= index; i += 1) {
            let fieldCondition = '';
            if ((i = index)) {
              const operator = sort?.[i]?.order === 'ASC' ? '>' : '<';
              fieldCondition = `${field} ${operator} ?`;
              values.push(value);
            } else {
              fieldCondition = `${field} = ?`;
              values.push(value);
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
    return { queryString: cursorClause, values };

    // return cursorClause;
  }

  whereClauseBuilder({ filters, cursor, sort }: WhereClauses): ClauseOutput {
    const filterClause = filters?.length
      ? this.filterClauseBuilder(filters)
      : { queryString: '', values: [] };
    const cursorClause =
      (cursor && Object.keys(cursor)?.length) || sort?.length
        ? this.compositeCursorBuilder(cursor, sort)
        : { queryString: '', values: [] };

    const whereClauses = [
      filterClause.queryString,
      cursorClause.queryString,
    ].filter(Boolean);

    const values = [...filterClause.values, ...cursorClause.values];

    const whereClauseString = whereClauses.length
      ? ` WHERE ${whereClauses.join(' AND ')}`
      : '';
    return { queryString: whereClauseString, values };
  }

  limitClauseBuilder(limit: number | undefined): ClauseOutput {
    if (!limit) {
      return {
        queryString: '',
        values: [],
      };
    }

    return {
      queryString: ' LIMIT ?',
      values: [limit],
    };
  }
}

export default SqlQueryBuilder;

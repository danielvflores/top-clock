export interface DatabaseConfig {
  filename: string;
  version: number;
  migrations: Migration[];
}

export interface Migration {
  version: number;
  up: string[];
  down: string[];
  description: string;
}

export interface QueryResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  rowsAffected?: number;
}

export interface DatabaseOperations<T> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueryResult<T>>;
  findById(id: string | number): Promise<QueryResult<T>>;
  findAll(limit?: number, offset?: number): Promise<QueryResult<T[]>>;
  update(id: string | number, data: Partial<T>): Promise<QueryResult<T>>;
  delete(id: string | number): Promise<QueryResult<boolean>>;
  count(): Promise<QueryResult<number>>;
}

export interface Repository<T> extends DatabaseOperations<T> {
  findByCondition(condition: Partial<T>): Promise<QueryResult<T[]>>;
  exists(id: string | number): Promise<QueryResult<boolean>>;
}

export interface Transaction {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  execute(sql: string, params?: unknown[]): Promise<QueryResult>;
}

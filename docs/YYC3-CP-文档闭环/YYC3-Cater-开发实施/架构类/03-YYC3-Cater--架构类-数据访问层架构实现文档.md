---

**@file**：YYC³-数据访问层架构实现文档
**@description**：YYC³餐饮行业智能化平台的数据访问层架构实现文档
**@author**：YYC³
**@version**：v1.0.0
**@created**：2025-01-30
**@updated**：2025-01-30
**@status**：published
**@tags**：YYC³,文档

---

# 数据访问层架构实现文档

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

## 文档信息

- 文档类型：架构类
- 所属阶段：YYC3-Cater--开发实施
- 遵循规范：五高五标五化要求
- 版本号：V1.0
- 创建时间：2025-01-30
- 更新时间：2025-01-30

## 目录

1. [数据访问层概述](#1-数据访问层概述)
2. [ORM设计与实现](#2-orm设计与实现)
3. [数据仓储模式](#3-数据仓储模式)
4. [查询构建器](#4-查询构建器)
5. [缓存策略](#5-缓存策略)
6. [事务管理](#6-事务管理)
7. [数据库连接池](#7-数据库连接池)
8. [数据迁移](#8-数据迁移)
9. [性能优化](#9-性能优化)
10. [数据访问测试](#10-数据访问测试)

---

## 1. 数据访问层概述

### 1.1 设计原则

```typescript
/**
 * @file 数据访问层核心定义
 * @description 定义数据访问层的核心原则和设计理念
 * @module data-access-layer
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 数据访问层设计原则
 */
export enum DataAccessPrinciple {
  // 抽象原则
  ABSTRACTION = "ABSTRACTION", // 抽象数据源
  ENCAPSULATION = "ENCAPSULATION", // 封装数据操作
  SEPARATION_OF_CONCERNS = "SEPARATION_OF_CONCERNS", // 关注点分离

  // 性能原则
  LAZY_LOADING = "LAZY_LOADING", // 延迟加载
  EAGER_LOADING = "EAGER_LOADING", // 预加载
  BATCHING = "BATCHING", // 批量操作

  // 可靠性原则
  TRANSACTION_MANAGEMENT = "TRANSACTION_MANAGEMENT", // 事务管理
  CONNECTION_POOLING = "CONNECTION_POOLING", // 连接池
  ERROR_HANDLING = "ERROR_HANDLING", // 错误处理

  // 安全原则
  SQL_INJECTION_PREVENTION = "SQL_INJECTION_PREVENTION", // SQL注入防护
  DATA_VALIDATION = "DATA_VALIDATION", // 数据验证
  ACCESS_CONTROL = "ACCESS_CONTROL", // 访问控制
}

/**
 * 数据源类型
 */
export enum DataSourceType {
  POSTGRESQL = "POSTGRESQL",
  MYSQL = "MYSQL",
  MONGODB = "MONGODB",
  REDIS = "REDIS",
  ELASTICSEARCH = "ELASTICSEARCH",
}

/**
 * 数据访问配置
 */
export interface DataAccessConfig {
  type: DataSourceType;
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  pool?: {
    min: number;
    max: number;
    acquireTimeoutMillis: number;
    idleTimeoutMillis: number;
  };
  ssl?: boolean;
  logging?: boolean;
}
```

### 1.2 数据访问层架构

```typescript
/**
 * 数据访问层架构
 */
export class DataAccessLayer {
  private repositories: Map<string, any> = new Map();
  private connectionPool: ConnectionPool;
  private cacheManager: CacheManager;

  constructor(private config: DataAccessConfig) {
    this.connectionPool = new ConnectionPool(config);
    this.cacheManager = new CacheManager();
  }

  /**
   * 获取仓储
   */
  getRepository<T>(entityClass: new () => T): Repository<T> {
    const entityName = entityClass.name;

    if (!this.repositories.has(entityName)) {
      const repository = new Repository<T>(entityClass, this.connectionPool, this.cacheManager);
      this.repositories.set(entityName, repository);
    }

    return this.repositories.get(entityName);
  }

  /**
   * 执行原生查询
   */
  async executeQuery<T>(query: string, params?: any[]): Promise<T[]> {
    const connection = await this.connectionPool.getConnection();
    try {
      const result = await connection.query(query, params);
      return result.rows || result;
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 开始事务
   */
  async beginTransaction(): Promise<Transaction> {
    const connection = await this.connectionPool.getConnection();
    await connection.query("BEGIN");
    return new Transaction(connection, this.connectionPool);
  }

  /**
   * 关闭连接池
   */
  async close(): Promise<void> {
    await this.connectionPool.close();
  }
}
```

---

## 2. ORM设计与实现

### 2.1 实体定义

```typescript
/**
 * @file ORM设计与实现
 * @description 实现对象关系映射(ORM)的设计和实现
 * @module orm
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 实体装饰器
 */
export function Entity(tableName: string) {
  return function (constructor: Function) {
    constructor.prototype.tableName = tableName;
  };
}

/**
 * 列装饰器
 */
export function Column(options: {
  type: string;
  primary?: boolean;
  nullable?: boolean;
  unique?: boolean;
  default?: any;
}) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.columns) {
      target.constructor.columns = [];
    }
    target.constructor.columns.push({
      name: propertyKey,
      ...options,
    });
  };
}

/**
 * 关系装饰器
 */
export function OneToMany(targetEntity: any, foreignKey: string) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.relations) {
      target.constructor.relations = [];
    }
    target.constructor.relations.push({
      type: "one-to-many",
      property: propertyKey,
      targetEntity,
      foreignKey,
    });
  };
}

/**
 * 用户实体
 */
@Entity("users")
export class User {
  @Column({ type: "uuid", primary: true })
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ type: "timestamp", default: "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
```

### 2.2 ORM映射器

```typescript
/**
 * ORM映射器
 */
export class ORMMapper {
  /**
   * 实体到数据库映射
   */
  static entityToDB<T>(entity: T): any {
    const constructor = entity.constructor;
    const columns = constructor.columns || [];
    const dbObject: any = {};

    for (const column of columns) {
      const value = (entity as any)[column.name];
      if (value !== undefined) {
        dbObject[column.name] = value;
      }
    }

    return dbObject;
  }

  /**
   * 数据库到实体映射
   */
  static dbToEntity<T>(entityClass: new () => T, dbObject: any): T {
    const entity = new entityClass();
    const columns = entityClass.columns || [];

    for (const column of columns) {
      if (dbObject[column.name] !== undefined) {
        (entity as any)[column.name] = dbObject[column.name];
      }
    }

    return entity;
  }

  /**
   * 生成插入SQL
   */
  static generateInsertSQL<T>(entity: T): { sql: string; params: any[] } {
    const constructor = entity.constructor;
    const tableName = constructor.tableName;
    const columns = constructor.columns || [];
    const dbObject = this.entityToDB(entity);

    const columnNames = columns.filter(col => !col.primary).map(col => col.name);
    const placeholders = columnNames.map(() => "?");
    const values = columnNames.map(name => dbObject[name]);

    const sql = `
      INSERT INTO ${tableName} (${columnNames.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `;

    return { sql, params: values };
  }

  /**
   * 生成更新SQL
   */
  static generateUpdateSQL<T>(entity: T): { sql: string; params: any[] } {
    const constructor = entity.constructor;
    const tableName = constructor.tableName;
    const columns = constructor.columns || [];
    const dbObject = this.entityToDB(entity);

    const primaryColumn = columns.find(col => col.primary);
    if (!primaryColumn) {
      throw new Error("Entity must have a primary key");
    }

    const setClauses = columns.filter(col => !col.primary).map(col => `${col.name} = ?`);
    const values = [
      ...columns.filter(col => !col.primary).map(col => dbObject[col.name]),
      dbObject[primaryColumn.name],
    ];

    const sql = `
      UPDATE ${tableName}
      SET ${setClauses.join(", ")}
      WHERE ${primaryColumn.name} = ?
      RETURNING *
    `;

    return { sql, params: values };
  }

  /**
   * 生成删除SQL
   */
  static generateDeleteSQL<T>(entity: T): { sql: string; params: any[] } {
    const constructor = entity.constructor;
    const tableName = constructor.tableName;
    const columns = constructor.columns || [];
    const dbObject = this.entityToDB(entity);

    const primaryColumn = columns.find(col => col.primary);
    if (!primaryColumn) {
      throw new Error("Entity must have a primary key");
    }

    const sql = `
      DELETE FROM ${tableName}
      WHERE ${primaryColumn.name} = ?
    `;

    return { sql, params: [dbObject[primaryColumn.name]] };
  }
}
```

---

## 3. 数据仓储模式

### 3.1 仓储接口

```typescript
/**
 * @file 数据仓储模式
 * @description 实现数据仓储模式的设计和实现
 * @module repository-pattern
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 仓储接口
 */
export interface IRepository<T> {
  findById(id: any): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  findOne(options: FindOptions): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: any): Promise<boolean>;
  count(options?: FindOptions): Promise<number>;
  exists(options: FindOptions): Promise<boolean>;
}

/**
 * 查询选项
 */
export interface FindOptions {
  where?: any;
  orderBy?: { [key: string]: "ASC" | "DESC" };
  limit?: number;
  offset?: number;
  relations?: string[];
}

/**
 * 基础仓储
 */
export abstract class BaseRepository<T> implements IRepository<T> {
  constructor(
    protected entityClass: new () => T,
    protected connectionPool: ConnectionPool,
    protected cacheManager: CacheManager
  ) {}

  /**
   * 获取表名
   */
  protected getTableName(): string {
    return this.entityClass.prototype.tableName;
  }

  /**
   * 根据ID查找
   */
  async findById(id: any): Promise<T | null> {
    const cacheKey = `${this.getTableName()}:${id}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return ORMMapper.dbToEntity(this.entityClass, cached);
    }

    const connection = await this.connectionPool.getConnection();
    try {
      const tableName = this.getTableName();
      const result = await connection.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const entity = ORMMapper.dbToEntity(this.entityClass, result.rows[0]);
      await this.cacheManager.set(cacheKey, result.rows[0], 3600);

      return entity;
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 查找所有
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    const connection = await this.connectionPool.getConnection();
    try {
      const tableName = this.getTableName();
      let sql = `SELECT * FROM ${tableName}`;
      const params: any[] = [];

      if (options?.where) {
        const whereClause = this.buildWhereClause(options.where);
        sql += ` WHERE ${whereClause.sql}`;
        params.push(...whereClause.params);
      }

      if (options?.orderBy) {
        const orderByClause = Object.entries(options.orderBy)
          .map(([column, direction]) => `${column} ${direction}`)
          .join(", ");
        sql += ` ORDER BY ${orderByClause}`;
      }

      if (options?.limit) {
        sql += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      if (options?.offset) {
        sql += ` OFFSET $${params.length + 1}`;
        params.push(options.offset);
      }

      const result = await connection.query(sql, params);
      return result.rows.map(row => ORMMapper.dbToEntity(this.entityClass, row));
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 查找一个
   */
  async findOne(options: FindOptions): Promise<T | null> {
    const results = await this.findAll({ ...options, limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * 创建实体
   */
  async create(entity: T): Promise<T> {
    const { sql, params } = ORMMapper.generateInsertSQL(entity);

    const connection = await this.connectionPool.getConnection();
    try {
      const result = await connection.query(sql, params);
      const createdEntity = ORMMapper.dbToEntity(this.entityClass, result.rows[0]);

      // 清除缓存
      await this.cacheManager.delete(`${this.getTableName()}:*`);

      return createdEntity;
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 更新实体
   */
  async update(entity: T): Promise<T> {
    const { sql, params } = ORMMapper.generateUpdateSQL(entity);

    const connection = await this.connectionPool.getConnection();
    try {
      const result = await connection.query(sql, params);
      const updatedEntity = ORMMapper.dbToEntity(this.entityClass, result.rows[0]);

      // 清除缓存
      await this.cacheManager.delete(`${this.getTableName()}:*`);

      return updatedEntity;
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 删除实体
   */
  async delete(id: any): Promise<boolean> {
    const connection = await this.connectionPool.getConnection();
    try {
      const tableName = this.getTableName();
      const result = await connection.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

      // 清除缓存
      await this.cacheManager.delete(`${this.getTableName()}:*`);

      return result.rowCount > 0;
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 计数
   */
  async count(options?: FindOptions): Promise<number> {
    const connection = await this.connectionPool.getConnection();
    try {
      const tableName = this.getTableName();
      let sql = `SELECT COUNT(*) as count FROM ${tableName}`;
      const params: any[] = [];

      if (options?.where) {
        const whereClause = this.buildWhereClause(options.where);
        sql += ` WHERE ${whereClause.sql}`;
        params.push(...whereClause.params);
      }

      const result = await connection.query(sql, params);
      return parseInt(result.rows[0].count, 10);
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 检查是否存在
   */
  async exists(options: FindOptions): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }

  /**
   * 构建WHERE子句
   */
  protected buildWhereClause(where: any): { sql: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(where)) {
      if (typeof value === "object" && value !== null) {
        // 处理操作符
        for (const [operator, operand] of Object.entries(value)) {
          switch (operator) {
            case "$eq":
              conditions.push(`${key} = $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
            case "$ne":
              conditions.push(`${key} != $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
            case "$gt":
              conditions.push(`${key} > $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
            case "$lt":
              conditions.push(`${key} < $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
            case "$gte":
              conditions.push(`${key} >= $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
            case "$lte":
              conditions.push(`${key} <= $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
            case "$in":
              conditions.push(`${key} = ANY($${paramIndex})`);
              params.push(operand);
              paramIndex++;
              break;
            case "$like":
              conditions.push(`${key} LIKE $${paramIndex}`);
              params.push(operand);
              paramIndex++;
              break;
          }
        }
      } else {
        conditions.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    }

    return {
      sql: conditions.join(" AND "),
      params,
    };
  }
}
```

---

## 4. 查询构建器

### 4.1 查询构建器实现

```typescript
/**
 * @file 查询构建器
 * @description 实现灵活的查询构建器
 * @module query-builder
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 查询构建器
 */
export class QueryBuilder<T> {
  private selectColumns: string[] = ["*"];
  private whereConditions: string[] = [];
  private whereParams: any[] = [];
  private orderByColumns: string[] = [];
  private joinClauses: string[] = [];
  private groupByColumns: string[] = [];
  private havingConditions: string[] = [];
  private havingParams: any[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private paramIndex = 1;

  constructor(private tableName: string) {}

  /**
   * 选择列
   */
  select(...columns: string[]): this {
    this.selectColumns = columns;
    return this;
  }

  /**
   * WHERE条件
   */
  where(column: string, operator: string, value: any): this {
    this.whereConditions.push(`${column} ${operator} $${this.paramIndex}`);
    this.whereParams.push(value);
    this.paramIndex++;
    return this;
  }

  /**
   * WHERE IN条件
   */
  whereIn(column: string, values: any[]): this {
    this.whereConditions.push(`${column} = ANY($${this.paramIndex})`);
    this.whereParams.push(values);
    this.paramIndex++;
    return this;
  }

  /**
   * WHERE LIKE条件
   */
  whereLike(column: string, pattern: string): this {
    this.whereConditions.push(`${column} LIKE $${this.paramIndex}`);
    this.whereParams.push(pattern);
    this.paramIndex++;
    return this;
  }

  /**
   * WHERE BETWEEN条件
   */
  whereBetween(column: string, start: any, end: any): this {
    this.whereConditions.push(`${column} BETWEEN $${this.paramIndex} AND $${this.paramIndex + 1}`);
    this.whereParams.push(start, end);
    this.paramIndex += 2;
    return this;
  }

  /**
   * JOIN
   */
  join(table: string, onCondition: string, type: "INNER" | "LEFT" | "RIGHT" = "INNER"): this {
    this.joinClauses.push(`${type} JOIN ${table} ON ${onCondition}`);
    return this;
  }

  /**
   * ORDER BY
   */
  orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): this {
    this.orderByColumns.push(`${column} ${direction}`);
    return this;
  }

  /**
   * GROUP BY
   */
  groupBy(...columns: string[]): this {
    this.groupByColumns = columns;
    return this;
  }

  /**
   * HAVING
   */
  having(column: string, operator: string, value: any): this {
    this.havingConditions.push(`${column} ${operator} $${this.paramIndex}`);
    this.havingParams.push(value);
    this.paramIndex++;
    return this;
  }

  /**
   * LIMIT
   */
  limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  /**
   * OFFSET
   */
  offset(value: number): this {
    this.offsetValue = value;
    return this;
  }

  /**
   * 构建SQL
   */
  build(): { sql: string; params: any[] } {
    let sql = `SELECT ${this.selectColumns.join(", ")} FROM ${this.tableName}`;

    if (this.joinClauses.length > 0) {
      sql += " " + this.joinClauses.join(" ");
    }

    if (this.whereConditions.length > 0) {
      sql += " WHERE " + this.whereConditions.join(" AND ");
    }

    if (this.groupByColumns.length > 0) {
      sql += " GROUP BY " + this.groupByColumns.join(", ");
    }

    if (this.havingConditions.length > 0) {
      sql += " HAVING " + this.havingConditions.join(" AND ");
    }

    if (this.orderByColumns.length > 0) {
      sql += " ORDER BY " + this.orderByColumns.join(", ");
    }

    if (this.limitValue !== undefined) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== undefined) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return {
      sql,
      params: [...this.whereParams, ...this.havingParams],
    };
  }

  /**
   * 执行查询
   */
  async execute(connection: any): Promise<any[]> {
    const { sql, params } = this.build();
    const result = await connection.query(sql, params);
    return result.rows || result;
  }
}
```

---

## 5. 缓存策略

### 5.1 缓存管理器

```typescript
/**
 * @file 缓存策略
 * @description 实现数据访问层的缓存策略
 * @module caching
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 缓存策略
 */
export enum CacheStrategy {
  NO_CACHE = "NO_CACHE",
  READ_THROUGH = "READ_THROUGH",
  WRITE_THROUGH = "WRITE_THROUGH",
  WRITE_BEHIND = "WRITE_BEHIND",
  REFRESH_AHEAD = "REFRESH_AHEAD",
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  strategy: CacheStrategy;
  ttl: number; // Time to live in seconds
  maxSize?: number;
  evictionPolicy?: "LRU" | "LFU" | "FIFO";
}

/**
 * 缓存管理器
 */
export class CacheManager {
  private cache: Map<string, { data: any; expiry: number; accessCount: number }> = new Map();
  private maxSize: number = 1000;
  private evictionPolicy: "LRU" | "LFU" | "FIFO" = "LRU";

  constructor(private config: CacheConfig) {
    if (config.maxSize) {
      this.maxSize = config.maxSize;
    }
    if (config.evictionPolicy) {
      this.evictionPolicy = config.evictionPolicy;
    }
  }

  /**
   * 获取缓存
   */
  async get(key: string): Promise<any | null> {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    // 更新访问计数
    cached.accessCount++;

    return cached.data;
  }

  /**
   * 设置缓存
   */
  async set(key: string, data: any, ttl?: number): Promise<void> {
    const effectiveTTL = ttl || this.config.ttl;

    // 检查缓存大小
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evict();
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + effectiveTTL * 1000,
      accessCount: 0,
    });
  }

  /**
   * 删除缓存
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * 删除匹配模式的缓存
   */
  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace("*", ".*"));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 清空缓存
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * 淘汰缓存
   */
  private evict(): void {
    switch (this.evictionPolicy) {
      case "LRU":
        this.evictLRU();
        break;
      case "LFU":
        this.evictLFU();
        break;
      case "FIFO":
        this.evictFIFO();
        break;
    }
  }

  /**
   * LRU淘汰
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccessTime = Infinity;

    for (const [key, value] of this.cache.entries()) {
      const accessTime = value.expiry - this.config.ttl * 1000;
      if (accessTime < oldestAccessTime) {
        oldestAccessTime = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * LFU淘汰
   */
  private evictLFU(): void {
    let leastFrequentKey: string | null = null;
    let lowestAccessCount = Infinity;

    for (const [key, value] of this.cache.entries()) {
      if (value.accessCount < lowestAccessCount) {
        lowestAccessCount = value.accessCount;
        leastFrequentKey = key;
      }
    }

    if (leastFrequentKey) {
      this.cache.delete(leastFrequentKey);
    }
  }

  /**
   * FIFO淘汰
   */
  private evictFIFO(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
    }
  }

  /**
   * 获取缓存统计
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
    };
  }

  /**
   * 计算命中率
   */
  private calculateHitRate(): number {
    // 简化实现，实际应该跟踪命中和未命中次数
    return 0;
  }
}
```

---

## 6. 事务管理

### 6.1 事务实现

```typescript
/**
 * @file 事务管理
 * @description 实现数据库事务管理
 * @module transaction
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 事务隔离级别
 */
export enum IsolationLevel {
  READ_UNCOMMITTED = "READ UNCOMMITTED",
  READ_COMMITTED = "READ COMMITTED",
  REPEATABLE_READ = "REPEATABLE READ",
  SERIALIZABLE = "SERIALIZABLE",
}

/**
 * 事务配置
 */
export interface TransactionConfig {
  isolationLevel?: IsolationLevel;
  readOnly?: boolean;
  timeout?: number;
}

/**
 * 事务
 */
export class Transaction {
  private committed = false;
  private rolledBack = false;

  constructor(
    private connection: any,
    private connectionPool: ConnectionPool
  ) {}

  /**
   * 提交事务
   */
  async commit(): Promise<void> {
    if (this.committed || this.rolledBack) {
      throw new Error("Transaction already completed");
    }

    await this.connection.query("COMMIT");
    this.committed = true;
    this.connectionPool.releaseConnection(this.connection);
  }

  /**
   * 回滚事务
   */
  async rollback(): Promise<void> {
    if (this.committed || this.rolledBack) {
      throw new Error("Transaction already completed");
    }

    await this.connection.query("ROLLBACK");
    this.rolledBack = true;
    this.connectionPool.releaseConnection(this.connection);
  }

  /**
   * 执行查询
   */
  async query(sql: string, params?: any[]): Promise<any> {
    if (this.committed || this.rolledBack) {
      throw new Error("Transaction already completed");
    }

    return await this.connection.query(sql, params);
  }

  /**
   * 获取连接
   */
  getConnection(): any {
    return this.connection;
  }
}

/**
 * 事务管理器
 */
export class TransactionManager {
  constructor(private connectionPool: ConnectionPool) {}

  /**
   * 开始事务
   */
  async beginTransaction(config?: TransactionConfig): Promise<Transaction> {
    const connection = await this.connectionPool.getConnection();

    try {
      // 设置隔离级别
      if (config?.isolationLevel) {
        await connection.query(`SET TRANSACTION ISOLATION LEVEL ${config.isolationLevel}`);
      }

      // 开始事务
      await connection.query("BEGIN");

      return new Transaction(connection, this.connectionPool);
    } catch (error) {
      this.connectionPool.releaseConnection(connection);
      throw error;
    }
  }

  /**
   * 在事务中执行
   */
  async runInTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>,
    config?: TransactionConfig
  ): Promise<T> {
    const transaction = await this.beginTransaction(config);

    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
```

---

## 7. 数据库连接池

### 7.1 连接池实现

```typescript
/**
 * @file 数据库连接池
 * @description 实现数据库连接池管理
 * @module connection-pool
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 连接池配置
 */
export interface ConnectionPoolConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  min: number;
  max: number;
  acquireTimeoutMillis: number;
  idleTimeoutMillis: number;
}

/**
 * 连接池
 */
export class ConnectionPool {
  private pool: any[] = [];
  private waitingQueue: Array<(connection: any) => void> = [];
  private activeConnections = 0;

  constructor(private config: ConnectionPoolConfig) {
    this.initializePool();
  }

  /**
   * 初始化连接池
   */
  private async initializePool(): Promise<void> {
    for (let i = 0; i < this.config.min; i++) {
      const connection = await this.createConnection();
      this.pool.push(connection);
    }
  }

  /**
   * 创建连接
   */
  private async createConnection(): Promise<any> {
    // 实际实现应该使用数据库驱动创建连接
    return {
      query: async (sql: string, params?: any[]) => {
        // 执行查询
        return { rows: [] };
      },
      release: () => {},
    };
  }

  /**
   * 获取连接
   */
  async getConnection(): Promise<any> {
    // 如果有空闲连接，直接返回
    if (this.pool.length > 0) {
      const connection = this.pool.pop();
      this.activeConnections++;
      return connection;
    }

    // 如果未达到最大连接数，创建新连接
    if (this.activeConnections < this.config.max) {
      const connection = await this.createConnection();
      this.activeConnections++;
      return connection;
    }

    // 等待可用连接
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.indexOf(resolve);
        if (index > -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error("Connection acquire timeout"));
      }, this.config.acquireTimeoutMillis);

      this.waitingQueue.push(connection => {
        clearTimeout(timeout);
        resolve(connection);
      });
    });
  }

  /**
   * 释放连接
   */
  releaseConnection(connection: any): void {
    this.activeConnections--;

    // 如果有等待的请求，将连接分配给它
    if (this.waitingQueue.length > 0) {
      const nextWaiting = this.waitingQueue.shift();
      if (nextWaiting) {
        this.activeConnections++;
        nextWaiting(connection);
        return;
      }
    }

    // 否则将连接放回池中
    this.pool.push(connection);
  }

  /**
   * 关闭连接池
   */
  async close(): Promise<void> {
    // 关闭所有连接
    for (const connection of this.pool) {
      await connection.release();
    }
    this.pool = [];
    this.activeConnections = 0;
  }

  /**
   * 获取连接池状态
   */
  getStatus(): {
    total: number;
    active: number;
    idle: number;
    waiting: number;
  } {
    return {
      total: this.activeConnections + this.pool.length,
      active: this.activeConnections,
      idle: this.pool.length,
      waiting: this.waitingQueue.length,
    };
  }
}
```

---

## 8. 数据迁移

### 8.1 迁移系统

```typescript
/**
 * @file 数据迁移
 * @description 实现数据库迁移系统
 * @module migration
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 迁移接口
 */
export interface Migration {
  name: string;
  version: string;
  up: (connection: any) => Promise<void>;
  down: (connection: any) => Promise<void>;
}

/**
 * 迁移管理器
 */
export class MigrationManager {
  private migrations: Map<string, Migration> = new Map();

  constructor(private connectionPool: ConnectionPool) {
    this.initializeMigrationTable();
  }

  /**
   * 初始化迁移表
   */
  private async initializeMigrationTable(): Promise<void> {
    const connection = await this.connectionPool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          version VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 注册迁移
   */
  registerMigration(migration: Migration): void {
    this.migrations.set(migration.version, migration);
  }

  /**
   * 执行迁移
   */
  async migrate(): Promise<void> {
    const connection = await this.connectionPool.getConnection();
    try {
      // 获取已执行的迁移
      const executedResult = await connection.query("SELECT version FROM migrations ORDER BY version");
      const executedVersions = new Set(executedResult.rows.map((row: any) => row.version));

      // 执行未执行的迁移
      const sortedMigrations = Array.from(this.migrations.values()).sort((a, b) => a.version.localeCompare(b.version));

      for (const migration of sortedMigrations) {
        if (!executedVersions.has(migration.version)) {
          console.log(`Executing migration: ${migration.name}`);

          await connection.query("BEGIN");
          try {
            await migration.up(connection);
            await connection.query("INSERT INTO migrations (version, name) VALUES ($1, $2)", [
              migration.version,
              migration.name,
            ]);
            await connection.query("COMMIT");

            console.log(`Migration ${migration.name} completed`);
          } catch (error) {
            await connection.query("ROLLBACK");
            console.error(`Migration ${migration.name} failed:`, error);
            throw error;
          }
        }
      }
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 回滚迁移
   */
  async rollback(targetVersion?: string): Promise<void> {
    const connection = await this.connectionPool.getConnection();
    try {
      // 获取已执行的迁移
      const executedResult = await connection.query("SELECT version FROM migrations ORDER BY version DESC");
      const executedVersions = executedResult.rows.map((row: any) => row.version);

      // 回滚迁移
      for (const version of executedVersions) {
        if (targetVersion && version === targetVersion) {
          break;
        }

        const migration = this.migrations.get(version);
        if (migration) {
          console.log(`Rolling back migration: ${migration.name}`);

          await connection.query("BEGIN");
          try {
            await migration.down(connection);
            await connection.query("DELETE FROM migrations WHERE version = $1", [version]);
            await connection.query("COMMIT");

            console.log(`Migration ${migration.name} rolled back`);
          } catch (error) {
            await connection.query("ROLLBACK");
            console.error(`Migration ${migration.name} rollback failed:`, error);
            throw error;
          }
        }
      }
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }

  /**
   * 获取迁移状态
   */
  async getStatus(): Promise<
    Array<{
      version: string;
      name: string;
      executed: boolean;
      executedAt?: Date;
    }>
  > {
    const connection = await this.connectionPool.getConnection();
    try {
      const executedResult = await connection.query(
        "SELECT version, name, executed_at FROM migrations ORDER BY version"
      );
      const executedMigrations = new Map(
        executedResult.rows.map((row: any) => [row.version, { name: row.name, executedAt: row.executed_at }])
      );

      const sortedMigrations = Array.from(this.migrations.values()).sort((a, b) => a.version.localeCompare(b.version));

      return sortedMigrations.map(migration => {
        const executed = executedMigrations.get(migration.version);
        return {
          version: migration.version,
          name: migration.name,
          executed: !!executed,
          executedAt: executed?.executedAt,
        };
      });
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }
}
```

---

## 9. 性能优化

### 9.1 查询优化

```typescript
/**
 * @file 性能优化
 * @description 实现数据访问层的性能优化
 * @module performance-optimization
 * @author YYC³
 * @version 1.0.0
 */

/**
 * 查询优化器
 */
export class QueryOptimizer {
  /**
   * 分析查询
   */
  static analyzeQuery(query: string): {
    complexity: number;
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let complexity = 0;

    // 检查SELECT *
    if (query.includes("SELECT *")) {
      suggestions.push("Avoid SELECT *, specify only needed columns");
      complexity += 10;
    }

    // 检查子查询
    if (query.includes("(") && query.includes(")")) {
      suggestions.push("Consider using JOINs instead of subqueries");
      complexity += 20;
    }

    // 检查LIKE操作符
    if (query.match(/LIKE\s+['"].*%/)) {
      suggestions.push("Avoid leading wildcards in LIKE queries");
      complexity += 15;
    }

    // 检查ORDER BY
    if (query.includes("ORDER BY")) {
      complexity += 5;
    }

    // 检查GROUP BY
    if (query.includes("GROUP BY")) {
      complexity += 10;
    }

    return { complexity, suggestions };
  }

  /**
   * 添加索引建议
   */
  static suggestIndexes(query: string): string[] {
    const suggestions: string[] = [];
    const whereMatches = query.match(/WHERE\s+(\w+)/g);
    const joinMatches = query.match(/JOIN\s+\w+\s+ON\s+(\w+)/g);

    if (whereMatches) {
      for (const match of whereMatches) {
        const column = match.replace("WHERE ", "");
        suggestions.push(`Consider adding index on ${column}`);
      }
    }

    if (joinMatches) {
      for (const match of joinMatches) {
        const column = match.replace(/JOIN\s+\w+\s+ON\s+/, "");
        suggestions.push(`Consider adding index on ${column} for JOIN`);
      }
    }

    return suggestions;
  }
}
```

### 9.2 批量操作

```typescript
/**
 * 批量操作器
 */
export class BatchOperator {
  /**
   * 批量插入
   */
  static async batchInsert<T>(
    connection: any,
    tableName: string,
    entities: T[],
    batchSize: number = 100
  ): Promise<void> {
    const batches = this.chunk(entities, batchSize);

    for (const batch of batches) {
      const columns = Object.keys(batch[0]);
      const placeholders = columns.map(() => "?").join(", ");
      const sql = `
        INSERT INTO ${tableName} (${columns.join(", ")})
        VALUES (${placeholders})
      `;

      const values = batch.flatMap(entity => columns.map(col => (entity as any)[col]));

      await connection.query(sql, values);
    }
  }

  /**
   * 批量更新
   */
  static async batchUpdate<T>(
    connection: any,
    tableName: string,
    entities: T[],
    batchSize: number = 100
  ): Promise<void> {
    const batches = this.chunk(entities, batchSize);

    for (const batch of batches) {
      const columns = Object.keys(batch[0]).filter(col => col !== "id");
      const setClause = columns.map(col => `${col} = ?`).join(", ");
      const sql = `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE id = ?
      `;

      for (const entity of batch) {
        const values = [...columns.map(col => (entity as any)[col]), (entity as any).id];
        await connection.query(sql, values);
      }
    }
  }

  /**
   * 分块
   */
  private static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

---

## 10. 数据访问测试

### 10.1 仓储测试

```typescript
/**
 * @file 数据访问测试
 * @description 实现数据访问层的测试策略
 * @module data-access-testing
 * @author YYC³
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * 仓储测试基类
 */
export abstract class RepositoryTestBase {
  protected repository: any;
  protected testData: any[] = [];

  /**
   * 设置测试环境
   */
  abstract setup(): Promise<void>;

  /**
   * 清理测试环境
   */
  abstract teardown(): Promise<void>;

  /**
   * 创建测试数据
   */
  protected createTestData(): any[] {
    return [];
  }

  /**
   * 清理测试数据
   */
  protected async cleanupTestData(): Promise<void> {
    for (const data of this.testData) {
      if (data.id) {
        await this.repository.delete(data.id);
      }
    }
  }
}

/**
 * 用户仓储测试
 */
describe("UserRepository", () => {
  let test: RepositoryTestBase;

  beforeEach(async () => {
    test = new UserRepositoryTest();
    await test.setup();
  });

  afterEach(async () => {
    await test.teardown();
  });

  it("should create a user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const user = await test.repository.create(userData);

    expect(user).toHaveProperty("id");
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  it("should find user by id", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const createdUser = await test.repository.create(userData);
    const foundUser = await test.repository.findById(createdUser.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser.id).toBe(createdUser.id);
  });

  it("should find all users", async () => {
    const users = await test.repository.findAll();

    expect(Array.isArray(users)).toBe(true);
  });

  it("should update user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const createdUser = await test.repository.create(userData);
    createdUser.name = "Updated Name";

    const updatedUser = await test.repository.update(createdUser);

    expect(updatedUser.name).toBe("Updated Name");
  });

  it("should delete user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const createdUser = await test.repository.create(userData);
    const deleted = await test.repository.delete(createdUser.id);

    expect(deleted).toBe(true);

    const foundUser = await test.repository.findById(createdUser.id);
    expect(foundUser).toBeNull();
  });

  it("should count users", async () => {
    const count = await test.repository.count();

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it("should check user exists", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await test.repository.create(userData);

    const exists = await test.repository.exists({
      email: "test@example.com",
    });

    expect(exists).toBe(true);
  });
});

class UserRepositoryTest extends RepositoryTestBase {
  async setup(): Promise<void> {
    // 设置测试环境
    this.testData = this.createTestData();
  }

  async teardown(): Promise<void> {
    // 清理测试环境
    await this.cleanupTestData();
  }
}
```

---

## 📄 文档标尾 (Footer)

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**」

## 概述

### 架构概述

本架构文档详细描述了系统的整体架构设计，包括架构目标、设计原则、技术选型等关键信息。

#### 架构目标

- **高可用性**：确保系统稳定运行，故障自动恢复
- **高性能**：响应迅速，资源利用高效
- **高安全性**：数据加密，权限严格控制
- **高扩展性**：模块化设计，易于功能扩展
- **高可维护性**：代码清晰，文档完善

#### 设计原则

- **单一职责**：每个组件只负责一个功能
- **开闭原则**：对扩展开放，对修改关闭
- **依赖倒置**：依赖抽象而非具体实现
- **接口隔离**：使用细粒度的接口
- **迪米特法则**：最少知识原则

## 架构设计

### 架构设计

#### 整体架构

系统采用分层架构设计，包括：

- **表现层**：负责用户界面和交互
- **应用层**：处理业务逻辑
- **业务层**：实现核心业务功能
- **数据层**：管理数据存储和访问
- **基础设施层**：提供基础服务支持

#### 模块划分

系统划分为多个独立模块，每个模块负责特定功能：

- **用户模块**：用户管理和认证
- **订单模块**：订单处理和管理
- **支付模块**：支付集成和处理
- **通知模块**：消息通知和推送
- **报表模块**：数据统计和分析

#### 技术选型

- **前端框架**：React / Vue
- **后端框架**：Node.js / Express / Fastify
- **数据库**：PostgreSQL / MongoDB
- **缓存**：Redis
- **消息队列**：RabbitMQ / Kafka

## 技术实现

### 技术实现

#### 核心技术栈

```typescript
// 核心依赖
{
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "redis": "^4.6.0"
  }
}
```

#### 关键实现

1. **服务层实现**

```typescript
class UserService {
  async createUser(data: CreateUserDto): Promise<User> {
    // 验证输入
    this.validateUserData(data);

    // 加密密码
    const hashedPassword = await this.hashPassword(data.password);

    // 创建用户
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
```

2. **中间件实现**

```typescript
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "未授权访问" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "令牌无效" });
  }
};
```

## 部署方案

### 部署方案

#### 部署架构

采用容器化部署方案，使用Docker和Kubernetes进行编排。

#### 部署步骤

1. **环境准备**

```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 安装Kubernetes
# 根据操作系统选择相应的安装方式
```

2. **构建镜像**

```bash
# 构建应用镜像
docker build -t yyc3-app:latest .

# 推送到镜像仓库
docker push registry.example.com/yyc3-app:latest
```

3. **部署到Kubernetes**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-app
  template:
    metadata:
      labels:
        app: yyc3-app
    spec:
      containers:
        - name: app
          image: registry.example.com/yyc3-app:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
```

4. **配置服务**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-app-service
spec:
  selector:
    app: yyc3-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## 性能优化

### 性能优化

#### 前端优化

1. **代码分割**

```typescript
// 路由级别代码分割
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

2. **缓存策略**

```typescript
// React.memo 避免不必要的重渲染
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.value}</div>;
});

// useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

#### 后端优化

1. **数据库优化**

```typescript
// 使用索引
CREATE INDEX idx_user_email ON users(email);

// 查询优化
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  },
  where: {
    active: true
  },
  take: 100
});
```

2. **缓存策略**

```typescript
// Redis缓存
async function getUser(id: string): Promise<User> {
  const cacheKey = `user:${id}`;

  // 尝试从缓存获取
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 从数据库获取
  const user = await prisma.user.findUnique({ where: { id } });

  // 写入缓存
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}
```

## 安全考虑

### 安全考虑

#### 认证与授权

1. **JWT认证**

```typescript
// 生成JWT令牌
const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

// 验证JWT令牌
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

2. **RBAC授权**

```typescript
// 角色权限检查
function checkPermission(user: User, resource: string, action: string): boolean {
  const permissions = rolePermissions[user.role];
  return permissions.some(p => p.resource === resource && p.actions.includes(action));
}
```

#### 数据保护

1. **输入验证**

```typescript
// 使用Zod进行输入验证
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/),
  name: z.string().min(2),
});

const validated = createUserSchema.parse(input);
```

2. **数据加密**

```typescript
// 使用bcrypt加密密码
const hashedPassword = await bcrypt.hash(password, 10);

// 验证密码
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### 安全头配置

```typescript
// Express安全头配置
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true,
  })
);
```

## 监控告警

### 监控告警

#### 监控指标

1. **系统指标**

- CPU使用率
- 内存使用率
- 磁盘使用率
- 网络I/O

2. **应用指标**

- 请求量(RPS)
- 响应时间
- 错误率
- 并发用户数

3. **业务指标**

- 用户注册数
- 订单创建数
- 支付成功率
- 用户活跃度

#### 监控工具

```typescript
// Prometheus指标收集
import { Counter, Histogram, Gauge } from "prom-client";

const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const responseTime = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"],
});

// 使用中间件记录指标
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
    responseTime.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
      },
      duration
    );
  });

  next();
});
```

#### 告警规则

```yaml
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "API错误率过高"
          description: "5分钟内错误率超过5%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API响应时间过长"
          description: "95%分位响应时间超过1秒"
```

## 最佳实践

### 最佳实践

#### 代码规范

1. **命名规范**

```typescript
// 变量：camelCase
const userName = "John";

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 类：PascalCase
class UserService {}

// 接口：PascalCase，前缀I（可选）
interface IUserService {}
```

2. **注释规范**

```typescript
/**
 * 创建用户
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns 创建的用户对象
 * @throws {Error} 当邮箱已存在时抛出错误
 */
async function createUser(email: string, password: string): Promise<User> {
  // 实现
}
```

#### 错误处理

```typescript
// 统一错误处理
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // 记录未预期的错误
  logger.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    error: "服务器内部错误",
  });
});
```

#### 日志记录

```typescript
// 结构化日志
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// 使用日志
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Database connection failed", { error: error.message });
```

## 最佳实践

### 最佳实践

#### 代码规范

1. **命名规范**

```typescript
// 变量：camelCase
const userName = "John";

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 类：PascalCase
class UserService {}

// 接口：PascalCase，前缀I（可选）
interface IUserService {}
```

2. **注释规范**

```typescript
/**
 * 创建用户
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns 创建的用户对象
 * @throws {Error} 当邮箱已存在时抛出错误
 */
async function createUser(email: string, password: string): Promise<User> {
  // 实现
}
```

#### 错误处理

```typescript
// 统一错误处理
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // 记录未预期的错误
  logger.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    error: "服务器内部错误",
  });
});
```

#### 日志记录

```typescript
// 结构化日志
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// 使用日志
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Database connection failed", { error: error.message });
```

## 相关文档

- [中间件集成架构文档](YYC3-Cater-开发实施/架构类/04-YYC3-Cater--架构类-中间件集成架构文档.md) - YYC3-Cater-开发实施/架构类
- [AI模型开发与集成文档](YYC3-Cater-开发实施/架构类/05-YYC3-Cater--架构类-AI模型开发与集成文档.md) - YYC3-Cater-开发实施/架构类
- [代码架构实现说明书](YYC3-Cater-开发实施/架构类/01-YYC3-Cater--架构类-代码架构实现说明书.md) - YYC3-Cater-开发实施/架构类
- [API接口实现文档](YYC3-Cater-开发实施/架构类/02-YYC3-Cater--架构类-API接口实现文档.md) - YYC3-Cater-开发实施/架构类
- [YYC3 智枢服务化平台 - 自动迭代实施计划资源准备清单](YYC3-Cater-开发实施/架构类/11-YYC3-Cater--架构类-自动迭代实施计划资源准备清单.md) - YYC3-Cater-开发实施/架构类

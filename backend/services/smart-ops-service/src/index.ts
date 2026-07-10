#!/usr/bin/env node

/**
 * @file SmartOpsService - 智能运维服务主入口
 * @description 提供资源预测调度、故障自愈、性能自优化和智能备份恢复等智能运维能力
 * @author YYC³团队
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ResourcePredictionService } from './services/resource-prediction';
import { FaultRecoveryService } from './services/fault-recovery';
import { PerformanceOptimizationService } from './services/performance-optimization';
import { BackupRecoveryService } from './services/backup-recovery';
import { OpsController } from './controllers/ops-controller';
import { config } from './config/config';

class SmartOpsService {
  private app: express.Application;
  private resourcePredictionService: ResourcePredictionService;
  private faultRecoveryService: FaultRecoveryService;
  private performanceOptimizationService: PerformanceOptimizationService;
  private backupRecoveryService: BackupRecoveryService;
  private opsController: OpsController;

  constructor() {
    this.app = express();

    // 初始化服务
    this.resourcePredictionService = new ResourcePredictionService();
    this.faultRecoveryService = new FaultRecoveryService();
    this.performanceOptimizationService = new PerformanceOptimizationService();
    this.backupRecoveryService = new BackupRecoveryService();

    // 初始化控制器
    this.opsController = new OpsController(
      this.resourcePredictionService,
      this.faultRecoveryService,
      this.performanceOptimizationService,
      this.backupRecoveryService,
    );

    this.configureMiddleware();
    this.configureRoutes();
    this.startScheduledTasks();
  }

  /**
   * 配置中间件
   */
  private configureMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * 配置路由
   */
  private configureRoutes(): void {
    // 健康检查
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', service: 'smart-ops-service', timestamp: new Date().toISOString() });
    });

    // API路由
    const apiRouter = express.Router();

    // 资源预测相关路由
    apiRouter.get('/resource-prediction', this.opsController.getResourcePrediction.bind(this.opsController));
    apiRouter.post(
      '/resource-prediction/schedule',
      this.opsController.scheduleResourcePrediction.bind(this.opsController),
    );

    // 故障自愈相关路由
    apiRouter.get('/fault-recovery/status', this.opsController.getFaultRecoveryStatus.bind(this.opsController));
    apiRouter.post('/fault-recovery/manual', this.opsController.manualFaultRecovery.bind(this.opsController));

    // 性能优化相关路由
    apiRouter.get('/performance/optimization', this.opsController.getPerformanceOptimization.bind(this.opsController));
    apiRouter.post('/performance/optimize', this.opsController.optimizePerformance.bind(this.opsController));

    // 备份恢复相关路由
    apiRouter.get('/backup/status', this.opsController.getBackupStatus.bind(this.opsController));
    apiRouter.post('/backup/schedule', this.opsController.scheduleBackup.bind(this.opsController));
    apiRouter.post('/backup/restore', this.opsController.restoreBackup.bind(this.opsController));

    // 挂载API路由
    this.app.use('/api/v1', apiRouter);
  }

  /**
   * 启动定时任务
   */
  private startScheduledTasks(): void {
    // 启动资源预测定时任务
    this.resourcePredictionService.startScheduledPredictions();

    // 启动故障检测定时任务
    this.faultRecoveryService.startScheduledFaultDetection();

    // 启动性能优化定时任务
    this.performanceOptimizationService.startScheduledOptimizations();

    // 启动备份定时任务
    this.backupRecoveryService.startScheduledBackups();
  }

  /**
   * 启动服务
   */
  public start(): void {
    const port = config.server.port || 3205;
    const host = config.server.host || '0.0.0.0';

    this.app.listen(port, host, () => {
      console.log(`[SmartOpsService] 🚀 服务启动成功！`);
      console.log(`[SmartOpsService] 📍 监听地址: http://${host}:${port}`);
      console.log(`[SmartOpsService] 📊 API文档: http://${host}:${port}/api/v1`);
    });
  }
}

// 启动服务
if (require.main === module) {
  const service = new SmartOpsService();
  service.start();
}

export { SmartOpsService };

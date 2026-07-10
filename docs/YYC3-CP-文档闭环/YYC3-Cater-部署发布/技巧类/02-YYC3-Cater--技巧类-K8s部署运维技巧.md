---

**@file**：YYC³-K8s部署运维技巧
**@description**：YYC³餐饮行业智能化平台的K8s部署运维技巧
**@author**：YYC³
**@version**：v1.0.0
**@created**：2025-01-30
**@updated**：2025-01-30
**@status**：published
**@tags**：YYC³,文档

---

# 🔖 YYC³ K8s部署运维技巧

> **_YanYuCloudCube_**
> **标语**：言启象限 | 语枢未来
> **_Words Initiate Quadrants, Language Serves as Core for the Future_**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 📋 文档信息

| 属性         | 内容                       |
| ------------ | -------------------------- |
| **文档标题** | YYC³ K8s部署运维技巧       |
| **文档类型** | 技巧类文档                 |
| **所属阶段** | 部署发布                   |
| **遵循规范** | YYC³ 团队标准化规范 v1.0.0 |
| **版本号**   | v1.0.0                     |
| **创建日期** | 2025-01-30                 |
| **作者**     | YYC³ Team                  |
| **更新日期** | 2025-01-30                 |

---

## 📑 目录

1. [K8s基础配置](#1-k8s基础配置)
2. [部署管理](#2-部署管理)
3. [服务发现](#3-服务发现)
4. [配置管理](#4-配置管理)
5. [存储管理](#5-存储管理)
6. [自动扩缩容](#6-自动扩缩容)
7. [滚动更新](#7-滚动更新)
8. [监控告警](#8-监控告警)
9. [故障排查](#9-故障排查)
10. [最佳实践](#10-最佳实践)

---

## 1. 概述

### 1.1 功能说明

### 1.2 技术栈

### 1.3 开发环境

## 2. 实现方案

### 2.1 代码结构

### 2.2 核心逻辑

### 2.3 数据处理

## 3. 接口文档

### 3.1 API接口

### 3.2 请求参数

### 3.3 响应格式

## 4. 测试方案

### 4.1 单元测试

### 4.2 集成测试

### 4.3 测试用例

## 5. 部署指南

### 5.1 环境准备

### 5.2 部署步骤

### 5.3 验证方法

## 6. 常见问题

### 6.1 问题排查

### 6.2 解决方案

## 1. K8s基础配置

### 1.1 Deployment配置

```yaml
# web-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web
  namespace: yyc3-production
  labels:
    app: yyc3-web
    version: v1.0.0
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: yyc3-web
        version: v1.0.0
    spec:
      serviceAccountName: yyc3-web
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
        - name: web
          image: yyc3/web:1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 3200
              protocol: TCP
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3200"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: yyc3-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: yyc3-secrets
                  key: redis-url
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 3200
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            successThreshold: 1
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 3200
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            successThreshold: 1
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /startup
              port: 3200
            initialDelaySeconds: 0
            periodSeconds: 5
            timeoutSeconds: 3
            successThreshold: 1
            failureThreshold: 30
          lifecycle:
            preStop:
              exec:
                command:
                  - sh
                  - -c
                  - sleep 15
          volumeMounts:
            - name: config
              mountPath: /app/config
              readOnly: true
            - name: logs
              mountPath: /app/logs
      volumes:
        - name: config
          configMap:
            name: yyc3-web-config
        - name: logs
          emptyDir: {}
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - yyc3-web
                topologyKey: kubernetes.io/hostname
      nodeSelector:
        node-role.kubernetes.io/worker: "true"
      tolerations:
        - key: "workload"
          operator: "Equal"
          value: "web"
          effect: "NoSchedule"
```

### 1.2 Service配置

```yaml
# web-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-web
  namespace: yyc3-production
  labels:
    app: yyc3-web
spec:
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
  ports:
    - name: http
      port: 80
      targetPort: 3200
      protocol: TCP
  selector:
    app: yyc3-web
```

### 1.3 Ingress配置

```yaml
# web-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: yyc3-web
  namespace: yyc3-production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-connections: "50"
    nginx.ingress.kubernetes.io/limit-burst: "10"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
    - hosts:
        - web.yyc3.com
      secretName: yyc3-web-tls
  rules:
    - host: web.yyc3.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: yyc3-web
                port:
                  number: 80
```

---

## 2. 部署管理

### 2.1 滚动更新

```bash
#!/bin/bash

# 滚动更新脚本

NAMESPACE="yyc3-production"
DEPLOYMENT="yyc3-web"
NEW_IMAGE="yyc3/web:1.1.0"

echo "=== 滚动更新 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"
echo "新镜像: $NEW_IMAGE"

# 1. 检查当前部署状态
echo ""
echo "1. 检查当前部署状态:"
kubectl get deployment $DEPLOYMENT -n $NAMESPACE

# 2. 设置滚动更新策略
echo ""
echo "2. 设置滚动更新策略:"
kubectl set image deployment/$DEPLOYMENT \
  web=$NEW_IMAGE \
  -n $NAMESPACE \
  --record

# 3. 监控更新进度
echo ""
echo "3. 监控更新进度:"
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE

# 4. 查看更新历史
echo ""
echo "4. 查看更新历史:"
kubectl rollout history deployment/$DEPLOYMENT -n $NAMESPACE

# 5. 查看Pod状态
echo ""
echo "5. 查看Pod状态:"
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT

echo ""
echo "✅ 滚动更新完成"
```

### 2.2 回滚部署

```bash
#!/bin/bash

# 回滚部署脚本

NAMESPACE="yyc3-production"
DEPLOYMENT="yyc3-web"

echo "=== 回滚部署 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"

# 1. 查看更新历史
echo ""
echo "1. 查看更新历史:"
kubectl rollout history deployment/$DEPLOYMENT -n $NAMESPACE

# 2. 回滚到上一个版本
echo ""
echo "2. 回滚到上一个版本:"
kubectl rollout undo deployment/$DEPLOYMENT -n $NAMESPACE

# 3. 监控回滚进度
echo ""
echo "3. 监控回滚进度:"
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE

# 4. 查看Pod状态
echo ""
echo "4. 查看Pod状态:"
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT

echo ""
echo "✅ 回滚完成"
```

### 2.3 金丝雀发布

```yaml
# web-canary-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web-canary
  namespace: yyc3-production
  labels:
    app: yyc3-web
    track: canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: yyc3-web
      track: canary
  template:
    metadata:
      labels:
        app: yyc3-web
        track: canary
        version: v1.1.0
    spec:
      containers:
        - name: web
          image: yyc3/web:1.1.0
          ports:
            - containerPort: 3200
          env:
            - name: NODE_ENV
              value: "production"
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 3200
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3200
            initialDelaySeconds: 10
            periodSeconds: 5
```

---

## 3. 服务发现

### 3.1 Headless Service

```yaml
# web-headless-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-web-headless
  namespace: yyc3-production
  labels:
    app: yyc3-web
spec:
  clusterIP: None
  selector:
    app: yyc3-web
  ports:
    - name: http
      port: 3200
      targetPort: 3200
      protocol: TCP
```

### 3.2 ExternalName Service

```yaml
# external-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-external-db
  namespace: yyc3-production
spec:
  type: ExternalName
  externalName: postgres.yyc3.com
  ports:
    - port: 5432
```

### 3.3 Service Mesh配置

```yaml
# istio-gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: yyc3-gateway
  namespace: yyc3-production
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - "web.yyc3.com"
    - port:
        number: 443
        name: https
        protocol: HTTPS
      tls:
        mode: SIMPLE
        credentialName: yyc3-web-tls
      hosts:
        - "web.yyc3.com"
---
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: yyc3-web
  namespace: yyc3-production
spec:
  hosts:
    - "web.yyc3.com"
  gateways:
    - yyc3-gateway
  http:
    - match:
        - uri:
            prefix: /
      route:
        - destination:
            host: yyc3-web
            port:
              number: 80
      timeout: 60s
      retries:
        attempts: 3
        perTryTimeout: 30s
```

---

## 4. 配置管理

### 4.1 ConfigMap

```yaml
# web-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: yyc3-web-config
  namespace: yyc3-production
  labels:
    app: yyc3-web
data:
  app.config.json: |
    {
      "app": {
        "name": "YYC³ Web",
        "version": "1.0.0",
        "environment": "production"
      },
      "server": {
        "port": 3200,
        "host": "0.0.0.0"
      },
      "logging": {
        "level": "info",
        "format": "json"
      },
      "features": {
        "enableCache": true,
        "enableCompression": true,
        "enableRateLimit": true
      }
    }
  nginx.conf: |
    user nginx;
    worker_processes auto;
    error_log /var/log/nginx/error.log warn;
    pid /var/run/nginx.pid;

    events {
      worker_connections 1024;
    }

    http {
      include /etc/nginx/mime.types;
      default_type application/octet-stream;

      log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

      access_log /var/log/nginx/access.log main;

      sendfile on;
      tcp_nopush on;
      keepalive_timeout 65;
      gzip on;

      upstream backend {
        server localhost:3200;
      }

      server {
        listen 80;
        server_name localhost;

        location / {
          proxy_pass http://backend;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }
      }
    }
```

### 4.2 Secret

```yaml
# web-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: yyc3-secrets
  namespace: yyc3-production
  labels:
    app: yyc3-web
type: Opaque
stringData:
  database-url: "postgresql://yyc3:password@postgres:5432/yyc3db"
  redis-url: "redis://:password@redis:6379"
  jwt-secret: "your-jwt-secret-key-here"
  api-key: "your-api-key-here"
---
apiVersion: v1
kind: Secret
metadata:
  name: yyc3-tls
  namespace: yyc3-production
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi...
  tls.key: LS0tLS1CRUdJTi...
```

### 4.3 环境变量注入

```yaml
# web-deployment-with-config.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web
  namespace: yyc3-production
spec:
  template:
    spec:
      containers:
        - name: web
          image: yyc3/web:1.0.0
          env:
            # 从ConfigMap注入
            - name: APP_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: yyc3-web-config
                  key: app.config.json
            # 从Secret注入
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: yyc3-secrets
                  key: database-url
            # 直接设置
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3200"
            # 从字段注入
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          envFrom:
            - configMapRef:
                name: yyc3-web-config
            - secretRef:
                name: yyc3-secrets
```

---

## 5. 存储管理

### 5.1 PersistentVolume

```yaml
# postgres-pv.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: yyc3-postgres-pv
  namespace: yyc3-production
  labels:
    app: postgres
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: /data/postgres
    type: DirectoryOrCreate
```

### 5.2 PersistentVolumeClaim

```yaml
# postgres-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: yyc3-postgres-pvc
  namespace: yyc3-production
  labels:
    app: postgres
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### 5.3 StorageClass

```yaml
# storageclass.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
  namespace: yyc3-production
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  iopsPerGB: "10"
  encrypted: "true"
  fsType: ext4
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
  namespace: yyc3-production
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: Immediate
```

---

## 6. 自动扩缩容

### 6.1 Horizontal Pod Autoscaler

```yaml
# web-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: yyc3-web-hpa
  namespace: yyc3-production
  labels:
    app: yyc3-web
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: yyc3-web
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
        - type: Pods
          value: 2
          periodSeconds: 60
      selectPolicy: Min
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
      selectPolicy: Max
```

### 6.2 Vertical Pod Autoscaler

```yaml
# web-vpa.yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: yyc3-web-vpa
  namespace: yyc3-production
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: yyc3-web
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
      - containerName: "web"
        minAllowed:
          cpu: "100m"
          memory: "128Mi"
        maxAllowed:
          cpu: "1000m"
          memory: "1Gi"
        controlledResources: ["cpu", "memory"]
```

### 6.3 Cluster Autoscaler

```bash
#!/bin/bash

# Cluster Autoscaler配置

# 1. 安装Cluster Autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

# 2. 配置Cluster Autoscaler
kubectl -n kube-system annotate deployment cluster-autoscaler \
  cluster.k8s.io/cluster-autoscaler-enabled="true" \
  cluster.k8s.io/cluster-autoscaler-name="yyc3-cluster" \
  cluster.k8s.io/cluster-autoscaler-node-group-min="3" \
  cluster.k8s.io/cluster-autoscaler-node-group-max="10" \
  cluster.k8s.io/cluster-autoscaler-node-group="worker-nodes"

# 3. 验证Cluster Autoscaler状态
kubectl -n kube-system get deployment cluster-autoscaler
kubectl -n kube-system logs deployment/cluster-autoscaler -f
```

---

## 7. 滚动更新

### 7.1 更新策略

```yaml
# web-deployment-strategy.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web
  namespace: yyc3-production
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1 # 最多可以比期望副本数多1个Pod
      maxUnavailable: 0 # 最多可以有0个不可用Pod
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-web
  template:
    metadata:
      labels:
        app: yyc3-web
    spec:
      containers:
        - name: web
          image: yyc3/web:1.0.0
          ports:
            - containerPort: 3200
```

### 7.2 蓝绿部署

```yaml
# web-blue-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web-blue
  namespace: yyc3-production
  labels:
    app: yyc3-web
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-web
      version: blue
  template:
    metadata:
      labels:
        app: yyc3-web
        version: blue
    spec:
      containers:
        - name: web
          image: yyc3/web:1.0.0
          ports:
            - containerPort: 3200
---
# web-green-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web-green
  namespace: yyc3-production
  labels:
    app: yyc3-web
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-web
      version: green
  template:
    metadata:
      labels:
        app: yyc3-web
        version: green
    spec:
      containers:
        - name: web
          image: yyc3/web:1.1.0
          ports:
            - containerPort: 3200
---
# web-service-blue-green.yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-web
  namespace: yyc3-production
spec:
  selector:
    app: yyc3-web
    version: blue # 切换到green进行蓝绿部署
  ports:
    - port: 80
      targetPort: 3200
```

### 7.3 更新监控

```bash
#!/bin/bash

# 更新监控脚本

NAMESPACE="yyc3-production"
DEPLOYMENT="yyc3-web"

echo "=== 更新监控 ==="
echo "命名空间: $NAMESPACE"
echo "部署: $DEPLOYMENT"

# 1. 监控更新进度
echo ""
echo "1. 监控更新进度:"
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --watch=true

# 2. 查看Pod状态
echo ""
echo "2. 查看Pod状态:"
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT --watch=true

# 3. 查看事件
echo ""
echo "3. 查看事件:"
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' --watch=true

# 4. 查看资源使用
echo ""
echo "4. 查看资源使用:"
kubectl top pods -n $NAMESPACE -l app=$DEPLOYMENT --watch=true

# 5. 查看日志
echo ""
echo "5. 查看日志:"
kubectl logs -f -n $NAMESPACE -l app=$DEPLOYMENT --tail=100
```

---

## 8. 监控告警

### 8.1 Prometheus监控

```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s

    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

    - job_name: 'kubernetes-nodes'
      kubernetes_sd_configs:
      - role: node
      relabel_configs:
      - source_labels: [__address__]
        regex: '(.*):10250'
        replacement: '${1}:9100'
        target_label: __address__

    - job_name: 'kubernetes-services'
      kubernetes_sd_configs:
      - role: service
      relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

### 8.2 Grafana Dashboard

```yaml
# grafana-dashboard-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  namespace: monitoring
  labels:
    grafana_dashboard: "1"
data:
  yyc3-web-dashboard.json: |
    {
      "dashboard": {
        "title": "YYC³ Web Dashboard",
        "panels": [
          {
            "title": "Request Rate",
            "targets": [
              {
                "expr": "rate(http_requests_total[5m])",
                "legendFormat": "{{method}} {{path}}"
              }
            ],
            "type": "graph"
          },
          {
            "title": "Response Time",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
                "legendFormat": "95th percentile"
              }
            ],
            "type": "graph"
          },
          {
            "title": "Error Rate",
            "targets": [
              {
                "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
                "legendFormat": "5xx errors"
              }
            ],
            "type": "graph"
          }
        ]
      }
    }
```

### 8.3 告警规则

```yaml
# prometheus-alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: yyc3-alerts
  namespace: monitoring
  labels:
    release: prometheus
spec:
  groups:
    - name: yyc3-web-alerts
      rules:
        - alert: HighRequestLatency
          expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
          for: 5m
          labels:
            severity: warning
            team: yyc3
          annotations:
            summary: "High request latency detected"
            description: "95th percentile latency is {{ $value }}s"

        - alert: HighErrorRate
          expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
          for: 5m
          labels:
            severity: critical
            team: yyc3
          annotations:
            summary: "High error rate detected"
            description: "Error rate is {{ $value | humanizePercentage }}"

        - alert: PodCrashLooping
          expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
          for: 5m
          labels:
            severity: warning
            team: yyc3
          annotations:
            summary: "Pod is crash looping"
            description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} is crash looping"

        - alert: HighCPUUsage
          expr: rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[5m]) > 0.8
          for: 5m
          labels:
            severity: warning
            team: yyc3
          annotations:
            summary: "High CPU usage detected"
            description: "Container {{ $labels.container }} is using {{ $value | humanizePercentage }} of CPU"

        - alert: HighMemoryUsage
          expr: container_memory_usage_bytes{container!="POD",container!=""} / container_spec_memory_limit_bytes{container!="POD",container!=""} > 0.8
          for: 5m
          labels:
            severity: warning
            team: yyc3
          annotations:
            summary: "High memory usage detected"
            description: "Container {{ $labels.container }} is using {{ $value | humanizePercentage }} of memory"
```

---

## 9. 故障排查

### 9.1 Pod故障排查

```bash
#!/bin/bash

# Pod故障排查脚本

NAMESPACE="yyc3-production"
POD_NAME=$1

if [ -z "$POD_NAME" ]; then
  echo "用法: $0 <Pod名称>"
  exit 1
fi

echo "=== Pod故障排查 ==="
echo "命名空间: $NAMESPACE"
echo "Pod: $POD_NAME"
echo ""

# 1. 检查Pod状态
echo "1. 检查Pod状态:"
kubectl get pod $POD_NAME -n $NAMESPACE -o wide
echo ""

# 2. 查看Pod详细信息
echo "2. 查看Pod详细信息:"
kubectl describe pod $POD_NAME -n $NAMESPACE
echo ""

# 3. 查看Pod日志
echo "3. 查看Pod日志:"
kubectl logs $POD_NAME -n $NAMESPACE --tail=100
echo ""

# 4. 查看Pod事件
echo "4. 查看Pod事件:"
kubectl get events -n $NAMESPACE --field-selector involvedObject.name=$POD_NAME --sort-by='.lastTimestamp'
echo ""

# 5. 检查Pod资源使用
echo "5. 检查Pod资源使用:"
kubectl top pod $POD_NAME -n $NAMESPACE
echo ""

# 6. 进入Pod检查
echo "6. 进入Pod检查（可选）:"
read -p "是否进入Pod? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  kubectl exec -it $POD_NAME -n $NAMESPACE -- sh
fi
```

### 9.2 Service故障排查

```bash
#!/bin/bash

# Service故障排查脚本

NAMESPACE="yyc3-production"
SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
  echo "用法: $0 <Service名称>"
  exit 1
fi

echo "=== Service故障排查 ==="
echo "命名空间: $NAMESPACE"
echo "Service: $SERVICE_NAME"
echo ""

# 1. 检查Service状态
echo "1. 检查Service状态:"
kubectl get svc $SERVICE_NAME -n $NAMESPACE -o wide
echo ""

# 2. 查看Service详细信息
echo "2. 查看Service详细信息:"
kubectl describe svc $SERVICE_NAME -n $NAMESPACE
echo ""

# 3. 查看Service端点
echo "3. 查看Service端点:"
kubectl get endpoints $SERVICE_NAME -n $NAMESPACE
echo ""

# 4. 测试Service连通性
echo "4. 测试Service连通性:"
POD=$(kubectl get pods -n $NAMESPACE -l app=$SERVICE_NAME -o jsonpath='{.items[0].metadata.name}')
if [ -n "$POD" ]; then
  kubectl exec -it $POD -n $NAMESPACE -- wget -O- http://$SERVICE_NAME:80/health
else
  echo "没有找到相关Pod"
fi
echo ""

# 5. 查看Service事件
echo "5. 查看Service事件:"
kubectl get events -n $NAMESPACE --field-selector involvedObject.name=$SERVICE_NAME --sort-by='.lastTimestamp'
```

### 9.3 网络故障排查

```bash
#!/bin/bash

# 网络故障排查脚本

NAMESPACE="yyc3-production"
POD_NAME=$1

if [ -z "$POD_NAME" ]; then
  echo "用法: $0 <Pod名称>"
  exit 1
fi

echo "=== 网络故障排查 ==="
echo "命名空间: $NAMESPACE"
echo "Pod: $POD_NAME"
echo ""

# 1. 检查Pod网络状态
echo "1. 检查Pod网络状态:"
kubectl exec -it $POD_NAME -n $NAMESPACE -- ip addr show
echo ""

# 2. 测试DNS解析
echo "2. 测试DNS解析:"
kubectl exec -it $POD_NAME -n $NAMESPACE -- nslookup kubernetes.default
echo ""

# 3. 测试网络连通性
echo "3. 测试网络连通性:"
kubectl exec -it $POD_NAME -n $NAMESPACE -- ping -c 3 google.com
echo ""

# 4. 检查网络策略
echo "4. 检查网络策略:"
kubectl get networkpolicies -n $NAMESPACE
echo ""

# 5. 查看网络事件
echo "5. 查看网络事件:"
kubectl get events -n $NAMESPACE --field-selector reason=FailedScheduling --sort-by='.lastTimestamp'
```

---

## 10. 最佳实践

### 10.1 资源管理最佳实践

```yaml
# ✅ 最佳实践示例

apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web
  namespace: yyc3-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-web
  template:
    metadata:
      labels:
        app: yyc3-web
    spec:
      # 1. 设置资源请求和限制
      containers:
        - name: web
          image: yyc3/web:1.0.0
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi

          # 2. 配置健康检查
          livenessProbe:
            httpGet:
              path: /health
              port: 3200
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /ready
              port: 3200
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          # 3. 配置安全上下文
          securityContext:
            runAsNonRoot: true
            runAsUser: 1001
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL

      # 4. 配置Pod反亲和性
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - yyc3-web
                topologyKey: kubernetes.io/hostname

      # 5. 配置节点选择器
      nodeSelector:
        node-role.kubernetes.io/worker: "true"

      # 6. 配置容忍度
      tolerations:
        - key: "workload"
          operator: "Equal"
          value: "web"
          effect: "NoSchedule"
```

### 10.2 安全最佳实践

```yaml
# ✅ 安全最佳实践示例

apiVersion: v1
kind: Pod
metadata:
  name: yyc3-web
  namespace: yyc3-production
spec:
  # 1. 使用非root用户运行
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001

  containers:
    - name: web
      image: yyc3/web:1.0.0

      # 2. 容器安全上下文
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL

      # 3. 资源限制
      resources:
        requests:
          cpu: 250m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi

      # 4. 使用Secret管理敏感信息
      env:
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: yyc3-secrets
              key: database-password

      # 5. 只读根文件系统
      volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
        - name: tmp
          mountPath: /tmp

  volumes:
    - name: config
      configMap:
        name: yyc3-web-config
    - name: tmp
      emptyDir: {}

  # 6. 网络策略
  # 在NetworkPolicy中限制Pod间通信
```

### 10.3 可观测性最佳实践

```yaml
# ✅ 可观测性最佳实践示例

apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-web
  namespace: yyc3-production
  labels:
    app: yyc3-web
    version: v1.0.0
    team: yyc3
spec:
  template:
    metadata:
      labels:
        app: yyc3-web
        version: v1.0.0
        team: yyc3
      annotations:
        # 1. Prometheus注解
        prometheus.io/scrape: "true"
        prometheus.io/port: "3200"
        prometheus.io/path: "/metrics"

    spec:
      containers:
        - name: web
          image: yyc3/web:1.0.0

          # 2. 健康检查端点
          livenessProbe:
            httpGet:
              path: /health
              port: 3200
            initialDelaySeconds: 30
            periodSeconds: 10

          readinessProbe:
            httpGet:
              path: /ready
              port: 3200
            initialDelaySeconds: 10
            periodSeconds: 5

          # 3. 日志配置
          env:
            - name: LOG_LEVEL
              value: "info"
            - name: LOG_FORMAT
              value: "json"

            # 4. 分布式追踪
            - name: JAEGER_AGENT_HOST
              value: "jaeger-agent.monitoring.svc.cluster.local"
            - name: JAEGER_SAMPLER_TYPE
              value: "probabilistic"
            - name: JAEGER_SAMPLER_PARAM
              value: "0.1"

            # 5. 监控指标
            - name: ENABLE_METRICS
              value: "true"
            - name: METRICS_PORT
              value: "3200"
```

---

## 📄 文档标尾

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence_**」

## 概述

### 概述

本文档提供了实用的技巧和方法，帮助开发者提高工作效率和代码质量。

#### 适用场景

- 日常开发工作
- 代码优化和重构
- 问题排查和调试
- 性能优化和调优

#### 预期收益

- 提高开发效率
- 减少代码错误
- 优化系统性能
- 提升代码可维护性

## 核心概念

### 核心概念

#### 关键术语

- **技巧**：经过实践验证的有效方法
- **最佳实践**：业界公认的优秀做法
- **模式**：可重复使用的解决方案
- **原则**：指导设计的基本准则

#### 核心原理

1. **DRY原则**（Don't Repeat Yourself）
   - 避免代码重复
   - 提取公共逻辑
   - 使用函数和类封装

2. **KISS原则**（Keep It Simple, Stupid）
   - 保持简单
   - 避免过度设计
   - 优先可读性

3. **YAGNI原则**（You Aren't Gonna Need It）
   - 只实现当前需要的功能
   - 避免过度工程
   - 保持代码精简

## 实施步骤

### 实施步骤

#### 步骤1：准备工作

```bash
# 安装必要工具
npm install -g typescript eslint prettier

# 初始化项目
npm init -y
npm install --save-dev typescript @types/node
```

#### 步骤2：配置环境

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### 步骤3：编写代码

```typescript
// 创建主文件
// src/index.ts
function main() {
  console.log("Hello, YYC³!");
}

main();
```

#### 步骤4：测试验证

```bash
# 运行代码
npm run dev

# 运行测试
npm test
```

## 代码示例

### 代码示例

#### 示例1：基础用法

```typescript
// 简单示例
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message = greet("YYC³");
console.log(message); // 输出: Hello, YYC³!
```

#### 示例2：高级用法

```typescript
// 异步操作
async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// 使用示例
fetchData("https://api.example.com/data")
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```

#### 示例3：错误处理

```typescript
// 自定义错误类
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// 使用示例
function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("email", "邮箱格式不正确");
  }
}

try {
  validateEmail("invalid-email");
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`验证失败: ${error.field} - ${error.message}`);
  }
}
```

## 注意事项

### 注意事项

#### 常见陷阱

1. **异步操作错误**

```typescript
// ❌ 错误：没有等待异步操作
async function processData() {
  const data = fetchData(); // 忘记await
  console.log(data); // 输出Promise对象
}

// ✅ 正确：使用await
async function processData() {
  const data = await fetchData();
  console.log(data); // 输出实际数据
}
```

2. **内存泄漏**

```typescript
// ❌ 错误：没有清理事件监听器
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []); // 缺少清理函数

// ✅ 正确：清理事件监听器
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

#### 性能注意事项

1. **避免不必要的重渲染**

```typescript
// ❌ 错误：每次都创建新对象
<Component data={{ value: 1 }} />

// ✅ 正确：使用useMemo缓存
const memoizedData = useMemo(() => ({ value: 1 }), []);
<Component data={memoizedData} />
```

2. **避免大对象传递**

```typescript
// ❌ 错误：传递整个大对象
<Component user={user} />

// ✅ 正确：只传递需要的属性
<Component userName={user.name} userId={user.id} />
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

## 常见问题

### 常见问题

#### Q1: 如何处理异步错误？

**A**: 使用try-catch捕获异步错误：

```typescript
async function handleRequest() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error("请求失败:", error);
    throw error;
  }
}
```

#### Q2: 如何优化React组件性能？

**A**: 使用以下优化技术：

1. **React.memo**：避免不必要的重渲染
2. **useMemo**：缓存计算结果
3. **useCallback**：缓存函数引用
4. **代码分割**：懒加载组件

```typescript
const MemoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => processData(data), [data]);
  return <div>{processedData}</div>;
});
```

#### Q3: 如何管理应用状态？

**A**: 根据应用复杂度选择合适的状态管理方案：

1. **简单应用**：使用React Context API
2. **中等应用**：使用Zustand或Redux Toolkit
3. **复杂应用**：使用Redux + 中间件

```typescript
// Zustand示例
const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));
```

## 案例分析

### 案例分析

#### 案例1：性能优化

**问题**：页面加载时间过长，用户体验差。

**分析**：

- 首次内容绘制(FCP)：3.2秒
- 最大内容绘制(LCP)：5.8秒
- 累积布局偏移(CLS)：0.25

**解决方案**：

1. 实现代码分割和懒加载
2. 优化图片加载（使用WebP格式，添加loading="lazy"）
3. 启用Gzip压缩
4. 使用CDN加速静态资源

**结果**：

- FCP：1.2秒（↓62.5%）
- LCP：2.1秒（↓63.8%）
- CLS：0.08（↓68%）

#### 案例2：错误处理改进

**问题**：错误信息不清晰，难以定位问题。

**分析**：

- 错误信息过于简单
- 缺少错误上下文
- 没有错误追踪

**解决方案**：

1. 实现自定义错误类
2. 添加错误堆栈追踪
3. 集成错误监控工具（Sentry）
4. 实现错误日志记录

**结果**：

- 错误定位时间减少70%
- 错误解决率提高40%
- 用户投诉减少60%

#### 案例3：代码重构

**问题**：代码重复率高，维护困难。

**分析**：

- 代码重复率：35%
- 函数平均长度：120行
- 圈复杂度：15

**解决方案**：

1. 提取公共逻辑到工具函数
2. 使用设计模式重构
3. 拆分大函数
4. 添加单元测试

**结果**：

- 代码重复率：8%（↓77%）
- 函数平均长度：35行（↓71%）
- 圈复杂度：5（↓67%）

## 相关文档

- [🔖 YYC³ Docker容器化部署技巧](YYC3-Cater-部署发布/技巧类/01-YYC3-Cater--技巧类-Docker容器化部署技巧.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ 灰度发布风险控制技巧](YYC3-Cater-部署发布/技巧类/05-YYC3-Cater--技巧类-灰度发布风险控制技巧.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ 部署问题排查指南](YYC3-Cater-部署发布/技巧类/04-YYC3-Cater--技巧类-部署问题排查指南.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ CI/CD流水线搭建与优化技巧](YYC3-Cater-部署发布/技巧类/03-YYC3-Cater--技巧类-CI_CD流水线搭建与优化技巧.md) - YYC3-Cater-部署发布/技巧类
- [🔖 YYC³ 智能化需求优先级排序方法](YYC3-Cater-需求规划/技巧类/03-YYC3-Cater--技巧类-智能化需求优先级排序方法.md) - YYC3-Cater-需求规划/技巧类

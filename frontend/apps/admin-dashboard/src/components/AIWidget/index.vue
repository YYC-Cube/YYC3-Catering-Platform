<template>
  <div class="ai-widget-container">
    <div class="ai-widget-button" @click="toggleWidget">
      <el-icon :size="24">
        <ChatDotRound />
      </el-icon>
    </div>

    <transition name="slide-up">
      <div v-if="isOpen" class="ai-widget-panel">
        <div class="widget-header">
          <div class="header-title">
            <el-icon><Robot /></el-icon>
            <span>AI 助手</span>
          </div>
          <el-button type="text" @click="toggleWidget">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <div class="widget-content">
          <div class="chat-messages" ref="messagesRef">
            <div
              v-for="message in messages"
              :key="message.id"
              class="message"
              :class="message.role"
            >
              <div class="message-avatar">
                <el-avatar v-if="message.role === 'user'" :size="32">
                  {{ userInitial }}
                </el-avatar>
                <el-avatar v-else :size="32" :style="{ background: '#6366f1' }">
                  <el-icon><Robot /></el-icon>
                </el-avatar>
              </div>
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                <div v-if="message.toolCalls" class="tool-calls">
                  <div
                    v-for="tool in message.toolCalls"
                    :key="tool.name"
                    class="tool-call"
                  >
                    <el-icon><Tools /></el-icon>
                    <span>{{ tool.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <el-input
              v-model="inputMessage"
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
              :disabled="isLoading"
            >
              <template #append>
                <el-button
                  type="primary"
                  @click="sendMessage"
                  :loading="isLoading"
                >
                  <el-icon><Position /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ChatDotRound, Close, Robot, Position, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isOpen = ref(false)
const inputMessage = ref('')
const isLoading = ref(false)
const messagesRef = ref()
const userInitial = computed(() => 'U')

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: Array<{
    name: string
    result: any
  }>
}

const messages = ref<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: '你好！我是YYC³ AI助手，可以帮助您管理订单、菜单、财务等业务。有什么我可以帮助您的吗？',
  },
])

const toggleWidget = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value,
  }

  messages.value.push(userMessage)
  inputMessage.value = ''
  isLoading.value = true

  nextTick(() => {
    scrollToBottom()
  })

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage.content,
        history: messages.value.slice(-10),
      }),
    })

    if (!response.ok) {
      throw new Error('AI服务暂时不可用')
    }

    const data = await response.json()

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.content,
      toolCalls: data.toolCalls,
    }

    messages.value.push(assistantMessage)
  } catch (error) {
    console.error('AI chat error:', error)
    ElMessage.error('AI服务暂时不可用，请稍后再试')
  } finally {
    isLoading.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}
</script>

<style scoped>
.ai-widget-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.ai-widget-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
}

.ai-widget-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
}

.ai-widget-panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.widget-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.widget-content {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 80%;
}

.message.user .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-text {
  padding: 10px 14px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.assistant .message-text {
  background: #f3f4f6;
  color: #1f2937;
}

.message.user .message-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.tool-calls {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tool-call {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

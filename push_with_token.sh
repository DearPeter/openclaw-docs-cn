#!/bin/bash

# 尝试使用GitHub令牌推送
# 如果没有令牌，将尝试使用SSH方式

REPO_DIR="/root/.openclaw/workspace/openclaw-docs-cn"
cd "$REPO_DIR"

echo "尝试推送代码到GitHub..."

# 方法1: 检查环境变量中的GitHub令牌
if [ -n "$GITHUB_TOKEN" ]; then
    echo "使用环境变量中的GitHub令牌..."
    git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/DearPeter/openclaw-docs-cn.git
    git push origin master
    exit $?
fi

# 方法2: 检查文件中的令牌
if [ -f ~/.github_token ]; then
    echo "使用文件中的GitHub令牌..."
    GITHUB_TOKEN=$(cat ~/.github_token)
    git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/DearPeter/openclaw-docs-cn.git
    git push origin master
    exit $?
fi

# 方法3: 尝试SSH方式
echo "尝试SSH方式..."
git remote set-url origin git@github.com:DearPeter/openclaw-docs-cn.git
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_github -o StrictHostKeyChecking=no" git push origin master

if [ $? -ne 0 ]; then
    echo "所有认证方法都失败了"
    echo "请手动添加SSH公钥到GitHub:"
    echo ""
    cat ~/.ssh/id_rsa_github.pub
    echo ""
    echo "或者使用GitHub令牌:"
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 创建新令牌 (需要repo权限)"
    echo "3. 设置环境变量: export GITHUB_TOKEN=your_token_here"
    echo "4. 重新运行此脚本"
    exit 1
fi
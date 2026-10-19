#!/usr/bin/env bash
# sync_xiuanyan.sh — 玄研院内容同步脚本
# 用法：bash sync_xiuanyan.sh <老师名> [文件/目录]
# 示例：bash sync_xiuanyan.sh jingfang 六爻/练习题/旺衰判断练习.md

set -e

TEACHER="$1"
TARGET="$2"
REPO_DIR="${HOME}/.hermes/xiuanyan-academy"
WORKSPACE_DIR="${HOME}/.hermes/profiles/${TEACHER}/workspace/xiuanyan"

if [ -z "$TEACHER" ]; then
  echo "用法：bash sync_xiuanyan.sh <老师名> [文件/目录]"
  exit 1
fi

if [ ! -d "${WORKSPACE_DIR}" ]; then
  echo "错误：workspace 不存在：${WORKSPACE_DIR}"
  echo "请先创建：mkdir -p ${WORKSPACE_DIR}"
  exit 1
fi

# 克隆（首次）或拉取仓库
if [ ! -d "${REPO_DIR}/.git" ]; then
  echo "首次同步，正在克隆仓库..."
  git clone git@github.com:xiuanyan-academy/xiuanyan-academy.git "${REPO_DIR}"
else
  echo "正在拉取最新代码..."
  git -C "${REPO_DIR}" pull --ff-only
fi

# 同步指定文件或全部
if [ -n "$TARGET" ]; then
  rsync -av --delete "${WORKSPACE_DIR}/${TARGET}" "${REPO_DIR}/src/content/"
else
  rsync -av --delete "${WORKSPACE_DIR}/" "${REPO_DIR}/src/content/"
fi

cd "${REPO_DIR}"
git add -A
git commit -m "chore(${TEACHER}): sync content $(date +%Y-%m-%d_%H:%M:%S)" || exit 0
git push

echo "✓ 同步完成，GitHub Actions 将自动部署"

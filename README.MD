### GitHub Action: Add Comment to Weeek Task

Этот экшен добавляет комментарий к задаче Weeek при пуше в ветку `feature/*`.

Пример Github Workflow конфига с использованием данного экшена:

```yaml
name: Add Comment to Weeek Task

on:
  push:
    branches:
      - feature/*

jobs:
  add-comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Add Comment to Weeek Task
        uses: <path/to/this/action>
        with:
          branchName: "feature/9"
          comment: "This is a comment from the action"
          userMapping: |
            {"githubUser1": "weeekUserId1", "githubUser2": "weeekUserId2"}
          weeekLogin: "email@gmail.com"
          weeekPassword: "cool_password"
          weeekDomain: "https://app.weeek.net/"
          weeekApiDomain: "https://api.weeek.net/"
          weeekProjectId: "123456"

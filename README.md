## 项目初始化

```
$ npm init
```

##  git规范和changelog

编写指南  > http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html

 - `commitizen`是一个格式化commit message的工具
 - `validate-commit-msg` 用于检查项目的 Commit message 是否符合格式
 - `conventional-changelog-cli`可以从git metadata生成变更日志

 安装依赖

 `$ npm install -g commitizen`
 `$ npm i  validate-commit-msg conventional-changelog-cli -D`

初始化
 `$ commitizen init cz-conventional-changelog --save --save-exact`

`$git add -A`

提交git commit在命令行使用git cz代替
`$ git cz`,按照提示选择

#### 提交的格式

```
<type>(<scope>):<subject/>
<BLANK LINE>
<body>a
<BLANK LINE>
<footer>

type 代表某次提交的类型，比如是修复bug还是增加feature
scope 表示作用域，比如一个页面或一个组件
subject 主题 ，概述本次提交的内容
body 详细的影响内容
footer 修复的bug和issue链接
```


#### 类型的含义
```
feat	新增feature
fix	修复bug
docs	仅仅修改了文档，比如README、CHANGELOG、CONTRIBUTE等
style	仅仅修改了空格、格式缩进、偏好等信息，不改变代码逻辑
refactor	代码重构，没有新增功能或修复bug
perf	优化相关，提升了性能和体验
test	测试用例，包括单元测试和集成测试
chore	改变构建流程，或者添加了依赖库和工具
revert	回滚到上一个版本
ci	CI 配置，脚本文件等更新
```


#### husky

 - `validate-commit-msg`可以来检查我们的commit规范
 - `husky`可以把`validate-commit-msg`作为一个`githook`来验证提交消息


安装
`$ npm i husky  --save-dev`

修改package.json
```json
 "husky": {
    "hooks": {
      "commit-msg": "validate-commit-msg"
    }
  }
  ```

  ####  生成CHANGELOG.md

`conventional-changelog-cli` 默认推荐的 commit 标准是来自angular项目
参数`-i` CHANGELOG.md表示从 CHANGELOG.md 读取 changelog
参数 `-s` 表示读写 CHANGELOG.md 为同一文件
参数 `-r` 表示生成 changelog 所需要使用的 release 版本数量，默认为1，全部则是0

`$ npm install -g conventional-changelog`

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w -r 0"
  }
}
```

`$ npm run changelog`

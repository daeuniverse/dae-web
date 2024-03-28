<script lang="ts" setup>
import { shikiToMonaco } from '@shikijs/monaco'
import { merge } from 'lodash-es'
import * as Monaco from 'monaco-editor'
import { getHighlighter } from 'shiki/bundle-web.mjs'

const props = defineProps<{
  options?: Monaco.editor.IStandaloneEditorConstructionOptions
}>()

// RoutingA textmate 语法定义
const languageRoutingA: Monaco.languages.IMonarchLanguage = {
  // set defaultToken as `invalid` to turn on debug mode
  // defaultToken: 'invalid',
  ignoreCase: false,
  keywords: [
    'dip',
    'direct',
    'domain',
    'dport',
    'fallback',
    'must_rules',
    'ipversion',
    'l4proto',
    'mac',
    'pname',
    'qname',
    'request',
    'response',
    'routing',
    'sip',
    'sport',
    'tcp',
    'udp',
    'upstream'
  ],
  symbols: /[->&!:,]+/,
  operators: ['&&', '!'],

  tokenizer: {
    root: [
      [/[a-zA-Z]\w*/, { cases: { '@keywords': 'keyword' } }],
      [/@symbols/, { cases: { '@operators': 'operator' } }],
      [/[ \t\r\n]+/, 'white'],
      [/[{}()]/, 'brackets'],
      [/\d+/, 'number'],
      [/["']/, 'string']
    ]
  }
}

Monaco.languages.register({ id: 'routingA' })
Monaco.languages.setMonarchTokensProvider('routingA', languageRoutingA)

const highlighter = await getHighlighter({
  themes: ['one-dark-pro'],
  langs: []
})

shikiToMonaco(highlighter, Monaco)

const mergedOptions =
  computed<Monaco.editor.IStandaloneEditorConstructionOptions>(() =>
    merge(
      {
        theme: 'one-dark-pro',
        automaticLayout: true,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Source Code Pro',
        'semanticHighlighting.enabled': true,
        fontLigatures: true,
        lineHeight: 1.6,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        cursorBlinking: 'solid',
        formatOnPaste: true,
        insertSpaces: true,
        tabSize: 2,
        lineNumbers: 'off',
        padding: { top: 8, bottom: 8 }
      },
      props.options
    )
  )
</script>

<template>
  <MonacoEditor :options="mergedOptions" />
</template>

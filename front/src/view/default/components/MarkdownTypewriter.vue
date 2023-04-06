<template>
  <div ref="typewriterContainer"  v-highlight></div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import Typewriter from 'typewriter-effect/dist/core';
// 引入样式
// import "highlight.js/styles/github-dark.css";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import ClipboardJS from 'clipboard';
export default {
  name: 'MarkdownTypewriter',
  props: {
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
       return {
         codeBlockId: 0,
      md: new MarkdownIt({
        html: true,
        highlight: (str, lang) => {
           const currentId = `code-block-${this.codeBlockId}`;
           this.codeBlockId++;
          if (lang && Prism.languages[lang]) {
            try {
              return (
                 '<pre class="code-container" style="position:relative;background:#181616;">'+
                '<pre style="background:#100f0f;" class="language-' +
                lang +
                '" id="'+currentId+'"><code>' +
                Prism.highlight(str, Prism.languages[lang], lang) +
                '</code></pre>' +
                '<button style="position:absolute;top:0;right:0;" class="copy-button" data-clipboard-target="#'+
                currentId+
                '"><i class="fa fa-copy"></i> Copy</button>'+'</pre>'
              );
            } catch (e) {}
          }
                    return (
            '<pre style="position:relative;background:#181616;" class="language-' +
            lang +
            '"><code>' +
            str.replace(/[&<>]/g, (m) => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
            })[m]) +
            '</code></pre>'
          );
        },
      }),
    };
  },
  mounted() {
      const escapedContent = this.escapeVueTemplate(this.content);
  const htmlContent = this.md.render(escapedContent);
    // const htmlContent = this.md.render(this.content);
    const typewriter = new Typewriter(this.$refs.typewriterContainer, {
      loop: false,
      ...this.options,
    });

  typewriter
  .typeString(htmlContent)
  .pauseFor(300).callFunction(() => {
    this.$refs.typewriterContainer.innerHTML = this.$refs.typewriterContainer.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
       this.$emit('onComplete')
       this.initClipboard()
      })
  .start();

  },
  methods:{
        initClipboard() {
      new ClipboardJS('.copy-button');
    },
      escapeVueTemplate(content) {
    return content.replace(/<template>/g, '&lt;template&gt;').replace(/<\/template>/g, '&lt/template&gt');
  },
  }
};
</script>
<style>
.code-container {
  position: relative;
}

.copy-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  padding: 5px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 0 0 0 5px;
}

.copy-button:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
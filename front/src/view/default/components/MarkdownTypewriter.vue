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
           // 随机生产uuid
   const uuid=() =>{
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    let uuid = s.join("");
    return uuid;
}
       return {
      // md: new MarkdownIt({
      //   html: true,
      //   highlight: (str, lang) => {
      //     console.log(Prism.highlight(str, Prism.languages[lang], lang))
      //      const currentId = `code-block-${uuid()}`;
      //     if (lang && Prism.languages[lang]) {
      //       try {
      //         return (
      //            '<pre class="code-container" style="position:relative;background:#181616;">'+
      //           '<pre style="background:#100f0f;" class="language-' +
      //           lang +
      //           '" id="'+currentId+'"><code>' +
      //           Prism.highlight(str, Prism.languages[lang], lang) +
      //           '</code></pre>' +
      //           '<button style="position:absolute;top:0;right:0;" class="copy-button" data-clipboard-target="#'+
      //           currentId+
      //           '"><i class="fa fa-copy"></i> Copy</button>'+'</pre>'
      //         );
      //       } catch (e) {}
      //     }
      //               return (
      //       '<pre style="position:relative;background:#181616;" class="language-' +
      //       lang +
      //       '"><code>' +
      //       // str.replace(/[&<>]/g, (m) => ({
      //       //   '&': '&amp;',
      //       //   '<': '&lt;',
      //       //   '>': '&gt;',
      //       // })[m]) +
      //         str+
      //       '</code></pre>'
      //     );
      //   },
      // }),
      md: new MarkdownIt({
        html: true,
        highlight: (str, lang) => {
          const currentId = `code-block-${uuid()}`;
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
              '&': '&',
              '<': '<',
              '>': '>',
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
  const newStr=htmlContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const decodedCode = this.decodeHtmlEntities(newStr);
    // const htmlContent = this.md.render(this.content);
    const typewriter = new Typewriter(this.$refs.typewriterContainer, {
      loop: false,
      onCreateTextNode: (text) => {
        const span = document.createElement('span');
        span.innerHTML = text
        return span;
      },
      ...this.options,
    });

  typewriter
  .typeString(decodedCode)
  .pauseFor(300).callFunction(() => {
    // this.$refs.typewriterContainer.innerHTML = this.$refs.typewriterContainer.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
       this.$emit('onComplete')
       this.initClipboard()
      })
  .start();

  },
  methods:{
 decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
},

        initClipboard() {
      new ClipboardJS('.copy-button');
    },
      escapeVueTemplate(content) {
        // return content.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/&amp/g,'&');
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
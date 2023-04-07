<template>
  <span class="typewriter">
  <slot></slot>
  <span
    class="typewriter-msg"
    :class='{"typewriter-selected":isFullErasing}'  v-highlight v-html="typing"></span>
    <span class="typewriter-cursor" v-if="cursor">{{ cursorSymbol }}</span>
  </span>
</template>
<script>
import "highlight.js/styles/github-dark.css";
export default {
  props: {
    words: {
      type: Array,
      default () {
        return []
      }
    },
    interval: {
      type: Number,
      default: 200
    },
    speed: {
      type: Number,
      default: 300
    },
    cursor: {
      type: Boolean,
      default: true
    },
    cursorSymbol: {
      type: String,
      default: '|'
    },
    fullErase: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      typePos: 0,
      isTyping: false,
      isWaiting: false,
      currentWordPos: null,
      currentWord: null,
      typing: null,
      isFullErasing: false,
    }
  },
  computed: {
    isErasing () {
      return !this.isTyping
    },
    finishTyping () {
      if (this.typing === null || this.currentWord === null) return false
      if (!this.hasStarted) return false
      if(this.isTyping && this.typing.length >= this.currentWord.length){
        this.$emit('onComplete')
        return true
      }
    },
    hasStarted () {
      return this.currentWord !== null
    },
    isErased () {
      if (!this.hasStarted) return false
      if (this.isErasing && this.typing === null) return true
      return this.isErasing && this.typing.length <= 0
    },
    isLastWord () {
      return this.hasStarted && this.currentWordPos >= (this.words.length - 1)
    },
  },
  mounted () {
  this.type()
  },
  beforeDestroy () {
    this.destroyTimers()
  },
  methods: {
    destroyTimers () {
      this.destroyTypeInterval()
      this.destroyCharTimeout()
      this.destroyFullEraseTimeout()
    },
    destroyTypeInterval () {
      if (this.typeInterval) {
        clearInterval(this.typeInterval)
      }
    },
    destroyCharTimeout () {
      if (this.charTimeout) {
        clearTimeout(this.charTimeout)
      }
    },
    destroyFullEraseTimeout () {
      if (this.fullEraseTimeout) {
        clearTimeout(this.fullEraseTimeout)
      }
    },
    next () {
      if (!this.canContinue()) return

      if (!this.hasStarted) {
        this.currentWordPos = 0
      } else {
        if (this.isLastWord) {
          this.currentWordPos = 0
        } else {
          this.currentWordPos++
        }
      }

      this.isWaiting = true

      this.charTimeout = setTimeout(() => {
        this.destroyCharTimeout()
        this.isWaiting = false
        this.currentWord = this.words[this.currentWordPos]
        this.typePos = this.isTyping ? this.currentWord.length : 0
        this.isTyping = !this.isTyping
      }, this.interval)
    },
    canContinue () {
      if (this.isWaiting) return false

      if (this.isTyping && !this.finishTyping && this.hasStarted) {
        return false
      }

      if (this.isErasing && !this.isErased && this.hasStarted) {
        return false
      }

      if (this.isTyping && this.finishTyping) {
        this.isTyping = !this.isTyping
        this.doFullErase()
        return false
      }

      return true
    },
    doFullErase () {
      if (this.fullErase && !this.isFullErasing) {
        this.isFullErasing = true
        this.isWaiting = true

        this.fullEraseTimeout = setTimeout(() => {
          clearTimeout(this.fullEraseTimeout)
          this.reset()
        }, 300)
      }
    },
    reset () {
      this.isWaiting = false
      this.typing = null
      this.typePos = 0
      this.isFullErasing = false
    },
    type () {
      this.destroyTypeInterval()

      this.typeInterval = setInterval(() => {
        this.next()

        if (this.hasStarted && !this.isWaiting) {
          if (this.isTyping) {
            this.typePos++
          } else {
            this.typePos--
          }
          this.typing = this.currentWord.substr(0, this.typePos)
        }
      }, this.speed)
    }
  }
}
</script>
<style>
.typewriter-selected{
  background-color: rgba(0,0,0,.1);
}
.typewriter-cursor{
    opacity: 1;
    animation: blink 0.7s infinite;
    position: relative;
    top:-3px;
    left:-12px;
}
@keyframes blink{
    0% { opacity:1; }
    50% { opacity:0; }
    100% { opacity:1; }
}



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

  .typewriter-msg  .hljs{
   background: #0d1117 !important;
   margin: 10px 0;
  }  

</style>


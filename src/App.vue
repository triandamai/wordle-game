<script setup lang="ts">
import { ref ,onUnmounted, computed} from "vue"
import {LetterState,getColorState} from "./types";

import Keyboard from "./components/Keyboard.vue"
import { kamus ,initTile} from "./datum";


const onKeyup = (e:KeyboardEvent) => onKeyPress(e.key)


const answer = "trian"
let allowInput = true
const board = ref<Array<Array<{letter:string,state:LetterState}>>>(
  initTile
)
const currentRowIndex = ref<number>(0)

const currentRow = computed(()=>board.value[currentRowIndex.value])
const letterStates = ref<Record<string,LetterState>>({})


window.addEventListener("keyup",onKeyup)
onUnmounted(()=>{
  window.removeEventListener("keyup",onKeyup)
})

const onKeyPress=(char:string)=>{
  if(!allowInput) return false
  if (/^[a-zA-Z]$/.test(char)) {
    fillTile(char)
  }else if(char == "Enter"){
    validateLetter()
  }else if(char == "Backspace"){
    removeLetter()
  }
  
}

const fillTile = (char:string)=>{
  for(let i =0;i<currentRow.value.length;i++){
    if(currentRow.value[i].letter == ''){
       currentRow.value[i].letter = char
       break;
    }
  }
}

const removeLetter = ()=>{
  for(let i=currentRow.value.length-1;i>=0;i--){
    if(currentRow.value[i].letter != ''){
      currentRow.value[i].letter = ''
      currentRow.value[i].state = LetterState.INIT
      break;
    }
  }
}

const validateLetter = ()=>{
  
  if(currentRow.value.every((tile)=>tile.letter)){
    //jadiin satu kata rownya
    const guess = currentRow.value.map((tile)=>tile.letter).join('')
    //cek apakah di kamus ada dan jawaban salah
    if(!kamus.includes(guess) && guess !== answer){
      //goyang
      alert("Kata tidak terdaftar")
      return
    }

    const answerLetters: (string | null)[] = answer.split('')

    //cek ada yang bener ngga hurufnya
    currentRow.value.forEach((tile,i)=>{
      if(answerLetters[i] === tile.letter){
        tile.state = LetterState.CORRECT
        letterStates.value[tile.letter] = LetterState.CORRECT
        answerLetters[i] = null
      }
    })

    //cek sudah ada atau belum
    currentRow.value.forEach((tile)=>{
      if(!tile.state && answerLetters.includes(tile.letter)){
        tile.state = LetterState.PRESENT
        answerLetters[answerLetters.indexOf(tile.letter)] = null
        if(!letterStates.value[tile.letter]){
          letterStates.value[tile.letter] = LetterState.PRESENT
        }
      }
    })
    //cek mendekati
    currentRow.value.forEach((tile)=>{
      if(!tile.state){
        tile.state = LetterState.ABSENT
        if(!letterStates.value[tile.letter]){
          letterStates.value[tile.letter] = LetterState.ABSENT
        }
      }
    })
    //ga boleh ngisi lagi
    allowInput =false

    if(currentRow.value.every((tile)=>tile.state === LetterState.CORRECT)){
      alert("yey benar")
    }else if(currentRowIndex.value < board.value.length - 1){
      //pindah ke selanjutnya
      currentRowIndex.value++
      setTimeout(()=>{
        allowInput = true
      },1600)
    }else{
      alert("game selesai")
      allowInput = false
    }
  }else{
    //goyang
    alert("hurufnya kurang")
  }
 
}

</script>

<template>
<div class="w-screen h-screen bg-gray-800">
  <!-- message -->
  <Transition>
    <div >

    </div>
  </Transition>
  <!--  -->
  <header>
    <h1 class="text-gray-400">WORDLE</h1>
     <a
      id="source-link"
      class="text-gray-400"
      href="https://github.com/triandamai/wordle-game"
      target="_blank"
      >Source</a
    >
  </header>
  <div id="board">
    <div v-for="(row,indexRow) in board" :key="indexRow" class="row">
        <div v-for="(column,indexColumn) in row"
         :key="indexColumn"
         :class="[
            getColorState(column.state)
         ]"
         class="tile border-2"
         >
         <div class="front" :style="{ transitionDelay: `${indexColumn * 300}ms` }">
         {{ column.letter }}
        </div>
        <div :class="['back']"
          :style="{
            transitionDelay: `${indexColumn * 300}ms`,
            animationDelay: `${indexColumn * 100}ms`
          }"
        >
           {{ column.letter }}
        </div>
           
        </div>
    </div>
  </div>
  <Keyboard @key="onKeyPress" :letter-state="letterStates"/>

</div>
</template>
<style scoped>

#board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 310px));
  height: var(--height);
  width: min(350px, calc(var(--height) / 6 * 5));
  margin: 0px auto;
}
.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}
.tile{
   width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
  @apply text-gray-400;
}
.tile.filled {
  animation: zoom 0.2s;
}
.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.tile .front {
  border: 1px solid #d3d6da;
}
</style>


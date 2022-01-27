enum LetterState{
    INIT,
    PRESENT,
    ABSENT,
    CORRECT
}

  const getColorState = (state:LetterState) =>{
    if(state == LetterState.INIT) return "init"
    if(state == LetterState.CORRECT) return "correct"
    if(state == LetterState.PRESENT) return "present"
    if(state == LetterState.ABSENT) return "absen"
  }
export {
   LetterState,
   getColorState
}

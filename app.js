/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = ['apple', 'banana', 'cherry', 'date', 'fig', 'grape', 'kiwi', 'lemon', 'mango', 'orange']

function ScrambleGame() {
  const [wordList, setWordList] = React.useState(shuffle([...words]))
  const [currentWord, setCurrentWord] = React.useState('')
  const [scrambledWord, setScrambledWord] = React.useState('')
  const [guess, setGuess] = React.useState('')
  const [points, setPoints] = React.useState(0)
  const [strikes, setStrikes] = React.useState(0)
  const [passes, setPasses] = React.useState(3)
  const [message, setMessage] = React.useState('')
  const maxStrikes = 3

  React.useEffect(() => {
    if (wordList.length > 0) {
      const nextWord = wordList[0]
      setCurrentWord(nextWord)
      setScrambledWord(shuffle(nextWord))
    }
  }, [wordList])

  React.useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGameState'))
    if (savedState) {
      setWordList(savedState.wordList)
      setCurrentWord(savedState.currentWord)
      setScrambledWord(savedState.scrambledWord)
      setPoints(savedState.points)
      setStrikes(savedState.strikes)
      setPasses(savedState.passes)
    }
  }, [])

  React.useEffect(() => {
    const gameState = { wordList, currentWord, scrambledWord, points, strikes, passes }
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState))
  }, [wordList, currentWord, scrambledWord, points, strikes, passes])

  const handleGuess = () => {
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1)
      setMessage('Correct! Next word.')
      setWordList(wordList.slice(1))
    } else {
      setStrikes(strikes + 1)
      setMessage('Incorrect. Try again.')
    }
    setGuess('')
  }

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1)
      setMessage('You passed. Next word.')
      setWordList(wordList.slice(1))
    }
  }

  const handleRestart = () => {
    setWordList(shuffle([...words]))
    setPoints(0)
    setStrikes(0)
    setPasses(3)
    setMessage('')
    localStorage.removeItem('scrambleGameState')
  }

  if (strikes >= maxStrikes || wordList.length === 0) {
    return (
      <div className="game-container">
        <h1>Welcome to Scramble.</h1>
        <p>Game Over</p>
        <p>{strikes >= maxStrikes ? 'You received too many strikes!' : 'You guessed all the words!'}</p>
        <p>Points: {points}</p>
        <button onClick={handleRestart}>Play Again</button>
      </div>
    )
  }

  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>
      <div className="scoreboard">
        <div>POINTS: {points}</div>
        <div>STRIKES: {strikes}</div>
      </div>
      <p>{message}</p>
      <div className="scrambled-word">{scrambledWord}</div>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
      />
      <button className="pass" onClick={handlePass} disabled={passes <= 0}>Passes Remaining ({passes})</button>
    </div>
  )
}

ReactDOM.render(<ScrambleGame />, document.getElementById('root'))

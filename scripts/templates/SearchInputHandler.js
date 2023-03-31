class SearchInputHandler {
  #_excludedWords = []
  #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/
  #_minLength
  #_matchingExpressions = []

  constructor (input, button, excludedWords, minLength) {
    this.#_excludedWords = excludedWords || []
    this.#_minLength = minLength || 3
    this._input = input
    this._button = button

    this._input.value = ''
    this._input.addEventListener('input', (e) => {
      this.#inputEventHandler(e.target.value)
    })
  }

  #extractKeyWords (value) {
    let keyWordsList = value.split(this.#_wordBreaker)
    keyWordsList = keyWordsList.filter(word => !this.#_excludedWords.includes(word))
    keyWordsList = keyWordsList.filter((word) => { return word.length > 1 })
    return keyWordsList
  }

  #inputEventHandler (value) {
    let keyWordsList = []
    this.#_matchingExpressions = []

    if (value.length >= this.#_minLength) {
      keyWordsList = this.#extractKeyWords(value)

      keyWordsList.forEach((keyWord) => {
        this.#_matchingExpressions.push(new RegExp(`^${keyWord}`, 'i'))
      })
    }

    this._input.dispatchEvent(new CustomEvent('inputKeyWord', {
      detail: {
        keyWordsList,
        matchingExpressions: this.#_matchingExpressions,
        value
      }
    }))
  }

  get matchingExpressions () {
    return this.#_matchingExpressions
  }

  get inputElement () {
    return this._input
  }
}

export { SearchInputHandler as default }

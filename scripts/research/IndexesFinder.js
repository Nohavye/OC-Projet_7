import InvertedIndex from './InvertedIndex.js'
class IndexesFinder {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrase en mots.
  static #_excludedWords = [] // Liste de mots non pertinants pour la recherche par mots clé.
  static #_expression = '' // Critère de recherche: expression pour la recherche par mot clé.
  static #_tagsList = [] // Critère de recherche: liste de tags pour la recherche par tags.

  static #_createInvertedIndexProcessingTime
  static #_requestProcessingTimes = []

  // Paramètres d'initialisation.
  static initIndexesFinder (recipesMap, excludedWords) {
    this.#_excludedWords = excludedWords
    const start = performance.now()
    InvertedIndex.updateMaps(recipesMap, this.#_excludedWords)
    this.#_createInvertedIndexProcessingTime = performance.now() - start
  }

  // Status des critères de recherche.
  static get hasSearchCriteria () {
    return (this.#_expression !== '' || this.#_tagsList.length > 0)
  }

  // Critères de recherches.
  static setCriteria = {
    expression: (value) => { this.#_expression = value },
    tagsList: (value) => { this.#_tagsList = value }
  }

  static showPerformance () {
    const minTime = this.#_requestProcessingTimes.length > 0 ? `${(Math.min(...this.#_requestProcessingTimes)).toFixed(3)} ms` : '--'
    const maxTime = this.#_requestProcessingTimes.length > 0 ? `${(Math.max(...this.#_requestProcessingTimes)).toFixed(3)} ms` : '--'
    const averageTime = this.#_requestProcessingTimes.length > 0
      ? `${(this.#_requestProcessingTimes.reduce((total, value) => total + value, 0) / this.#_requestProcessingTimes.length).toFixed(3)} ms`
      : '--'

    console.log(`
      Bilan de performance:
      Création de l'indexe inversé: ${this.#_createInvertedIndexProcessingTime} ms
      Nombre de requètes: ${this.#_requestProcessingTimes.length}
      Temps de réponse:
      
        minimum: ${minTime} | maximum: ${maxTime}
      
        moyenne: ${averageTime}
    `)
  }

  // Retourne les indexes des entités correspondants au critères de recherche.
  static get indexes () {
    const start = performance.now()
    let indexes = this.#_expression !== '' ? this.#indexesByKeyWords() : []

    this.#_tagsList.forEach((tag) => {
      const indexesIngredients = InvertedIndex.ingredientsMap.get(tag) || []
      const indexesAppliances = InvertedIndex.appliancesMap.get(tag) || []
      const indexesUstensils = InvertedIndex.ustensilsMap.get(tag) || []

      const indexesTags = [...indexesIngredients, ...indexesAppliances, ...indexesUstensils]
      indexes = indexes.length === 0 ? indexesTags : indexes.filter(key => indexesTags.includes(key))
    })

    this.#_requestProcessingTimes.push(performance.now() - start)
    return indexes
  }

  // Extraire les mots clé d'une chaîne de charactère.
  static #extractKeyWords (expression) {
    expression = expression.toLowerCase()

    return expression.split(this.#_wordBreaker)
      .filter(word => !this.#_excludedWords.includes(word))
      .filter(word => word.length > 1)
  }

  /*  Traitement de la chaîne de caractère 'this.#_expression'.
      Retourne les indexes des entités correspondant aux mots clé présents
      dans la chaîne. (intersection de n ensembles) */
  static #indexesByKeyWords () {
    const keyWords = this.#extractKeyWords(this.#_expression)
    let returnedKeys = []

    if (keyWords.length > 0) {
      keyWords.forEach((keyWord) => {
        const newKeys = this.#indexesByKeyWord(new RegExp(`^${keyWord}`, 'i'))
        returnedKeys = returnedKeys.length === 0 ? newKeys : returnedKeys.filter(key => newKeys.includes(key))
      })
    } else {
      returnedKeys = InvertedIndex.keyWordsMap.get('_allIndexes')
    }

    return returnedKeys
  }

  /*  Retourne les indexes des entités correspondant au mot clé
      passé en paramètre. */
  static #indexesByKeyWord (expression) {
    let returnedIndexes = []

    for (const key of InvertedIndex.keyWordsMap.keys()) {
      if (expression.test(key)) {
        const newKeys = InvertedIndex.keyWordsMap.get(key)

        if (returnedIndexes.length > 0) {
          returnedIndexes = [
            ...returnedIndexes,
            ...newKeys.filter(value => !returnedIndexes.includes(value))
          ]
        } else {
          returnedIndexes = newKeys
        }
      }
    }

    return returnedIndexes
  }
}

export { IndexesFinder as default }

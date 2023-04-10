class IndexesFinder {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrase en mots.
  static #_excludedWords = [] // Liste de mots non pertinants pour la recherche par mots clé.
  static #_entities = [] // Liste d'éntités de recette.
  static #_expression = '' // Critère de recherche: expression pour la recherche par mot clé.
  static #_tagsList = [] // Critère de recherche: liste de tags pour la recherche par tags.

  static requestProcessingTimes = []

  // Paramètres d'initialisation.
  static initIndexesFinder (recipesEntities, excludedWords) {
    this.#_entities = recipesEntities || []
    this.#_excludedWords = excludedWords || []
  }

  // Status des critères de recherche.
  static get hasSearchCriteria () {
    return ((this.#_expression !== '' || this.#_tagsList.length > 0) && this.#_entities.length > 0)
  }

  // Critères de recherches.
  static setCriteria = {
    expression: (value) => { this.#_expression = value },
    tagsList: (value) => { this.#_tagsList = value }
  }

  static showPerformance () {
    const minTime = this.requestProcessingTimes.length > 0 ? `${(Math.min(...this.requestProcessingTimes)).toFixed(3)} ms` : '--'
    const maxTime = this.requestProcessingTimes.length > 0 ? `${(Math.max(...this.requestProcessingTimes)).toFixed(3)} ms` : '--'
    const averageTime = this.requestProcessingTimes.length > 0
      ? `${(this.requestProcessingTimes.reduce((total, value) => total + value, 0) / this.requestProcessingTimes.length).toFixed(3)} ms`
      : '--'

    console.log(`
      Bilan de performance:
      Nombre de requètes: ${this.requestProcessingTimes.length}
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
      const indexesIngredients = this.#indexesByIngredient(tag)
      const indexesAppliances = this.#indexesByAppliance(tag)
      const indexesUstensils = this.#indexesByUstensil(tag)

      const indexesTags = [...indexesIngredients, ...indexesAppliances, ...indexesUstensils]
      indexes = indexes.length === 0 ? indexesTags : indexes.filter(key => indexesTags.includes(key))
    })

    this.requestProcessingTimes.push(performance.now() - start)
    return indexes
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
      returnedKeys = this.#_entities.map(recipe => recipe.id)
    }

    return returnedKeys
  }

  // Extraire les mots clé d'une chaîne de charactère.
  static #extractKeyWords (expression) {
    expression = expression.toLowerCase()

    return expression.split(this.#_wordBreaker)
      .filter(word => !this.#_excludedWords.includes(word))
      .filter(word => word.length > 1)
  }

  /*  Retourne les indexes des entités correspondant au mot clé
      passé en paramètre. */
  static #indexesByKeyWord (expression) {
    const returnedIndexes = []
    for (let i = 0; i < this.#_entities.length; i++) {
      if (this.#searchExpression(expression, this.#_entities[i])) returnedIndexes.push(this.#_entities[i].id)
    }
    return returnedIndexes
  }

  /*  Cherche une correspondance au mot clé passé en paramètre dans une
      entité de recette. La recherche se focalise sur les propriétés 'name',
      'description' et 'ingredients(name)' de la recette.
      La fonction retourne 'true' dés la première correspondance,
      et false si aucune correspondance n'est trouvée. */
  static #searchExpression (expression, recipe) {
    const testedText = {
      value: '',
      add: function (text) {
        this.value = this.value + text + ' '
      }
    }

    testedText.add(recipe.name)
    testedText.add(recipe.description)

    for (let i = 0; i < recipe.ingredients.length; i++) {
      testedText.add(recipe.ingredients[i].name)
    }

    const keyWords = this.#extractKeyWords(testedText.value)

    for (let i = 0; i < keyWords.length; i++) {
      if (expression.test(keyWords[i])) return true
    }
    return false
  }

  /*  Retourne les indexes des entités de recette contenant
      l'ingrédient passé en paramètre. */
  static #indexesByIngredient (expression) {
    const returnedIndexes = []
    for (let i = 0; i < this.#_entities.length; i++) {
      if (findIngredient(expression, this.#_entities[i].ingredients)) returnedIndexes.push(this.#_entities[i].id)
    }

    function findIngredient (expression, ingredients) {
      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name === expression) return true
      }
      return false
    }
    return returnedIndexes
  }

  /*  Retourne les indexes des entités de recette contenant
      l'appareil passé en paramètre. */
  static #indexesByAppliance (expression) {
    const returnedIndexes = []
    for (let i = 0; i < this.#_entities.length; i++) {
      if (this.#_entities[i].appliance === expression) returnedIndexes.push(this.#_entities[i].id)
    }
    return returnedIndexes
  }

  /*  Retourne les indexes des entités de recette contenant
      l'ustensile passé en paramètre. */
  static #indexesByUstensil (expression) {
    const returnedIndexes = []
    for (let i = 0; i < this.#_entities.length; i++) {
      if (findUstensil(expression, this.#_entities[i].ustensils)) returnedIndexes.push(this.#_entities[i].id)
    }

    function findUstensil (expression, ustensils) {
      for (let i = 0; i < ustensils.length; i++) {
        if (ustensils[i] === expression) return true
      }
      return false
    }
    return returnedIndexes
  }
}

export { IndexesFinder as default }

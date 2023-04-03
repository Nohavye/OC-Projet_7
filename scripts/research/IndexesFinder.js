class IndexesFinder {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrase en mots.

  static #_excludedWords = [] // Liste de mots non pertinants pour la recherche par mots clé.
  static #_entities = []

  static #_expression = ''
  static #_tagsList = []

  static setIndexesFinder (recipesEntities, excludedWord) {
    this.#_entities = recipesEntities
    this.#_excludedWords = excludedWord
  }

  static get expression () {
    return this.#_expression
  }

  static set expression (value) {
    this.#_expression = value
  }

  static get tagsList () {
    return this.#_tagsList
  }

  static set tagsList (value) {
    this.#_tagsList = value
  }

  static get indexes () {
    let indexes = this.#_expression !== '' ? this.#indexesByKeyWords(this.#_expression) : []

    this.#_tagsList.forEach((tag) => {
      const indexesIngredients = this.#indexesByIngredient(tag)
      const indexesAppliances = this.#indexesByAppliance(tag)
      const indexesUstensils = this.#indexesByUstensil(tag)

      const indexesTags = [...indexesIngredients, ...indexesAppliances, ...indexesUstensils]
      indexes = indexes.length === 0 ? indexesTags : indexes.filter(key => indexesTags.includes(key))
    })
    return indexes
  }

  static #indexesByKeyWords (expression) {
    const keyWords = this.#extractKeyWords(expression)
    let returnedKeys = []
    keyWords.forEach((keyWord) => {
      const newKeys = this.#indexesByKeyWord(new RegExp(`^${keyWord}`, 'i'))
      returnedKeys = returnedKeys.length === 0 ? newKeys : returnedKeys.filter(key => newKeys.includes(key))
    })
    return returnedKeys
  }

  static #extractKeyWords (text) {
    return text.split(this.#_wordBreaker)
      .filter(word => !this.#_excludedWords.includes(word))
      .filter(word => word.length > 1)
  }

  static #indexesByKeyWord (expression) {
    return this.#_entities.filter((recipe) => {
      return this.#searchExpression(expression, recipe)
    }).map(recipe => recipe.id)
  }

  static #searchExpression (expression, recipe) {
    const text = {
      value: '',
      add: function (text) {
        this.value = this.value + text + ' '
      }
    }

    text.add(recipe.name)
    text.add(recipe.description)

    recipe.ingredients.forEach((ingredient) => {
      text.add(ingredient.name)
    })

    const words = this.#extractKeyWords(text.value)
    return words.some(word => expression.test(word))
  }

  static #indexesByIngredient (expression) {
    return this.#_entities.filter((recipe) => {
      return recipe.ingredients.find((ingredient) => {
        return ingredient.name === expression
      })
    }).map(recipe => recipe.id)
  }

  static #indexesByAppliance (expression) {
    return this.#_entities.filter((recipe) => {
      return recipe.appliance === expression
    }).map(recipe => recipe.id)
  }

  static #indexesByUstensil (expression) {
    return this.#_entities.filter((recipe) => {
      return recipe.ustensils.find((ustensil) => {
        return ustensil === expression
      })
    }).map(recipe => recipe.id)
  }
}

export { IndexesFinder as default }

class IndexesFinder {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrase en mots.
  static #_excludedWords = [] // Liste de mots non pertinants pour la recherche par mots clé.
  static #_entities = [] // Liste d'éntités de recette.
  static #_expression = '' // Critère de recherche: expression pour la recherche par mot clé.
  static #_tagsList = [] // Critère de recherche: liste de tags pour la recherche par tags.

  // Paramètres d'initialisation.
  static initIndexesFinder (recipesEntities, excludedWord) {
    this.#_entities = recipesEntities || []
    this.#_excludedWords = excludedWord || []
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

  // Retourne les indexes des entités correspondants au critères de recherche.
  static get indexes () {
    let indexes = this.#_expression !== '' ? this.#indexesByKeyWords() : []

    this.#_tagsList.forEach((tag) => {
      const indexesIngredients = this.#indexesByIngredient(tag)
      const indexesAppliances = this.#indexesByAppliance(tag)
      const indexesUstensils = this.#indexesByUstensil(tag)

      const indexesTags = [...indexesIngredients, ...indexesAppliances, ...indexesUstensils]
      indexes = indexes.length === 0 ? indexesTags : indexes.filter(key => indexesTags.includes(key))
    })
    return indexes
  }

  /*  Traitement de la chaîne de caractère 'this.#_expression'.
      Retourne les indexes des entités correspondant aux mots clé présents
      dans la chaîne. (intersection de n ensembles) */
  static #indexesByKeyWords () {
    const keyWords = this.#extractKeyWords(this.#_expression)
    let returnedKeys = []
    keyWords.forEach((keyWord) => {
      const newKeys = this.#indexesByKeyWord(new RegExp(`^${keyWord}`, 'i'))
      returnedKeys = returnedKeys.length === 0 ? newKeys : returnedKeys.filter(key => newKeys.includes(key))
    })
    return returnedKeys
  }

  // Extraire les mots clé d'une chaîne de charactère.
  static #extractKeyWords (expression) {
    return expression.split(this.#_wordBreaker)
      .filter(word => !this.#_excludedWords.includes(word))
      .filter(word => word.length > 1)
  }

  /*  Retourne les indexes des entités correspondant au mot clé
      passé en paramètre. */
  static #indexesByKeyWord (expression) {
    return this.#_entities.filter((recipe) => {
      return this.#searchExpression(expression, recipe)
    }).map(recipe => recipe.id)
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

    recipe.ingredients.forEach((ingredient) => {
      testedText.add(ingredient.name)
    })

    const keyWords = this.#extractKeyWords(testedText.value)
    return keyWords.some(keyWord => expression.test(keyWord))
  }

  /*  Retourne les indexes des entités de recette contenant
      l'ingrédient passé en paramètre. */
  static #indexesByIngredient (expression) {
    return this.#_entities.filter((recipe) => {
      return recipe.ingredients.find((ingredient) => {
        return ingredient.name === expression
      })
    }).map(recipe => recipe.id)
  }

  /*  Retourne les indexes des entités de recette contenant
      l'appareil passé en paramètre. */
  static #indexesByAppliance (expression) {
    return this.#_entities.filter((recipe) => {
      return recipe.appliance === expression
    }).map(recipe => recipe.id)
  }

  /*  Retourne les indexes des entités de recette contenant
      l'ustensile passé en paramètre. */
  static #indexesByUstensil (expression) {
    return this.#_entities.filter((recipe) => {
      return recipe.ustensils.find((ustensil) => {
        return ustensil === expression
      })
    }).map(recipe => recipe.id)
  }
}

export { IndexesFinder as default }

class GetIndexes {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrease en mots.
  static excludedWords = [] // Liste de mots non pertinants pour la recherche par mots clé.
  static recipesEntities = []

  static byKeyWord (expression) {
    return this.recipesEntities.filter((recipe) => {
      return this.#searchExpression(expression, recipe)
    }).map(recipe => recipe.id)
  }

  static #searchExpression (expression, recipe) {
    let text = ''

    const scanProperties = ['name', 'description']
    scanProperties.forEach((property) => {
      text = text + recipe[property] + ' '
    })

    recipe.ingredients.forEach((ingredient) => {
      text = text + ingredient.name + ' '
    })

    const words = text.split(this.#_wordBreaker)
      .filter(word => !this.excludedWords.includes(word))
      .filter(word => word.length > 1)

    return words.some(word => expression.test(word))
  }

  static byIngredient (expression) {
    return this.recipesEntities.filter((recipe) => {
      return recipe.ingredients.find((ingredient) => {
        return ingredient.name === expression
      })
    }).map(recipe => recipe.id)
  }

  static byAppliance (expression) {
    return this.recipesEntities.filter((recipe) => {
      return recipe.appliance === expression
    }).map(recipe => recipe.id)
  }

  static byUstensil (expression) {
    return this.recipesEntities.filter((recipe) => {
      return recipe.ustensils.find((ustensil) => {
        return ustensil === expression
      })
    }).map(recipe => recipe.id)
  }
}

export { GetIndexes as default }

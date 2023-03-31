class InvertedIndex {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/
  static excludedWords = []

  static keyWordsMap = new Map()
  static ingredientsMap = new Map()
  static appliancesMap = new Map()
  static ustensilsMap = new Map()

  static updateMaps (hashTable) {
    this.keyWordsMap.clear()
    this.ingredientsMap.clear()
    this.appliancesMap.clear()
    this.ustensilsMap.clear()

    hashTable.forEach((recipe, id, map) => {
      this.#scanKeyWords(recipe, id)
      this.#scanIngredients(recipe, id)
      this.#scanAppliances(recipe, id)
      this.#scanUstensils(recipe, id)
    })

    this.excludedWords.forEach((excludedWord) => {
      if (this.keyWordsMap.has(excludedWord)) {
        this.keyWordsMap.delete(excludedWord)
      }
    })
  }

  static #scanKeyWords (recipe, id) {
    const scanProperties = ['name', 'description']

    scanProperties.forEach((property) => {
      const words = recipe[property].split(this.#_wordBreaker)

      words.forEach((word) => {
        this.#updateKeyWord(word, id)
      })
    })

    recipe.ingredients.forEach((ingredient) => {
      const words = ingredient.name.split(this.#_wordBreaker)

      words.forEach((word) => {
        this.#updateKeyWord(word, id)
      })
    })
  }

  static #updateKeyWord (word, id) {
    if (word !== '' && word.length > 1) {
      word = word.toLowerCase()
      if (this.keyWordsMap.has(word)) {
        if (this.keyWordsMap.get(word).indexOf(id) === -1) {
          this.keyWordsMap.get(word).push(id)
        }
      } else {
        this.keyWordsMap.set(word, [id])
      }
    }
  }

  static #scanIngredients (recipe, id) {
    recipe.ingredients.forEach((ingredient) => {
      this.#updateIngredient(ingredient.name, id)
    })
  }

  static #updateIngredient (ingredient, id) {
    if (this.ingredientsMap.has(ingredient)) {
      if (this.ingredientsMap.get(ingredient).indexOf(id) === -1) {
        this.ingredientsMap.get(ingredient).push(id)
      }
    } else {
      this.ingredientsMap.set(ingredient, [id])
    }
  }

  static #scanAppliances (recipe, id) {
    this.#updateAppliance(recipe.appliance, id)
  }

  static #updateAppliance (appliance, id) {
    if (this.appliancesMap.has(appliance)) {
      if (this.appliancesMap.get(appliance).indexOf(id) === -1) {
        this.appliancesMap.get(appliance).push(id)
      }
    } else {
      this.appliancesMap.set(appliance, [id])
    }
  }

  static #scanUstensils (recipe, id) {
    recipe.ustensils.forEach((ustensil) => {
      this.#updateUstensil(ustensil, id)
    })
  }

  static #updateUstensil (ustensil, id) {
    if (this.ustensilsMap.has(ustensil)) {
      if (this.ustensilsMap.get(ustensil).indexOf(id) === -1) {
        this.ustensilsMap.get(ustensil).push(id)
      }
    } else {
      this.ustensilsMap.set(ustensil, [id])
    }
  }
}

export { InvertedIndex as default }

class InvertedIndex {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/
  static #_excludedWords = ['le', 'la', 'les', 'une', 'un', 'des', 'du', 'de', 'au', 'aux',
    'et', 'ou', 'mais', 'que', 'qui', 'quoi', 'où', 'quand', 'comment', 'avec', 'pour', 'si',
    'par', 'sur', 'dans', 'vers', 'chez', 'jusque', 'jusqu', 'lorsque', 'ainsi', 'toujours',
    'jamais', 'parfois', 'souvent', 'plusieurs', 'quelque', 'chaque', 'certains', 'quelques',
    'autres', 'même', 'comme', 'tel', 'tout', 'toute', 'tous', 'toutes', 'cette', 'ce', 'ces',
    'dont', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'mon', 'ma', 'mes', 'ton', 'ta',
    'tes', 'son', 'sa', 'ses', 'aucun', 'aucune', 'quel', 'quelle', 'quels', 'quelles', 'tant',
    'trop', 'peu', 'beaucoup', 'en', 'là', 'ci', 'ça', 'ceci', 'cela', 'celui', 'ceux',
    'celle', 'celles', 'autre', 'autrui', 'lui', 'eux', 'elle', 'elles', 'moi', 'toi', 'eux-mêmes',
    'soi-même', 'même', 'nul', 'personne', 'chacun', 'telle', 'tels', 'telles', 'toutes', 'rien',
    'tout', 'cl', 'afin', 'puis']

  static keyWordsMap = new Map()
  static ingredientsMap = new Map()
  static appliancesMap = new Map()
  static ustensilsMap = new Map()

  static createMaps (hashTable) {
    hashTable.forEach((recipe, id, map) => {
      this.#scanKeyWords(recipe, id)
      this.#scanIngredients(recipe, id)
      this.#scanAppliances(recipe, id)
      this.#scanUstensils(recipe, id)
    })
    this.#_excludedWords.forEach((excludedWord) => {
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

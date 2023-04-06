class InvertedIndex {
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrease en mots.

  // Indexes inversés.
  static keyWordsMap = new Map() // Indexe inversé pour les mots clé.
  static ingredientsMap = new Map() // Indexe inversé pour les ingrédients.
  static appliancesMap = new Map() // Indexe inversé pour les appareils.
  static ustensilsMap = new Map() // Indexe inversé pour les ustensiles.

  // Création des indexes inversés.
  static updateMaps (hashTable, excludedWords = []) {
    // Réinitialiser les map.
    this.keyWordsMap.clear()
    this.ingredientsMap.clear()
    this.appliancesMap.clear()
    this.ustensilsMap.clear()

    // Insérer les paire clé-valeur dans les map.
    hashTable.forEach((recipe, id) => {
      this.#scanKeyWords(recipe, id)
      this.#scanIngredients(recipe, id)
      this.#scanAppliances(recipe, id)
      this.#scanUstensils(recipe, id)
    })

    // Supprimer les clés non pertinantes pour la recherche par mots clé.
    excludedWords.forEach((excludedWord) => {
      if (this.keyWordsMap.has(excludedWord)) this.keyWordsMap.delete(excludedWord)
    })

    this.keyWordsMap.set('_allIndexes', Array.from(hashTable.keys()))
  }

  // Récupérer les mots clé dans les section 'name', 'description'
  // et 'ingredients[].name' d'une entité 'recipe'.
  static #scanKeyWords (recipe, id) {
    const testedText = {
      value: '',
      add: function (text) {
        text = text.toLowerCase()
        this.value = this.value + text + ' '
      }
    }

    testedText.add(recipe.name)
    testedText.add(recipe.description)

    recipe.ingredients.forEach((ingredient) => {
      testedText.add(ingredient.name)
    })

    const words = testedText.value.split(this.#_wordBreaker)

    words.forEach((word) => {
      this.#updateKeyWord(word, id)
    })
  }

  // Créer un mot clé dans l'indexe inversé s'il n'existe pas et y
  // ajouter l'indexe de la recette correspondante. S'il existe,
  // y ajouter l'indexe de la recette correspondante.
  static #updateKeyWord (word, id) {
    if (word.length > 1) {
      if (this.keyWordsMap.has(word)) {
        if (this.keyWordsMap.get(word).indexOf(id) === -1) {
          this.keyWordsMap.get(word).push(id)
        }
      } else {
        this.keyWordsMap.set(word, [id])
      }
    }
  }

  // Récupérer les ingredients.
  static #scanIngredients (recipe, id) {
    recipe.ingredients.forEach((ingredient) => {
      this.#updateIngredient(ingredient.name, id)
    })
  }

  // Créer un ingrédient dans l'indexe inversé s'il n'existe pas et y
  // ajouter l'indexe de la recette correspondante. S'il existe,
  // y ajouter l'indexe de la recette correspondante.
  static #updateIngredient (ingredient, id) {
    if (this.ingredientsMap.has(ingredient)) {
      if (this.ingredientsMap.get(ingredient).indexOf(id) === -1) {
        this.ingredientsMap.get(ingredient).push(id)
      }
    } else {
      this.ingredientsMap.set(ingredient, [id])
    }
  }

  // Récupérer l'appareil.
  static #scanAppliances (recipe, id) {
    this.#updateAppliance(recipe.appliance, id)
  }

  // Créer un appareil dans l'indexe inversé s'il n'existe pas et y
  // ajouter l'indexe de la recette correspondante. S'il existe,
  // y ajouter l'indexe de la recette correspondante.
  static #updateAppliance (appliance, id) {
    if (this.appliancesMap.has(appliance)) {
      if (this.appliancesMap.get(appliance).indexOf(id) === -1) {
        this.appliancesMap.get(appliance).push(id)
      }
    } else {
      this.appliancesMap.set(appliance, [id])
    }
  }

  // Récupérer les ustensiles.
  static #scanUstensils (recipe, id) {
    recipe.ustensils.forEach((ustensil) => {
      this.#updateUstensil(ustensil, id)
    })
  }

  // Créer un ustensile dans l'indexe inversé s'il n'existe pas et y
  // ajouter l'indexe de la recette correspondante. S'il existe,
  // y ajouter l'indexe de la recette correspondante.
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

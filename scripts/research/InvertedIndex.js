class InvertedIndex {
  // Constante pour la construction de l'indexe de mots clé.
  static #_wordBreaker = /[ ,’';:!?.()°%/\\0-9]+/ // Séparateur pour la découpe de phrease en mots.
  static excludedWords = [] // Liste de mots non pertinants pour la recherche par mots clé.

  // Indexes inversés.
  static keyWordsMap = new Map() // Indexe inversé pour les mots clé.
  static ingredientsMap = new Map() // Indexe inversé pour les ingrédients.
  static appliancesMap = new Map() // Indexe inversé pour les appareils.
  static ustensilsMap = new Map() // Indexe inversé pour les ustensiles.

  // Création des indexes inversés.
  static updateMaps (hashTable) {
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
    this.excludedWords.forEach((excludedWord) => {
      if (this.keyWordsMap.has(excludedWord)) {
        this.keyWordsMap.delete(excludedWord)
      }
    })
  }

  // Récupérer les mots clé dans les section 'name', 'description'
  // et 'ingredients[].name' d'une entité 'recipe'.
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

  // Créer un mot clé dans l'index inversé s'il n'existe pas et y
  // ajouter l'indexe de la recette correspondante. S'il existe,
  // y ajouter l'indexe de la recette correspondante.
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

  // Récupérer les ingredients.
  static #scanIngredients (recipe, id) {
    recipe.ingredients.forEach((ingredient) => {
      this.#updateIngredient(ingredient.name, id)
    })
  }

  // Créer un ingrédient dans l'index inversé s'il n'existe pas et y
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

  // Créer un appareil dans l'index inversé s'il n'existe pas et y
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

  // Créer un ustensile dans l'index inversé s'il n'existe pas et y
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

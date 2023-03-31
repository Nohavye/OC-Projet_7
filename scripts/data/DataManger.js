import RecipeEntity from './RecipeEntity.js'

// Enumérateur pour les format de données.
const DataFormat = Object.freeze({
  Recipe: Symbol('recipe')
})

// Factory pattern pour la création de formats de données.
class DataFactory {
  constructor (data, dataFormat) {
    switch (dataFormat) {
      case DataFormat.Recipe:
        return new RecipeEntity(data)
    }
  }
}

// Gestion des données.
class DataManager {
  static #_data

  // Charger les données provenant d'un fichier JSON.
  static async loadData (url) {
    this.#_data = await fetch(url)
      .then(answer => answer.json())
      .catch(error => console.error(error))
  }

  // Récupérer une section de données au format spécifié.
  static getData (section, dataFormat) {
    try {
      if (typeof (dataFormat) !== 'undefined') {
        const formatedData = []
        this.#_data[section].forEach((data) => {
          formatedData.push(new DataFactory(data, dataFormat))
        })
        return formatedData
      } else {
        return this.#_data[section]
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Créer un table de hachage à partir de donées formatées.
  static hash (entities, property) {
    const hashTable = new Map()
    entities.forEach((entity) => {
      hashTable.set(entity[property], entity)
    })
    return hashTable
  }
}

export { DataManager, DataFormat }

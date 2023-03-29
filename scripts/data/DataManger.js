import RecipeEntity from './RecipeEntity.js'

const DataFormat = Object.freeze({
  Recipe: Symbol('recipe')
})

class DataFactory {
  constructor (data, dataFormat) {
    switch (dataFormat) {
      case DataFormat.Recipe:
        return new RecipeEntity(data)
    }
  }
}
class DataManager {
  static #_data

  static async loadData (url) {
    this.#_data = await fetch(url)
      .then(answer => answer.json())
      .catch(error => console.error(error))
  }

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

  static hash (entities, property) {
    const hashTable = new Map()
    entities.forEach((entity) => {
      hashTable.set(entity[property], entity)
    })
    return hashTable
  }
}

export { DataManager, DataFormat }

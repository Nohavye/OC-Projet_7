import Data from './data/DataModule.js'
import Globals from './globals/globals.js'
import Templates from './templates/TemplatesModule.js'
import IndexesFinder from './research/IndexesFinder.js'

const map = {
  recipes: new Map(),
  cards: new Map()
}

const components = {
  searchInput: Globals.DOM.searchInput,
  cardsCounterText: Globals.DOM.cardsCounterText,
  cardsCounterCross: Globals.DOM.cardsCounterCross,
  tagsHandler: new Templates.TagsHandler(Globals.DOM.tagsContainer),

  filters: {
    ingredients: new Templates.FilterSelector('ingredients', 'Ingredients'),
    appliances: new Templates.FilterSelector('appliances', 'Appareils'),
    ustensils: new Templates.FilterSelector('ustensils', 'Ustensiles')
  }
}

// Chargement des données.
async function getRecipesMap () {
  await Data.Manager.loadData('data/recipes.json')
  const recipesEntities = Data.Manager.getData('recipes', Data.DataFormat.Recipe)
  map.recipes = Data.Manager.hash(recipesEntities, 'id')
}

// Création des cartes de recette.
function createCardMap () {
  map.recipes.forEach((recipeEntity, key) => {
    map.cards.set(key, new Templates.RecipeCard(recipeEntity))
  })
}

// Initialisation des sélècteurs de filtres personnalisés.
function initFilters () {
  components.filters.ingredients.backgroundColor = '#3282F7'
  components.filters.appliances.backgroundColor = '#68D9A4'
  components.filters.ustensils.backgroundColor = '#ED6454'

  components.filters.ingredients.addTo(Globals.DOM.selectorsContainer)
  components.filters.appliances.addTo(Globals.DOM.selectorsContainer)
  components.filters.ustensils.addTo(Globals.DOM.selectorsContainer)
}

// Actualiser l'affichage des cartes.
function updateDisplayedCards (keys) {
  Globals.DOM.main.innerHTML = ''

  if (typeof (keys) === 'undefined') {
    for (const value of map.cards.values()) {
      value.addTo(Globals.DOM.main)
    }
  } else {
    keys.forEach((key) => {
      map.cards.get(key).addTo(Globals.DOM.main)
    })
  }

  // Actualiser le contenu des sélècteurs et du compteur.
  updateFilters(keys)
  updateCardsCounter()
}

// Actualiser le contenu des sélècteurs de filtres personnalisés.
function updateFilters (keys) {
  const ingredients = []
  const appliances = []
  const ustensils = []

  const addItems = (recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredients.push(ingredient.name)
    })

    appliances.push(recipe.appliance)

    recipe.ustensils.forEach((ustensil) => {
      ustensils.push(ustensil)
    })
  }

  if (typeof (keys) === 'undefined') {
    for (const recipe of map.recipes.values()) {
      addItems(recipe)
    }
  } else {
    keys.forEach((key) => {
      addItems(map.recipes.get(key))
    })
  }

  components.filters.ingredients.itemsList = ingredients
  components.filters.appliances.itemsList = appliances
  components.filters.ustensils.itemsList = ustensils
}

// Actualiser le compteur de résultats.
function updateCardsCounter () {
  const nbCards = Globals.DOM.main.childElementCount
  components.cardsCounterText.textContent = nbCards > 1 ? `${nbCards} résultats` : `${nbCards} résultat`
  components.cardsCounterCross.style.display = components.searchInput.value.length > 0 ? 'block' : 'none'
}

// Initialisation des évènements.
function initEvents () {
  // Réinitialiser l'entrée de recherche par mots clé.
  function resetSearchInput () {
    components.searchInput.value = ''
    updateIndexesFinder()
  }

  // Actualiser les critères de recherche et actualiser l'affichage des cartes en conséquence.
  function updateIndexesFinder () {
    IndexesFinder.setCriteria.expression(components.searchInput.value.length >= 3 ? components.searchInput.value : '')
    IndexesFinder.setCriteria.tagsList(components.tagsHandler.tagsList)
    updateDisplayedCards(IndexesFinder.hasSearchCriteria ? IndexesFinder.indexes : undefined)
  }

  // Initialiser 'IndexesFinder'.
  IndexesFinder.initIndexesFinder(Array.from(map.recipes.values()), Globals.excludedWords)

  // Réinitialiser l'entrée de recherche
  resetSearchInput()

  // Évènement lié à la saisie dans l'entrée de recherche.
  components.searchInput.addEventListener('input', (e) => {
    updateIndexesFinder()
  })

  // Réinitialiser l'entrée de recherche.
  components.cardsCounterCross.addEventListener('click', () => {
    resetSearchInput()
  })

  // Évènement lié à l'ajout d'un tag de filtrage.
  document.addEventListener('addTag', (e) => {
    e.detail.emitter.items.exclude(e.detail.value)
    updateIndexesFinder()
  })

  // Évènement lié au retrait d'un tag de filtrage.
  document.addEventListener('removeTag', (e) => {
    e.detail.emitter.items.include(e.detail.value)
    updateIndexesFinder()
  })

  // Évènement lié à la sélèction d'un élément dans l'un des selecteurs de filtre.
  document.addEventListener('selectItemFilter', (e) => {
    components.tagsHandler.addTag(e.detail.value, e.detail.emitter.backgroundColor, e.detail.emitter)
  })

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'b') {
      IndexesFinder.showPerformance()
    }
  })
}

async function init () {
  await getRecipesMap()
  initFilters()
  createCardMap()
  initEvents()
}

init()

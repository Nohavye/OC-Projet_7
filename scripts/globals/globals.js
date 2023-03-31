// Référence aux éléments du DOM nécessaires au fonctionnement de la page.
const DOM = {
  main: document.querySelector('main'),
  searchInput: document.querySelector('.inputSearch'),
  buttonSearch: document.querySelector('.buttonSearch'),
  tagsContainer: document.querySelector('.tagsContainer'),
  selectorsContainer: document.querySelector('.selectorsContainer')
}

// Liste de mots non pertinants pour la recherche par mots clé.
const excludedWords = ['le', 'la', 'les', 'une', 'un', 'des', 'du', 'de', 'au', 'aux',
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

const Globals = {
  DOM,
  excludedWords
}

export { Globals as default }

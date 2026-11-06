import './page/characters.js'
import './page/parties.js'
import './page/newspapers.js'

const initializers = [
    ...Object.values(window.characters.character),
    ...Object.values(window.parties.party),
    ...Object.values(window.newspapers.newspaper)
]

await Promise.all(initializers.map(entity => entity.init()))

window.ready = {
    characters: true,
    parties: true,
    newspapers: true
}

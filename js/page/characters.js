class character {
    constructor(key) {
        if (!key || !window.characters.list[key]) return

        this.id = key
        this.data = {}
        this.data.id = this.id
        this.data.name = window.characters.list[key].name
        this.data.nicknames = window.characters.list[key].nicknames
        this.data.player = window.characters.list[key].player
        this.data.party = window.characters.list[key].party
        this.data.province = window.characters.list[key].province
        this.data.img = window.characters.list[key].img !== false ? '/data/character/' + this.id + '/portrait.webp' : '/img/ui/user.svg'
    }

    async init() {
        this.renderCard()
    }

    async renderPage() {
        const container = document.querySelector('#characterInfo .pageContent')
        container.innerHTML = ''

        document.querySelector('#characterInfo .page-header-title').textContent = this.data.name
        document.querySelector('#characterInfo h3').classList.add('reader')
        document.querySelector('#characterInfo h3').innerHTML = '<div style="margin: auto 0">' + this.data.player + '</div>' + window.parties.party[this.data.party].getChip(null, true, false, true)
        document.querySelector('#characterInfo img').src = this.data.img

        const description = document.createElement('div')
        description.className = 'reader'
        description.innerHTML = await window.getReadyMd('/data/character/' + this.id + '/' + this.id + '.md')

        container.appendChild(description)

        changePage('characterInfo', this.id)
    }

    renderCard() {
        const container = document.querySelector('#characters .pageContent')

        const el = document.createElement('div')
        el.className = 'card characterCard'

        const img = document.createElement('img')
        img.src = this.data.img

        const div = document.createElement('div')
            div.className = 'characterCardRight'

            const name = document.createElement('h2')
            name.textContent = this.data.name

            div.appendChild(name)
        
        const party = document.createElement('div')
        party.className = 'reader chip'
        party.innerHTML = window.parties.party[this.data.party].getChip(null, true, false, true)

        el.appendChild(img)
        el.appendChild(div)
        el.appendChild(party)

        container.appendChild(el)

        div.addEventListener('click', () => {
            this.renderPage()
        })
    }

    getChip(text, isBg, isT, partyColorOverride) {
        const safeText = text ?? this.data.name
        const partyColor = partyColorOverride ?? window.parties.party[this.data.party]?.data?.color
        return `<span 
            class="mention-btn character-btn ${isBg ? 'bgChip' : ''}"
            style="${
                isBg && partyColor ? 
                    'background-color: ' + partyColor + ';'
                     : ''}
                ${isT && partyColor ? 
                    'color: ' + partyColor + ';' 
                    : ''}"
            onclick="window.characters.character['${this.data.id}'].renderPage()">` +
                `<img class="chip-icon" src="` + this.data.img + `">${safeText}` +
        `</span>`
    }
}

window.characters = {}
window.characters.character = {}
window.characters.list = {}
window.characters.nicknames = {}

const charactersJson = await fetchGet("/data/characters.json")
window.characters.list = JSON.parse(charactersJson)

Object.keys(window.characters.list).forEach(key => {
    const characterInstance = new character(key)
    window.characters.character[key] = characterInstance

    const characterData = characterInstance.data
    if (!characterData.nicknames) characterData.nicknames = []
    if (!characterData.nicknames.includes(characterData.name))
        characterData.nicknames.push(characterData.name)
    if (!characterData.nicknames.includes(characterData.id))
        characterData.nicknames.push(characterData.id)

    window.characters.nicknames[key] = characterData.nicknames
})

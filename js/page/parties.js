class party {
    constructor(key) {
        if (!key || !window.parties.list[key]) return

        this.id = key
        this.data = window.parties.list[key]
        this.data.img = window.parties.list[key].img !== false ? '/data/party/' + this.id + '/icon.webp' : '/img/ui/blank.svg'
    }

    async init() {
        this.renderCard()
    }

    async renderPage() {
        const container = document.querySelector('#partyInfo .pageContent')
        container.innerHTML = ''

        document.querySelector('#partyInfo .page-header-title').textContent = this.data.name
        const imgEl = document.querySelector('#partyInfo .page-header img')
        if (imgEl) imgEl.src = this.data.img

        const description = document.createElement('div')
        description.className = 'reader'
        description.innerHTML = await window.getReadyMd('/data/party/' + this.id + '/' + this.id + '.md')

        container.appendChild(description)

        changePage('partyInfo', this.id)
    }

    renderCard() {
        const container = document.querySelector('#parties .pageContent')

        const el = document.createElement('div')
        el.className = 'card partyCard'

        const img = document.createElement('img')
        img.src = this.data.img
        img.className = 'partyIco'

        const div = document.createElement('div')
            div.className = 'partyCardRight'

            const name = document.createElement('h2')
            name.textContent = this.data.name

            div.appendChild(name)


            const ideologyDiv = document.createElement('div')
            ideologyDiv.className = 'ideology reader'
            ideologyDiv.innerHTML = window.parseMdFile(this.data.ideology + ' (' + this.data.political_leaning + ')')

            div.appendChild(ideologyDiv)


            const membersDiv = document.createElement('div')
            membersDiv.className = 'members reader'
            membersDiv.innerHTML = window.parseMdFile(this.data.members?.join(' '), true, {
                isText: true,
                partyColor: this.data.color
            })

            div.appendChild(membersDiv)

        

        el.appendChild(img)
        el.appendChild(div)

        container.appendChild(el)

        div.addEventListener('click', () => {
            this.renderPage()
        })
    }

    getChip(text, isBg, isT, textL) {
        let textLText = textL;
        if (textLText === true) textLText = this.data.name;

        const name = this.data.name || '';
        const safeText = (text ?? textL) 
            ? name.split(" ").map(word => word[0] ? word[0].toUpperCase() : "").join("") 
            : name;
        
        const safeTextL = textLText ?? name;
        const safeId = String(this.id).replace(/'/g, "\\'");

        return `<span 
            class="mention-btn character-btn ${isBg ? 'bgChip' : ''} ${textL ? 'withL' : ''}"
            style="${isBg ? '--local-bg: ' + this.data.color + ';' : ''} ${isT ? 'color: ' + this.data.color + ';' : ''}"
            onclick="window.parties.party['${safeId}'].renderPage()">
                <img src="${this.data.img}" alt="" class="chip-icon">
                <span class="shortName">${safeText}</span>
                ${textL ? `<span class="longTextDiv">
                    <img src="${this.data.img}" alt="" class="chip-icon">
                    <span class="longNameText">${safeTextL}</span>
                </span>` : ''}
        </span>`;
    }   
}

window.parties = {}
window.parties.party = {}
window.parties.list = {}
window.parties.nicknames = {}

const partiesJson = await fetchGet("/data/parties.json")
window.parties.list = JSON.parse(partiesJson)

Object.keys(window.parties.list).forEach(key => {
    const partyInstance = new party(key)
    window.parties.party[key] = partyInstance

    const partyData = partyInstance.data
    if (!partyData.nicknames) partyData.nicknames = []
    if (!partyData.nicknames.includes(partyData.name))
        partyData.nicknames.push(partyData.name)
    if (!partyData.nicknames.includes(key))
        partyData.nicknames.push(key)

    window.parties.nicknames[key] = partyData.nicknames
})

class newspaper {
    constructor(id) {
        this.id = id
        this.data = window.newspapers.list[id]
        this.papers = {}

        this.container = document.querySelector('#newspapers .pageContent')
    }

    async init() {
        await this.loadArticles()
        await this.generateCard()
    }

    async generateCard() {
        const el = document.createElement('div')
        el.className = 'newspaperCard card'

        const line1 = document.createElement('div')
            const leftPart1 = document.createElement('div')
            leftPart1.style.display = 'inline-flex'
            leftPart1.style.gap = 'var(--dss)'

            if (this.data?.icon === true) {
                const img = document.createElement('img')
                img.className = 'newspaperIcon'
                img.src = '/data/newspaper/' + this.id + '/img/icon.webp'

                leftPart1.appendChild(img)
            }

        
            const title = document.createElement('h2')
            title.textContent = this.data?.name

            leftPart1.appendChild(title)


            line1.appendChild(leftPart1)


            const partyOwner = document.createElement('div')
                partyOwner.className = 'newspaperPartyDiv reader'

            if (!this.data?.party) {
                partyOwner.textContent = 'Independent'
            } else {
                const ownerParty = window.parties.party[this.data.party]
                if (ownerParty) {
                    partyOwner.innerHTML = ownerParty.getChip(null, true, false, true)
                } else {
                    partyOwner.textContent = this.data.party
                }
            }

            line1.appendChild(partyOwner)

        const line2 = document.createElement('div')

            if (this.data?.description !== false) {
                const descrDiv = document.createElement('div')
                descrDiv.className = 'newspaperDescriptionDiv'

                const descrText = document.createElement('p')
                descrText.className = 'newspaperDescriptionShort reader short'
                // descrText.textContent = this.data.description.join('\n')
                descrText.innerHTML = await window.getReadyMd('/data/newspaper/' + this.id + '/description.md')

                const descrShadow = document.createElement('div')
                descrShadow.className = 'newspaperDescriptionShadow'

                descrDiv.appendChild(descrText)
                descrDiv.appendChild(descrShadow)
                line2.appendChild(descrDiv)
            }

        const line3 = document.createElement('div')

        line1.className = 'newspaperLine'
        line2.className = 'newspaperLine'
        line3.className = 'newspaperLine'

        el.appendChild(line1)
        el.appendChild(line2)
        el.appendChild(line3)

        const clicker = document.createElement('div')
        clicker.className = 'newspaperClicker'
        el.appendChild(clicker)

        this.container.appendChild(el)

        clicker.addEventListener('click', () => {
            this.renderPage()
        })
    }

    async loadArticles() {
        await Promise.all(Object.keys(this.data.papers ?? {}).map(async paperId => {
            this.papers[paperId] = await window.getReadyMd('/data/newspaper/' + this.id + '/' + paperId + '.md') ?? ''
        }))
    }

    async renderPage() {
        const container = document.querySelector('#newspaperInfo .pageContent')
        container.innerHTML = ''

        document.querySelector('#newspaperInfo .page-header-title').textContent = this.data.name
        document.querySelector('#newspaperInfo .page-header img').src = this.data.icon ? '/data/newspaper/' + this.id + '/img/icon.webp' : '/img/ui/blank.svg'
        const descrNewspaper = document.createElement('div')
        descrNewspaper.className = 'newspaperDescriptionOnpage reader'
        descrNewspaper.innerHTML = await window.getReadyMd('/data/newspaper/' + this.id + '/description.md') ?? ''
        container.appendChild(descrNewspaper)

        const papersList = document.createElement('div')
        papersList.id = 'newspaperInfoListArticles'
        container.appendChild(papersList)

        Object.keys(this.data.papers).forEach(paperId => {
            const el = document.createElement('div')
            el.className = 'card newspaperArticleCard'


            const paperData = this.data.papers[paperId]
            if (!paperData.author) {
                if (!this.newspaperData?.authors[0])
                    paperData.author = 'unknown'
                else 
                    paperData.author = this.newspaperData.authors[0]
            } else if (paperData.author == 'ns')
                paperData.author = 'unknown'

            let title = (paperData.name ?? this.papers[paperId]).split(/\r?\n/)[0]
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = title
            title = tempDiv.textContent || tempDiv.innerText || ""

            el.innerHTML = `
                <h2>${title}</h2>
                <div class="articleCardBottom">
                    <h4 class="articleCardDate">${paperData.date}</h4>
                    <h4 class="articleCardAuthor">- ${window.ucFirst(paperData.author)}</h4>
                </div>
            `

            el.addEventListener('click', async () => {
                if (paperData.pdf !== true) 
                    await window.getReadyMd('./data/newspaper/' + this.id + '/' + paperId + '.md', true)
                else
                    document.getElementById('renderMdPlace').innerHTML = `
                        <iframe src="/js/lib/pdf/web/viewer.html?file=${'/data/newspaper/' + this.id + '/' + paperId}.pdf" style="width: 100%; height: calc(100dvh - (40px + var(--ds)) + var(--dss) * 2 + calc(var(--ds) * 1.5 + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px))) + var(--ds) * 2 + calc(var(--ds, 0px) + var(--safe-area-top, env(safe-area-inset-top, 0px))));"></iframe>
                    `
                document.querySelector('#reader .page-header-title').textContent = title
                changePage('reader', paperId)
            })

            papersList.appendChild(el)
        })
        
        changePage('newspaperInfo', this.id)
    }
}

window.newspapers = {}
window.newspapers.newspaper = {}
window.newspapers.list = {}
window.newspapers.nicknames = {}
const newspapersJson = await fetchGet("/data/newspapers.json")
window.newspapers.list = JSON.parse(newspapersJson)

Object.keys(window.newspapers.list).forEach(key => {
    const newspaperInstance = new newspaper(key)
    window.newspapers.newspaper[key] = newspaperInstance

    const newspaperData = newspaperInstance.data
    if (!newspaperData.nicknames) newspaperData.nicknames = []
    if (!newspaperData.nicknames.includes(newspaperData.name)) {
        newspaperData.nicknames.push(newspaperData.name)
        newspaperData.nicknames.push(key.toUpperCase())
    }

    window.newspapers.nicknames[key] = newspaperData.nicknames
})

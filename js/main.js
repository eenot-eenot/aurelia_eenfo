window.ucFirst = function(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

window.readyMdFiles = {}

window.loadMdFile = function(mdFilePath) {
    if (Object.prototype.hasOwnProperty.call(window.readyMdFiles, mdFilePath)) {
        return Promise.resolve(window.readyMdFiles[mdFilePath])
    }
    return fetch(mdFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error: ' + response.statusText)
            }
            return response.text()
        })
        .then(markdownText => {
            const html = marked.parse(markdownText)
            window.readyMdFiles[mdFilePath] = html
            return html
        })
        .catch(error => {
            console.error('Ошибка:', error)
            return '<p>Error</p>'
        })
}

window.parseMdFile = function(text, isReplaceNames, options) {

    const charObj = window.characters?.nicknames ?? {}
    const newsObj = window.newspapers?.nicknames ?? {}
    const partyObj = window.parties?.nicknames ?? {}
    const eventObj = {}

    // Функция для генерации регулярки и карты поиска
    function createReplacementRegex(chars, events, parties, newspapers) {
        const allTerms = []

        // characters
        for (const [key, variants] of Object.entries(chars)) {
            const list = Array.isArray(variants) ? variants : [variants]
            list.forEach(term => allTerms.push({ term, type: 'character', id: key }))
        }

        // newspapers
        for (const [key, variants] of Object.entries(newspapers)) {
            const list = Array.isArray(variants) ? variants : [variants]
            list.forEach(term => allTerms.push({ term, type: 'newspaper', id: key }))
        }

        // events
        for (const [key, variants] of Object.entries(events)) {
            const list = Array.isArray(variants) ? variants : [variants]
            list.forEach(term => allTerms.push({ term, type: 'event', id: key }))
        }

        // parties
        for (const [key, variants] of Object.entries(parties)) {
            const list = Array.isArray(variants) ? variants : [variants]
            list.forEach(term => allTerms.push({ term, type: 'party', id: key }))
        }

        // Сортируем от длинных к коротким, чтобы длинные фразы заменялись первыми
        allTerms.sort((a, b) => b.term.length - a.term.length)

        // Карта для быстрого поиска в нижнем регистре
        const map = new Map()
        allTerms.forEach(item => map.set(item.term.toLowerCase(), item))
        window.parsingTerms = allTerms

        // Экранирование спецсимволов для RegExp (совместимо с флагом u)
        const escapedTerms = allTerms.map(item =>
            item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        )

        if (escapedTerms.length === 0) {
            return { regex: null, map }
        }

        const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapedTerms.join('|')})(?=$|[^\\p{L}\\p{N}])`, 'giu')
        return { regex, map }
    }

    // Если входной текст пустой, сразу возвращаем пустую строку
    if (!text) return ''

    // Виртуальный контейнер через DOMParser
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${text}</div>`, 'text/html')
    const container = doc.body.firstChild

    const { regex, map } = createReplacementRegex(charObj, eventObj, partyObj, newsObj)
    
    // Если регулярное выражение не сформировано (нет терминов), возвращаем исходный HTML
    if (!regex) return container.innerHTML

    // Используем doc.createTreeWalker вместо глобального document
    const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT, null)
    const textNodes = []
    
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode)
    }

    function createMention(data, termToMatch) {
        const element = doc.createElement('span')
        let label = termToMatch

        if (data.type === 'character') {
            const character = window.characters?.character?.[data.id]
            if (!character) return termToMatch
            label = isReplaceNames ? character.data.name : termToMatch
            return character.getChip(label, options?.isBg, options?.isText, options?.partyColor)
        } else if (data.type === 'party') {
            const party = window.parties?.party?.[data.id]
            if (!party) return termToMatch
            label = isReplaceNames ? party.data.name : termToMatch
            return party.getChip(label, options?.isBg, options?.isText)
        } else if (data.type === 'event') {
            element.className = 'mention-btn event-btn'
            element.setAttribute('onclick', `window.openEvent('${data.id}')`)
        } else if (data.type === 'newspaper') {
            element.className = 'mention-btn party-btn'
            const newspaper = window.newspapers?.newspaper?.[data.id]
            if (!newspaper) return termToMatch
            element.setAttribute('onclick', `window.newspapers.newspaper['${data.id}'].renderPage()`)
        } else {
            return termToMatch
        }

        element.appendChild(doc.createTextNode(label))
        return element.outerHTML
    }

    // Replace matched mentions using DOM nodes so source text is never parsed as HTML.
    textNodes.forEach(node => {
        const nodeText = node.nodeValue
        regex.lastIndex = 0
        const fragment = doc.createDocumentFragment()
        let cursor = 0
        let match
        let replaced = false

        while ((match = regex.exec(nodeText)) !== null) {
            const termToMatch = match[2] || match[0]
            const data = map.get(termToMatch.toLowerCase())
            if (!data) continue

            fragment.appendChild(doc.createTextNode(nodeText.slice(cursor, match.index)))
            if (match[1]) fragment.appendChild(doc.createTextNode(match[1]))
            const mention = doc.createElement('div')
            mention.innerHTML = createMention(data, termToMatch)
            while (mention.firstChild) {
                fragment.appendChild(mention.firstChild)
            }
            cursor = match.index + match[0].length
            replaced = true
        }

        if (!replaced) return
        fragment.appendChild(doc.createTextNode(nodeText.slice(cursor)))
        node.parentNode.replaceChild(fragment, node)
    })

    return container.innerHTML
}

window.getReadyMd = async function(mdFilePath, isShow) {

    const parties = {
        "awl": ["AWL", "AWL Labour Wing"],
    }

    const events = {}

    const result = window.parseMdFile(await window.loadMdFile(mdFilePath))

    if (isShow === true) document.getElementById('renderMdPlace').innerHTML = result

    return(result)
}

window.loadMdFileAndShow = function(mdFilePath) {
    loadMdFile(mdFilePath).then(html => {
        document.getElementById('renderMdPlace').innerHTML = html
    })
}

loadMdFileAndShow('./data/newspaper/dsd/test.md')



document.addEventListener('DOMContentLoaded', () => {
    const qs = document.createElement('div')
    qs.id = 'mdQuickSettings'

    const paddingRange = document.createElement('input')
    paddingRange.type = 'range'
    paddingRange.id = 'paddingMdQS'
    paddingRange.min = 0
    paddingRange.max = 20
    qs.appendChild(paddingRange)
    paddingRange.addEventListener('input', () => {
        document.getElementById('renderMdPlace').style.padding = `0 ${paddingRange.value}dvw`
    })

    const btnsRow1 = document.createElement('div')
    btnsRow1.className = 'btnsRow'
    qs.appendChild(btnsRow1)

    const textFullBtn = document.createElement('button')
    textFullBtn.id = 'textFullAlign'
    textFullBtn.className = 'aBtn'
    textFullBtn.innerHTML = '<img src="img/ui/text_big.svg">'
    btnsRow1.appendChild(textFullBtn)
    let isTextAligned = false
    textFullBtn.addEventListener('click', () => {
        if (isTextAligned === false) {
            isTextAligned = true
            textFullBtn.classList.add('active')

            document.querySelectorAll('#renderMdPlace p').forEach(el => {
                el.style.textAlign = 'justify'
            })
        } else {
            isTextAligned = false
            textFullBtn.classList.remove('active')

            document.querySelectorAll('#renderMdPlace p').forEach(el => {
                el.style.textAlign = 'left'
            })
        }
    })

    const firstLinePadBtn = document.createElement('button')
    firstLinePadBtn.id = 'firstLinePadBtn'
    firstLinePadBtn.className = 'aBtn'
    firstLinePadBtn.innerHTML = '<img src="img/ui/object.svg">'
    btnsRow1.appendChild(firstLinePadBtn)
    let isTextFirstLine = false
    firstLinePadBtn.addEventListener('click', () => {
        if (isTextFirstLine === false) {
            isTextFirstLine = true
            firstLinePadBtn.classList.add('active')

            document.querySelectorAll('#renderMdPlace p').forEach(el => {
                el.style.textIndent = '3rem'
            })
        } else {
            isTextFirstLine = false
            firstLinePadBtn.classList.remove('active')

            document.querySelectorAll('#renderMdPlace p').forEach(el => {
                el.style.textIndent = 'unset'
            })
        }
    })

    const openSettings = document.createElement('button')
    openSettings.id = 'openSettings'
    openSettings.className = 'aBtn'
    openSettings.innerHTML = '<img src="img/ui/settings.svg">'
    btnsRow1.appendChild(openSettings)
    openSettings.addEventListener('click', () => {
        window.fakeSettings.renderSection('reader')
        changePage('fakeSettings', 'reader')
    })

    document.querySelector('#reader .pageContainer .page-header-btns').appendChild(qs)
})
class fakeSettings {
    constructor() {
        console.log('fakeSettings loaded')

        this.sections = [
            'reader', 'newspapers', 'global',
        ]
        this.container = document.querySelector('#fakeSettings .pageContent')

        this.init()
        this.createSections()
        this.renderSection('reader')
    }

    init() {
        this.sections.forEach(section => {
            const sectionPage = document.createElement('div')
            sectionPage.className = 'setsec ' + section

            this.container.appendChild(sectionPage)
        })
    }

    createSections() {
        // READER
        let ct = document.querySelector('#fakeSettings .setsec.reader')
        const TC = document.getElementById('mainReaderMd').style

        // 1. Выравнивание текста
        const fullingTextS = new window.settingCard('fullingTextS', 'switch', 'Justified text', 'make text from border to border', {default: true})
        ct.appendChild(fullingTextS.returnEl())
        fullingTextS.returnEl().querySelector('input').addEventListener('change', async () => {
            const allP = document.querySelectorAll('#mainReaderMd p')
            allP.forEach(el => {
                el.style.textAlign = fullingTextS.value === true ? 'justify' : ''
            })
        })

        // 2. Отступ первой строки
        const indentS = new window.settingCard('indentS', 'switch', 'First-line indent', 'make some indent in first lines of text', {default: false})
        ct.appendChild(indentS.returnEl())
        indentS.returnEl().querySelector('input').addEventListener('change', async () => {
            const allP = document.querySelectorAll('#mainReaderMd p')
            allP.forEach(el => {
                el.style.textIndent = indentS.value === true ? '3rem' : ''
            })
        })

        // 3. Размер шрифта
        const fontSizeS = new window.settingCard('fontSizeS', 'slider', 'Font size', '', {default: 1, min: 0.5, max: 5, step: 0.1})
        ct.appendChild(fontSizeS.returnEl())
        fontSizeS.returnEl().querySelector('input').addEventListener('input', async () => {
            TC.fontSize = `${fontSizeS.value}rem`
        })

        // 4. Высота строки
        const lineHeightS = new window.settingCard('lineHeightS', 'slider', 'Line height', '', {default: 1, min: 0.75, max: 5, step: 0.25})
        ct.appendChild(lineHeightS.returnEl())
        lineHeightS.returnEl().querySelector('input').addEventListener('input', async () => {
            TC.lineHeight = lineHeightS.value
        })

        // 5. Выбор шрифта
        const fontS = new window.settingCard('fontCardS', '', 'Font', '', {default: 1, modal: true})
        ct.appendChild(fontS.returnEl())
        let chosenFont = 'one-sans'
        fontS.returnEl().addEventListener('click', async () => {
            const optionsList = [
                {label: 'One Sans',        value: 'one-sans'},
                {label: 'system',          value: 'system-ui'},
                {label: 'Roboto',          value: 'Roboto'},
                {label: 'Roboto Serif',    value: 'Roboto Serif'},
                {label: 'sans-serif',      value: 'sans-serif'},
                {label: 'serif',           value: 'serif'},
                {label: 'Cormorant',       value: 'Cormorant'},
                {label: 'Jim Nightshade',  value: 'Jim Nightshade'},
                {label: 'Special Elite',   value: 'Special Elite'},
                {label: 'Italianno',       value: 'Italianno'},
                {label: 'Grenze',          value: 'Grenze'},
            ]
            const answ = await window.modalMgr.createModalInput(
                'fontChose', 'Font', 'radio', '', 
                { 
                    radioOptions: optionsList,
                    value: chosenFont,
                }
            )
            if (answ && answ.value) {
                TC.fontFamily = answ.value
                chosenFont = answ.value
            }
        })
    }

    renderSection(section) {
        document.querySelectorAll('#fakeSettings .setsec').forEach(sec => {
            sec.classList.remove('active')
        })

        const task = document.querySelector('#fakeSettings .setsec.' + section)
        if (task) task.classList.add('active')
            else console.warn(task)
    }
}

window.fakeSettings = new fakeSettings
class settingCard {
    constructor(id, type, title, description, settings) {
        this.id = id
        this.type = type
        this.params = settings
        this.fixType()
        this.value = this.params?.default ?? (this.type === 'range' ? (this.params?.min ?? 0) : false)

        this.el = document.createElement('div')
        this.el.className = 'card settingCard'
        this.el.id = id

        this.texts = document.createElement('div')
        this.texts.className = 'cardTextArea'
        this.el.appendChild(this.texts)
        if (title) {
            this.title = document.createElement('h3')
            this.title.className = 'setitngCardTitle'
            this.title.textContent = title
            this.texts.appendChild(this.title)
        }

        if (description) {
            this.description = document.createElement('h4')
            this.description.className = 'setitngCardDescription'
            this.description.textContent = description
            this.texts.appendChild(this.description)
        }

        if (this.params?.noShowValue !== true) {
            this.valueShow = document.createElement('h4')
            this.valueShow.className = 'setitngCardDescription valueShow'
            this.valueShow.textContent = this.value
            this.texts.appendChild(this.valueShow)
        }

        this.buttons = document.createElement('div')
        this.el.appendChild(this.buttons)

        this.createInput()
    }

    update() {}

    fixType() {
        switch (this.type) {
            case "slider":
                this.type = 'range'
                break
            default:
                
        }
    }

    createInput() {
        const columnInputTypes = ['range']
        const fullPoinersTypes = ['switch']

        if (columnInputTypes.includes(this.type) || this.params?.showModal === true) this.el.classList.add('column')
        else this.el.classList.add('row')
        
        if (fullPoinersTypes.includes(this.type) || this.params?.splited !== true) this.el.classList.add('fullMouse')
        
        switch (this.type) {
            case "range": 
                this.input = document.createElement('input')
                this.input.type = 'range'
                
                // Установка атрибутов (исправлено!)
                if (this.params?.min !== undefined) this.input.min = this.params.min
                if (this.params?.max !== undefined) this.input.max = this.params.max
                if (this.params?.step !== undefined) this.input.step = this.params.step
                
                // Устанавливаем дефолтное значение для инпута
                if (this.params?.default !== undefined) {
                    this.input.value = this.params.default
                } else if (this.params?.min !== undefined) {
                    this.input.value = this.params.min
                }
                
                this.value = this.input.value
                if (this.valueShow) this.valueShow.textContent = this.value

                this.input.addEventListener('input', e => {
                    this.value = e.target.value
                    if (this.valueShow) {
                        this.valueShow.textContent = this.value
                    }
                })

                this.buttons.appendChild(this.input)
                break

            case "switch":
                this.div = document.createElement('label')
                this.div.className = 'switcht'
                this.div.innerHTML = `
                    <input type="checkbox" ${this.value ? "checked" : ""}>
                    <span class="slider"></span>
                `
                const input = this.div.querySelector("input")

                const updateSwitchState = (isChecked) => {
                    this.value = isChecked
                    if (this.valueShow) {
                        this.valueShow.textContent = isChecked ? 'On' : 'Off' // Или оставляйте true/false
                        this.valueShow.style.color = isChecked ? 'var(--ac-text)' : ''
                    }
                }

                updateSwitchState(input.checked);

                input.addEventListener("change", e => {
                    updateSwitchState(e.target.checked)
                })
                
                this.buttons.appendChild(this.div)

                this.el.addEventListener('click', (e) => {
                    if (e.target === input) return
                    input.checked = !input.checked
                    updateSwitchState(input.checked)
                    input.dispatchEvent(new Event('change'))
                })

                break
            default:
                console.log('Unknown type')
        }
    }

    setValue(value) {
        this.value = value
        if (this.input) {
            this.input.value = value
            if (this.valueShow) this.valueShow.textContent = value
        }
    }

    returnEl() {
        return this.el
    }
}

class settingsCardsMgr {
    constructor() {

    }

    createCard(id, type, title, description) {

    }
}

window.settingCard = settingCard
window.settingsCardsMgr = new settingsCardsMgr

if (document.location.href === 'http://127.0.0.1:5501/blank.html') {
    document.querySelector('#demo .pageContent').prepend((new settingCard('teste', 'slider', 'Hello', 'world', {min: 5, max: 10})).returnEl())
    document.querySelector('#demo .pageContent').prepend((new settingCard('teste2', 'switch', 'World', 'hello', {default: true})).returnEl())
}

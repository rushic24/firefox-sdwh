/*
IDEAS:
- [ x ] restore selections after page refresh
- [ x ] Remove selections on refresh
- [ ] Notify, selection is available
- [ ] Cloud sync
- [ ] Fix allowing multiple highlights on same thing
- [ ] Fix issue where things not always highlighted
*/

import rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-selectionsaverestore'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-textrange'
import 'rangy/lib/rangy-serializer'

var gettingStoredStats = browser.storage.local.get()

const buildKey = (text) => {
    const key = window.location.toString() + text
    return key
}

const copyAll = () => {
    const spans = document.querySelectorAll('.matt-highlight')
    var s = window.location.toString()
    for (var i = 0; i < spans.length; i++) {
        s += '\n\n'
        s += '------------------------------------------------------------'
        s += '\n'
        s += spans[i].textContent.trim()
    }
    navigator.clipboard.writeText(s)
    alert('Copied highlights')
}

const highlightSelection2 = () => {
    const tabUrl = window.location.href
    browser.storage.local.get(`${tabUrl}`).then((resp) => {
        console.log('preparing to restor stuff', resp)
        if (resp.hasOwnProperty(tabUrl)) {
            console.log('0th item is', resp)
            resp[tabUrl].forEach((element) => {
                console.log('element found :- ', element)
                try {
                    const sel = rangy.deserializeSelection(element)
                    const range = sel.getRangeAt(0)
                    const wrapper = document.createElement('span')
                    wrapper.style.backgroundColor = '#EEEE00'
                    wrapper.style.color = '#111111'
                    wrapper.classList.add('matt-highlight')
                    wrapper.style.fontSize = '1.2em'
                    range.surroundContents(wrapper)
                } catch (error) {
                    console.log(error)
                }
            })
            // use(JSON.parse(resp[tabUrl][0]))
        }
    })
}

const highlightSelection = () => {
    const tabUrl = window.location.href
    console.log('entered selection now serializing')
    console.log('tabingo')

    const sel = rangy.getSelection()
    const msd = rangy.serializeSelection(sel, true)
    console.log('selection is', msd)
    const range = sel.getRangeAt(0)

    const wrapper = document.createElement('span')
    wrapper.style.backgroundColor = '#EEEE00'
    wrapper.style.color = '#111111'
    wrapper.classList.add('matt-highlight')
    wrapper.style.fontSize = '1.2em'
    range.surroundContents(wrapper)

    // saveOptions()
    browser.storage.local.get(`${tabUrl}`).then((resp) => {
        console.log('hair before setitng', resp)
        if (resp.hasOwnProperty(tabUrl)) {
            browser.storage.local.set({
                // [tabUrl]: [...resp[tabUrl], JSON.stringify(rInfo)],
                [tabUrl]: [...resp[tabUrl], msd],
            })
        } else {
            browser.storage.local.set({
                [tabUrl]: new Array(msd),
            })
        }
        console.log('hair after setitng', resp)
    })

    console.log('entered hancdle')
    console.log('state is', 'referenceEl')
}

const handle = (obj) => {
    if (obj.message == 'highlight') {
        highlightSelection()
    } else if (obj.message == 'copy') {
        copyAll()
    }
    else if (obj.message == 'restoreall'){
        highlightSelection2()
    }
}

browser.runtime.onMessage.addListener(handle)

// document.addEventListener('DOMContentLoaded', restoreOptions)

document.addEventListener(
    'keydown',
    (event) => {
        if (event.ctrlKey && event.key == 'L') {
            highlightSelection()
        }
        if (event.ctrlKey && event.key == 'm') {
            console.log('m pressedd')
            highlightSelection2()
        }
        if (event.ctrlKey && event.key == ':') {
            copyAll()
        }
    },
    false
)

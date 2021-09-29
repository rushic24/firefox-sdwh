// const leftPad = require('left-pad')

// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     const result = leftPad(message.text, message.amount, message.with)
//     sendResponse(result)
// })

const onCreated = () => null

browser.contextMenus.create(
    {
        id: 'highlight-selection',
        title: 'sdwh: highlight selection',
        contexts: ['page'],
    },
    onCreated
)

// browser.contextMenus.create(
//     {
//         id: 'copy-selections',
//         title: 'sdwh: copy all selections',
//         contexts: ['page'],
//     },
//     onCreated
// )

browser.contextMenus.create(
    {
        id: 'restore-selections',
        title: 'sdwh: restore all selections',
        contexts: ['page'],
    },
    onCreated
)

browser.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case 'highlight-selection':
            browser.tabs.sendMessage(tab.id, {
                message: 'highlight',
                tabUrl: tab.url,
            })
            break
        // case 'copy-selections':
        //     browser.tabs.sendMessage(tab.id, {
        //         message: 'copy',
        //         tabUrl: tab.url,
        //     })
        //     break
        case 'restore-selections':
            browser.tabs.sendMessage(tab.id, {
                message: 'restoreall',
                tabUrl: tab.url,
            })
            break
    }
})

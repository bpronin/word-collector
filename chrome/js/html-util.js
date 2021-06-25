function element(componentId) {
    return document.getElementById(componentId)
}

function createElement(parent, tagName) {
    const element = document.createElement(tagName)
    parent.appendChild(element)
    return element
}

function setVisible(component, visible) {
    component.style.display = visible ? 'block' : 'none'
}
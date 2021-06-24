function $(componentId) {
    return document.getElementById(componentId)
}

function setVisible(component, visible) {
    component.style.display = visible ? 'block' : 'none'
}
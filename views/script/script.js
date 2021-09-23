alturaCard()
window.onresize = function() {
    alturaCard()
}

function alturaCard(){
    document.getElementById('profile-display').style.height = document.getElementById('profile-config').offsetHeight.toString() + "px"
}
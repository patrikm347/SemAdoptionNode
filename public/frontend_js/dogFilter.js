(function() {
    const ageLabel = document.getElementById('ageLabel');
    const ageSlider = document.getElementById('ageFilter');
    ageSlider.addEventListener('input', e => {
        ageLabel.innerHTML = `Age: ${e.target.value} or less`;
        ageLabel.style.paddingRight = e.target.value < 10 ? '.65rem' : '0';
    });
})();
(function() {
    const filterBar = document.getElementById('filterBar');
    const ageLabel = document.getElementById('ageLabel');
    const ageSlider = document.getElementById('ageFilter');
    const toggleFilterButton = document.getElementById('toggleFilter');

    ageSlider.addEventListener('input', e => {
        ageLabel.innerHTML = `Age: ${e.target.value} or less`;
        ageLabel.style.paddingRight = e.target.value < 10 ? '.65rem' : '0';
    });

    toggleFilterButton.addEventListener('click', e => {
        if (filterBar.style.display === 'block') {
            filterBar.style.display = 'none';
        } else {
            filterBar.style.display = 'block';
        }
        
        toggleFilterButton.firstChild.classList.toggle('fa-chevron-down');
        toggleFilterButton.firstChild.classList.toggle('fa-chevron-up');
    });
})();
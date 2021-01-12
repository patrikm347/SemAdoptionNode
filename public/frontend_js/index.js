(function () {
    const dogDataDivs = document.querySelectorAll('.dog-data');
    const dogLinks = document.querySelectorAll('.dog-link');
    dogDataDivs.forEach((div, i) => {
        div.addEventListener('click', _ => {
            location.href = dogLinks[i].href;
        });
    });
})();
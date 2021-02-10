window.addEventListener('load', function () {
    let navBlock = document.querySelector('.nav')
    let navItem = document.querySelectorAll('.nav__item')
    let navMobileTrigger = document.querySelector('.nav-mobile')
    let navOverlay = document.querySelector('.nav-overlay')

    navMobileTrigger.addEventListener('click', function () {
        navBlock.classList.add('show')
        navOverlay.classList.add('show')
        document.body.classList.add('nav-open')
    })

    navOverlay.addEventListener('click', function () {
        navBlock.classList.remove('show')
        navOverlay.classList.remove('show')
        document.body.classList.remove('nav-open')
    })

    if (window.innerWidth < 992) {
        navItem.forEach(function(item, i, navItem) {
            let navItemShow = navBlock.getElementsByClassName('active')
            item.addEventListener('click', function(e) {
                if (navItemShow.length > 0 && navItemShow[0] !== this) {
                    navItemShow[0].classList.remove('active')
                }
                this.classList.toggle('active')
                if (item.classList.contains('has-child')) {
                    e.preventDefault()
                }
            })
        })
    }
})

//=================================================================================
//скрипт для  анимации страницы свойства анимации в файлике scss с сайта https://animista.net
const AnimetedElements = document.querySelectorAll('.__anime-elem');// ищим у всех элементов класс (_anime-elem)
// проверяем все элементы на существование класса
if (AnimetedElements.length > 0) {
    window.addEventListener('scroll', animetedScroll);
    function animetedScroll() {
        for (let i = 0; i < AnimetedElements.length; i++) {
            const AnimetedElement = AnimetedElements[i];
            const AnimetedElementHeight = AnimetedElement.offsetHeight; //получаю высоту обьекта
            const AnimetedElementOffset = offset(AnimetedElement).top; //получаю позицию обьекта относительно верха
            const AnimetedStart = 4; // момент старта анимации

            let AnimetedElementPoint = window.innerHeight - AnimetedElementHeight / AnimetedStart; //высчитываем высоту браузер

            if (AnimetedElementHeight > window.innerHeight) {
                AnimetedElementPoint = window.innerHeight - window.innerHeight / AnimetedStart;
            }

            if ((pageYOffset > AnimetedElementOffset - AnimetedElementPoint) && pageYOffset < (AnimetedElementOffset + AnimetedElementHeight)) {
                AnimetedElement.classList.add('_active');
            } else {
                AnimetedElement.classList.remove('_active');
            }
        }
    }
    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }
    setTimeout(() => {
        animetedScroll();
    }, 300);
}
//=================================================================================

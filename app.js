document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    function enableDarkMode() {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.checked = true;
    }

    function disableDarkMode() {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        darkModeToggle.checked = false;
    }

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

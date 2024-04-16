
let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        // Scroll down
        document.getElementById("nav").style.top = "-110px"; // Adjust according to navbar height
    } else {
        // Scroll up
        document.getElementById("nav").style.top = "0";
    }
    lastScrollTop = currentScroll;
});

document.querySelectorAll('input[type="radio"][name="formSelection"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        var selectedFormId = this.value;
        document.querySelectorAll('.form-control').forEach(function(form) {
            if (form.id === selectedFormId) {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });
    });
});
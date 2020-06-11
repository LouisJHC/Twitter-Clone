const form = document.querySelector('.form-data');
const loadingSpinner = document.querySelector('.loading-spinner');

loadingSpinner.style.display = 'none';
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const title = formData.get('title');
    const content = formData.get('content');

    loadingSpinner.style.display = '';
    form.style.display = 'none';

    fetch('http://localhost:8080/tweet', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify( { title, content })
    })

})
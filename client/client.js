const form = document.querySelector('.form-data');
const loadingSpinner = document.querySelector('.loading-spinner');
const tweetList = document.querySelector('.tweet-list');
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
    }).then(json => {
            loadingSpinner.style.display = 'none';
            form.style.display = '';
            form.reset();

            showTweets();
        }
    ).catch(err => {
        console.log(err);
    }); 
})

function showTweets() {
    fetch('http://localhost:8080/tweet', {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    }).then(res => res.json()).then(tweets => {
        tweetList.innerHTML = ''; // clear out list of tweets everytime, so I don't keep append the same data over and over again.
        tweets.reverse(); // show the latest tweet first.
        tweets.forEach(tweet => {
        const div = document.createElement('div');
        const title = document.createElement('h1');
        const content = document.createElement('p');
        const date = document.createElement('p');

        title.textContent = tweet.title;
        content.textContent = tweet.content;
        date.textContent = tweet.createdAt;

        div.appendChild(title);
        div.appendChild(content);
        div.appendChild(date);
        
        tweetList.appendChild(div);
        })
    }).catch(err => console.log(err));
}
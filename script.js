document.addEventListener('DOMContentLoaded', () => {
    loadStoredURLs();


    // MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.toggle');
    const mobileNav = document.querySelector('.mobile-nav')

    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden')
    });

    // URL SHORTENING
    const urlInput = document.querySelector('#urlInput');
    const submitBtn = document.querySelector('#submitBtn');
    const linkContainer = document.querySelector('#links')
    const error = document.querySelector('.error')
    const inputContainer = document.querySelector('.input-container')


    urlInput.addEventListener('focus', () => {
        error.classList.add('hidden')
        urlInput.style.border = 'none'
        urlInput.classList.remove('error-placeholder');
        inputContainer.style.gap = '1.5rem'

    })

    function errorAlert() {
        error.classList.remove('hidden')
        urlInput.style.border = '2px solid var(--Red)'
        urlInput.classList.add('error-placeholder');

        const screenWidth = window.innerWidth;

        if (screenWidth < 700) {
            inputContainer.style.gap = '2.5rem'
        }

    }

    async function shortenURL() {
        const inputURL = urlInput.value.trim();
        if (inputURL === '') {
            errorAlert();
        }

        try {
            const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(inputURL)}`);
            const jsonData = await response.json();

            if (jsonData.ok) {
                const { short_link, full_short_link } = jsonData.result;
                const link = document.createElement('div')
                link.classList.add('link')
                link.innerHTML = `
                <div class="original-url">
                <svg class="delete hidden" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"></path></svg>
                  <p>${inputURL}</p>
                </div>
                <div class="link-btn-container">
                  <a  href="${full_short_link}" target="_blank">${short_link}</a>
                  <button class="copy-btn primary-btn">Copy</button>
                </div>
              `;

                //attach the link to the copy button
                const copyButton = link.querySelector('.copy-btn');
                const deleteBtn = link.querySelector('.delete')
                copyButton.addEventListener('click', () => {

                    navigator.clipboard.writeText(short_link)
                        .then(() => {
                            copyButton.textContent = 'Copied!';
                            copyButton.style.backgroundColor = 'var(--Dark-Violet)';
                            deleteBtn.classList.remove('hidden')
                        })
                        .catch((error) => {
                            console.error('Error copying text:', error);
                            alert("Failed to copy the text.");
                        });
                });


                linkContainer.insertBefore(link, linkContainer.firstChild);
                storeShortenedURL(short_link, inputURL)
                urlInput.value = ''

                //make a delete button
                deleteBtn.addEventListener('click', () => {
                    link.remove()
                    removeShortenedURL(short_link);
                })

            } else {
                errorAlert();
            }
        } catch (error) {
            console.error('Error fetching API:', error);
            errorAlert()
            error.textContent = 'An error occurred while fetching the API. Please try again later.'
        }
    }

    submitBtn.addEventListener('click', shortenURL);

    urlInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            shortenURL()
        }
    })

    // LOCAL STORAGE
    function storeShortenedURL(short_link, inputURL) {
        // Create an array to hold URLs
        const storedURLs = JSON.parse(localStorage.getItem('shortenedURLs')) || [];

        storedURLs.push({ short_link, inputURL });
        localStorage.setItem('shortenedURLs', JSON.stringify(storedURLs));
    }

    // load the stored items
    function loadStoredURLs() {
        const storedURLs = JSON.parse(localStorage.getItem('shortenedURLs')) || [];

        storedURLs.forEach(({ short_link, inputURL }) => {
            const link = document.createElement('div');
            link.classList.add('link');
            link.innerHTML = `
                <div class="original-url">
                <svg class="delete hidden" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"></path></svg>
                  <p>${inputURL}</p>
                </div>
                <div class="link-btn-container">
                  <a  href="${short_link}" target="_blank">${short_link}</a>
                  <button class="copy-btn primary-btn">Copy</button>
                </div>
              `;

            //attach the short link to the copy button
            const copyButton = link.querySelector('.copy-btn');
            const deleteBtn = link.querySelector('.delete')
            copyButton.addEventListener('click', () => {

                navigator.clipboard.writeText(short_link)
                    .then(() => {
                        copyButton.textContent = 'Copied!';
                        copyButton.style.backgroundColor = 'var(--Dark-Violet)';
                        deleteBtn.classList.remove('hidden')
                    })
                    .catch((error) => {
                        console.error('Error copying text:', error);
                        alert("Failed to copy the text.");
                    });
            });

            const linkContainer = document.querySelector('#links')
            linkContainer.appendChild(link);

            deleteBtn.addEventListener('click', () => {
                link.remove()
                removeShortenedURL(short_link);

            })
        });
    }

    // make the delete button update the local storage
    function removeShortenedURL(short_link) {
        const storedURLs = JSON.parse(localStorage.getItem('shortenedURLs')) || [];

        const indexToRemove = storedURLs.findIndex(item => item.short_link === short_link);

        if (indexToRemove !== -1) {
            storedURLs.splice(indexToRemove, 1);
            localStorage.setItem('shortenedURLs', JSON.stringify(storedURLs));
        }
    }


});
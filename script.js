document.addEventListener('DOMContentLoaded', () => {


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

    urlInput.addEventListener('focus', () => {
        error.classList.add('hidden')
        urlInput.style.border = 'none'
    })

    function errorAlert() {
        error.classList.remove('hidden')
        urlInput.style.border = '2px solid var(--Red)'
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
                  <p>${inputURL}</p>
                </div>
                <div class="link-btn-container">
                  <a  href="${full_short_link}" target="_blank">${short_link}</a>
                  <button class="copy-btn primary-btn">Copy</button>
                </div>
              `;

                //attach the short link to the copy button
                const copyButton = link.querySelector('.copy-btn');
                copyButton.addEventListener('click', () => {

                    navigator.clipboard.writeText(short_link)
                        .then(() => {
                            copyButton.textContent = 'Copied!';
                            copyButton.style.backgroundColor = 'var(--Dark-Violet)';
                        })
                        .catch((error) => {
                            console.error('Error copying text:', error);
                            alert("Failed to copy the text.");
                        });
                });

                linkContainer.appendChild(link)
                urlInput.value = ''

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



});
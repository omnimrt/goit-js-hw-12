// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

// Описаний у документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const fetchPicturesForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const userInput = document.querySelector('input');
const containerDiv = document.querySelector('.container');

// Function to show the loader
const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  containerDiv.append(loader);
};

// Function to hide the loader
const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

fetchPicturesForm.addEventListener('submit', event => {
  showLoader();
  event.preventDefault(); // Prevent the default form submission behavior
  gallery.innerHTML = '';
  const apiKey = '41249104-77dc8b1e0563744cb8297ef15';
  const query = userInput.value;

  fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          title: '',
          backgroundColor: '#EF4040',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        const markup = data.hits
          .map(data => {
            return `<li class="gallery-item"><a href="${data.webformatURL}">
          <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}"></a>
          <p><b>Likes: </b>${data.likes}</p>
          <p><b>Views: </b>${data.views}</p>
          <p><b>Comments: </b>${data.comments}</p>
          <p><b>Downloads: </b>${data.downloads}</p>
          </li>`;
          })
          .join('');
        gallery.insertAdjacentHTML('afterbegin', markup);
        const lightbox = new SimpleLightbox('.gallery a', options);
        lightbox.on('show.simplelightbox');
        lightbox.refresh();
        fetchPicturesForm.reset();
      }
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader();
    });
});

const options = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};

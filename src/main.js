// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';

// Описаний у документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const fetchPicturesForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const userInput = document.querySelector('input');
const containerDiv = document.querySelector('.container');
const loadMoreBtn = document.querySelector('.btn-load');
const galleryItem = document.querySelector('.gallery-item');

function getGalleryItemHeight() {
  const rect = galleryItem.getBoundingClientRect();
  return rect.height;
}

let page = 1;
let per_page = 40;

// Відображаємо loader
const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  containerDiv.append(loader);
};

// Ховаємо loader
const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

// Додано функцію для відображення кнопки "Load more"
const showLoadMoreButton = () => {
  loadMoreBtn.style.display = 'block';
};

// Додано функцію для приховання кнопки "Load more"
const hideLoadMoreButton = () => {
  loadMoreBtn.style.display = 'none';
};

async function fetchPhotos() {
  const params = new URLSearchParams({
    page: page,
    per_page: per_page,
  });
  const apiKey = '41249104-77dc8b1e0563744cb8297ef15';
  const query = userInput.value;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
  );
  return response.data;
}

function renderPhotos(data) {
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
  gallery.insertAdjacentHTML('afterend', markup);
  const lightbox = new SimpleLightbox('.gallery a', options);
  lightbox.on('show.simplelightbox');
  lightbox.refresh();
}

fetchPicturesForm.addEventListener('submit', async e => {
  showLoader();
  e.preventDefault();
  gallery.innerHTML = '';

  try {
    const photos = await fetchPhotos();
    renderPhotos(photos);
    fetchPicturesForm.reset();
    hideLoader();
    showLoadMoreButton();
    page += 1;

    if (photos.hits.length === 0) {
      iziToast.error({
        title: '',
        backgroundColor: '#EF4040',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      hideLoadMoreButton();
      // Прокрутка сторінки на дві висоти карточки галереї
      const galleryItemHeight = getGalleryItemHeight();
      window.scrollBy(0, galleryItemHeight * 2);
    }
  } catch (error) {
    console.log(error);
    hideLoadMoreButton();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();
  try {
    const photos = await fetchPhotos();
    renderPhotos(photos);
    hideLoader();
    page += 1;

    // Прокрутка сторінки на дві висоти карточки галереї
    const galleryItemHeight = getGalleryItemHeight();
    window.scrollBy(0, galleryItemHeight * 2);

    if (gallery.children.length > photos.totalHits) {
      iziToast.warning({
        title: '',
        message:
          'We are sorry, but you have reached the end of search results.',
      });
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    hideLoader();
    hideLoadMoreButton();
  }
});

const options = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};

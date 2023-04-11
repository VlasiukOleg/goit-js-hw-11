import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPosts } from './fetchposts';
import { smoothScroll } from './smoothscroll';
import { createMarkup } from './createmarkup';

let page = 1;
const per_page = 40;

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const backToTopBtn = document.querySelector('.back-to-top');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

formEl.addEventListener('submit', onSearchPhoto);
loadMoreBtn.addEventListener('click', onLoadMorePosts);
backToTopBtn.addEventListener('click', backToTop);

async function onSearchPhoto(evt) {
  evt.preventDefault();
  const isActive = true;
  if (isActive === true || loadMoreBtn.classList.has('is-active')) {
    galleryEl.innerHTML = '';
    page = 1;
    loadMoreBtn.classList.replace('is-active', 'is-hidden');
  }
  const query = evt.target.elements.searchQuery.value.trim();
  try {
    if (query === '') {
      Notify.warning('Please fill all fields');
      return;
    }
    const photos = await getPosts(query, page, per_page);
    if (photos.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    createMarkup(photos.hits);
    lightbox.refresh();

    loadMoreBtn.classList.replace('is-hidden', 'is-active');

    Notify.success(`Hooray! We found ${photos.totalHits} images.`);
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMorePosts() {
  const query = formEl.elements.searchQuery.value.trim();
  try {
    page += 1;
    const photos = await getPosts(query, page, per_page);
    const totalPage = Math.round(photos.totalHits / per_page);
    if (page > totalPage) {
      Notify.warning(
        'We are sorry,but you have reached the end of search results.'
      );
      loadMoreBtn.classList.replace('is-active', 'is-hidden');
      return;
    }
    createMarkup(photos.hits);
    smoothScroll();
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

window.onscroll = function scrollFunction() {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
};

function backToTop() {
  const currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(backToTop);
    window.scrollTo(0, currentScroll - currentScroll / 10);
  }
}

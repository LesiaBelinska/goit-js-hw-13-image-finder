import ImageApiService from './apiService';
import photoCard from '../templates/galleryItems.hbs';
import animateScrollTo from 'animated-scroll-to';
import { onOpenModal } from './modal';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';


const formSearch = document.querySelector('#search-form');
const articlesContainer = document.querySelector('.gallery-js');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');


formSearch.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
articlesContainer.addEventListener('click', onOpenModal);

const imageApiService = new ImageApiService();

async function onSearch(event) {
  event.preventDefault();

  try {
    const inputSearchValue = event.currentTarget.elements.query.value;
    imageApiService.query = inputSearchValue;

    loadMoreBtn.classList.add('is-hidden');

    imageApiService.resetPage();
    clearArticlesContainer();
    const response = await imageApiService.fetchImages();

    if (response.length === 0) {
       noResult();
    }
    else if (response.length > 0) {
      appendArticlesMarkup(response);
      loadMoreBtn.classList.remove('is-hidden');
    }
    if (response.length < 12) {
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log('Error');
  }
}

async function onLoadMore() {
  try {
    const response = await imageApiService.fetchImages();
    console.log(response);

    appendArticlesMarkup(response);
    scrollToElement();
  } catch (error) {
    console.log('Error');
  }
}

function appendArticlesMarkup(articles) {
  articlesContainer.insertAdjacentHTML('beforeend', photoCard(articles));
}

function clearArticlesContainer() {
  articlesContainer.innerHTML = '';
}

function scrollToElement() {
  const indexToScroll = 12 * (imageApiService.page - 1) - 11;
  const itemToScroll = articlesContainer.children[indexToScroll];
  const options = {
    speed: 500,
    verticalOffset: -10,
  };

  animateScrollTo(itemToScroll, options);
}

function noResult() {
  error({
    text: 'No matches found!',
    delay: 1500,
    closerHover: true,
  });
}
import Notiflix from 'notiflix';
import axios from 'axios';



let DATA = '';
let PAGE = 1;
const refs = {
 formRef: document.querySelector('#search-form'),
galleryRef: document.querySelector('.gallery'),
loadMoreRef: document.querySelector('.load-more'),}

refs.formRef.addEventListener('submit', onSearch);
refs.loadMoreRef.addEventListener('click', onLoadMore);
function onSearch(evt) {
    evt.preventDefault();
    const searchQuery = evt.currentTarget.elements.searchQuery.value;
    DATA = searchQuery;
    PAGE = 1;
    onAxiosGetValue();
   onClearMarkup();
    
    
   
   
}
function onLoadMore() {
  onAxiosGetValue();
}


async function onAxiosGetValue() {
    const options = {
      API_KEY: 'key=31354257-dee15866aed277984dcd7ccaa',
      per_page: 40,
      orientation: 'orientation=horizontal',
      image_type: 'image_type=photo',
      safesearch: 'safesearch=true',
    };
  
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?${options.API_KEY}&q=${DATA}&${options.orientation}&${options.image_type}&${options.safesearch}&page=${PAGE}&per_page=${options.per_page}`
      );
  
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
       refs.loadMoreRef.classList.remove('visible');
      } 
      if (response.data.hits.length !== 0) {
        Notiflix.Notify.info(
          `Hooray! We found ${response.data.totalHits} images.`
        );
        onRenderGallery(response.data.hits)
        PAGE += 1;
        refs.loadMoreRef.classList.add('visible');
      
      }
      if (response.data.hits.length < options.per_page) {
        Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          refs.loadMoreRef.classList.remove('visible');
      }
      
    } catch (error) {
      if (error.response.status === 400) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreRef.classList.remove('visible');
      }
    }
  }



            function onRenderGallery(searchResult) {
                const markupGallery = searchResult
                  .map(search => { return `<div class="photo-card">
                      <a href="${search.largeImageURL}"><img class='photo-card__img' src="${search.webformatURL}" alt="${search.tags}" loading="lazy"/></a>
                      <div class="info">
                          <p class="info-item">
                            <b>Likes:</b><br>${search.likes}
                          </p>
                          <p class="info-item">
                            <b>Views:</b><br>${search.views}
                          </p>
                          <p class="info-item">
                            <b>Comments:</b><br>${search.comments}
                          </p>
                          <p class="info-item">
                            <b>Downloads:</b><br>${search.downloads}
                          </p>
                      </div>
                </div>`;
                  })
                  .join('');
                  refs.galleryRef.insertAdjacentHTML('beforeend', markupGallery);
                }
                function onClearMarkup() {
                  refs.galleryRef.innerHTML = '';
                 
              }
                  
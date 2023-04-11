const galleryEl = document.querySelector('.gallery');

export const createMarkup = function onRenderImageMarkUp(photos) {
  const imageMarkup = photos
    .map(photo => {
      return `
    <div class="gallery__item">
      <div class='gallery__thumb'>
            <a href="${photo.largeImageURL}" class="gallery__link">
                <img
                src="${photo.webformatURL}"
                alt="${photo.tags}"
                loading="lazy"
                class="gallery__image"
                />
            </a>
      </div>
    
        <div class="info">
            <p class="info__item likes">
            <span class="info__label ">Likes</span><span>${photo.likes}</span>
            </p>
            <p class="info__item views">
            <span class="info__label">Views</span><span>${photo.views}</span>
            </p>
            <p class="info__item comments">
            <span class="info__label">Comments</span><span>${photo.comments}</span>
            </p>
            <p class="info__item downloads">
            <span class="info__label">Downloads</span><span>${photo.downloads}</span>
            </p>
        </div>
    </div>
  `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', imageMarkup);
};

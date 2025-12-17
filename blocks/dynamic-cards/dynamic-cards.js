import {
  createOptimizedPicture,
} from '../../scripts/aem.js';

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function sortData(data, orderBy, sort) {
  if (orderBy === 'title') {
    data.sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      if (titleA < titleB) {
        return sort === 'asc' ? -1 : 1;
      }
      if (titleA > titleB) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    });
  } else {
    data.sort((a, b) => {
      const dateA = new Date(a.lastModified);
      const dateB = new Date(b.lastModified);
      if (dateA < dateB) {
        return sort === 'asc' ? -1 : 1;
      }
      if (dateA > dateB) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return data;
}

export default function decorate(block) {
  console.log('dynamic-cards', block);
  const source = block.querySelector('a[href]') ? block.querySelector('a[href]').href : '/query-index.json';
  const maxItems = block.querySelector('div:nth-child(2)').querySelector('div')?.textContent;
  const orderBy = block.querySelector('div:nth-child(3)').querySelector('div')?.textContent;
  const sort = block.querySelector('div:nth-child(4)').querySelector('div')?.textContent;

  console.log('props', [maxItems, orderBy, sort]);

  block.innerHTML = '';
  const ul = document.createElement('ul');

  fetchData(source).then((data) => {
    console.log('data', data);

    sortData(data.data, orderBy, sort).slice(0,maxItems).forEach((item) => {
      const li = document.createElement('li');
      const imageDiv = document.createElement('div');
      imageDiv.setAttribute('class', 'cards-card-image');

      const pic = createOptimizedPicture(item.image, '', false, [{ width: '375' }]);
      imageDiv.appendChild(pic);

      const bodyDiv = document.createElement('div');
      bodyDiv.setAttribute('class', 'cards-card-body');

      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = item.title;
      p.appendChild(strong);

      const p2 = document.createElement('p');
      p2.textContent = item.description;

      bodyDiv.appendChild(p);
      bodyDiv.appendChild(p2);

      li.appendChild(imageDiv);
      li.appendChild(bodyDiv);
      ul.appendChild(li);
    });

    block.appendChild(ul);
  });
}

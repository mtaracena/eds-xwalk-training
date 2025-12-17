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

export default function decorate(block) {
  console.log('dynamic-cards', block);
  const source = block.querySelector('a[href]') ? block.querySelector('a[href]').href : '/query-index.json';
  block.innerHTML = '';
  const ul = document.createElement('ul');

  fetchData(source).then((data) => {
    console.log('data', data);

    data.data.forEach((item) => {
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

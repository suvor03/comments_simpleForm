const form = document.querySelector('.comments__form');
const nameInput = document.querySelector('#name');
const textInput = document.querySelector('#text');
const dateInput = document.querySelector('#date');
const commentsList = document.querySelector('.comments__list');

// Получаем комментарии из локального хранилища
let comments = JSON.parse(localStorage.getItem('comments')) || [];

// Функция для сохранения комментариев в локальное хранилище
function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Функция для добавления комментария
function addComment(name, text, date) {
    comments.push({
        name,
        text,
        date,
        likes: 0
    });
    saveComments();
    renderComments();
}

// Функция для удаления комментария
function deleteComment(index) {
    comments.splice(index, 1);
    saveComments();
    renderComments();
}

// Функция для выставления/снятия лайка
function toggleLike(index) {
    comments[index].likes = comments[index].likes ? 0 : 1;
    saveComments();
    renderComments();
}

// Функция для отображения комментариев
function renderComments() {
    commentsList.innerHTML = '';
    comments.forEach((comment, index) => {
        const li = document.createElement('li');
        li.classList.add('comment');
        li.innerHTML = `
      <div class="comment__name">${comment.name}</div>
      <div class="comment__date">${formatDate(comment.date)}</div>
      <div class="commenttext">${comment.text}</div>
      <div class="commentactions">
        <button class="like" onclick="toggleLike(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${comment.likes ? 'M12 21.35l-1.45-1.32C5.4 15.12 2 12.25 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.37.81 4.5 2.09C13.13 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.75-3.4 6.62-8.55 11.53L12 21.35z' : 'M19.78 7.22l-7.8-6.81c-.84-.73-2.16-.73-3 0l-7.8 6.81c-1.28 1.12-.36 3.43 1.5 3.43h4.31v9.11c0 .89 1.08 1.34 1.71.71l6.48-6.48c.39-.39.39-1.02 0-1.41l-6.48-6.48c-.63-.63-1.71-.18-1.71.71v9.11H6.5c-1.86 0-2.78-2.31-1.5-3.43l7.8-6.81c.84-.73 2.16-.73 3 0l7.8 6.81c1.28 1.12.36 3.43-1.5 3.43h-4.31v-9.11c0-.89-1.08-1.34-1.71-.71l-6.48 6.48c-.39.39-.39 1.02 0 1.41l6.48 6.48c.63.63 1.71.18 1.71-.71v-9.11h4.31C20.14 10.65 21.06 8.34 19.78 7.22z' }"/></button>
        <button class="delete" onclick="deleteComment(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6h-4.18l-1-1H10l-1 1H5v2h14V6zM7 9v11h10V9H7zm4 8h2v2h-2v-2zm4 0h2v2h-2v-2z"/></button>
      </div>`
    ;
    if (comment.likes) {
      li.querySelector('.like svg').classList.add('liked');
    }
    commentsList.appendChild(li);
  });
}

// Функция для форматирования даты
function formatDate(date) {
  const today = new Date();
  const commentDate = new Date(date);
  if (commentDate.toDateString() === today.toDateString()) {
    return 'сегодня, ' + commentDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
  } else if (commentDate.toDateString() === new Date(today.getTime() - (24 * 60 * 60 * 1000)).toDateString()) {
    return 'вчера, ' + commentDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
  } else {
    return commentDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  }
}

// Обработчик отправки формы
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (nameInput.value.trim() === '') {
    nameInput.nextElementSibling.style.display = 'block';
    return;
  }
  if (textInput.value.trim() === '') {
    textInput.nextElementSibling.style.display = 'block';
    return;
  }
  const date = dateInput.value ? new Date(dateInput.value) : new Date();
  addComment(nameInput.value, textInput.value, date);
  nameInput.value = '';
  textInput.value = '';
  dateInput.value = '';
});

// Обработчик изменения поля имени
nameInput.addEventListener('input', () => {
  if (nameInput.value.trim() !== '') {
    nameInput.nextElementSibling.style.display = 'none';
  }
});

// Обработчик изменения поля комментария
textInput.addEventListener('input', () => {
  if (textInput.value.trim() !== '') {
    textInput.nextElementSibling.style.display = 'none';
  }
});

// Отображаем комментарии при загрузке страницы
renderComments();
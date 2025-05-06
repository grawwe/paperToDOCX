document.addEventListener('DOMContentLoaded', function() {


    // инициализация
    let templates = JSON.parse(localStorage.getItem('templates')) || [];
    let currentEditingIndex = null;


    // получение элементов интерфейса
    const createBtn = document.getElementById('createTemplateBtn');
    const listBtn = document.getElementById('myTemplatesBtn');
    const infoBtn = document.getElementById('libInfo');
    const createModal = document.getElementById('createTemplateModal');
    const listModal = document.getElementById('templatesListModal');
    const infoModal = document.getElementById('libModal');
    const templateFields = document.getElementById('templateFields');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const templatesContainer = document.getElementById('templatesContainer');


    // события
    function chinazes() {


        // открытие модальных окон
        createBtn.addEventListener('click', openCreateModal);
        listBtn.addEventListener('click', openListModal);
        infoBtn.addEventListener('click', openInfoModal);


        // закрытие модальных окон
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });


        // закрытие по клику на фон
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeAllModals();
                }
            });
        });


        // добавление поля
        addFieldBtn.addEventListener('click', addField);


        // сохранение шаблона
        saveTemplateBtn.addEventListener('click', saveTemplate);
    }


    // Функции открытия модальных окон
    function openCreateModal() {
        currentEditingIndex = null;
        templateFields.innerHTML = '';
        closeAllModals();
        createModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openListModal() {
        renderTemplatesList();
        closeAllModals();
        listModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openInfoModal(e) {
        e.preventDefault();
        closeAllModals();
        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }


    // закрытие всех окошек
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

 
    // стааарт!!!!!!!!!
    chinazes();
});
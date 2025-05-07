document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация 
    const TEMPLATE_URL = 'https://papertodocx.netlify.app/template_course.docx';
    
    // Данные для кафедр 
    const kafedraOptions = {
        'Медиатехнологий': [
            'Журналистики и медиатехнологий СМИ',
            'Графики',
            'Книгоиздания и книжной торговли',
            'Рекламы'
        ],
        'Полиграфических технологий и оборудования': [
            'Технологии полиграфического производства',
            'Информационных и управляющих систем',
            'Полиграфического оборудования и управления'
        ]
    };

    // Инициализация 
    let templates = JSON.parse(localStorage.getItem('templates')) || [];
    let currentEditingIndex = null;

    // Получение элементов 
    const createBtn = document.getElementById('createTemplateBtn');
    const listBtn = document.getElementById('myTemplatesBtn');
    const infoBtn = document.getElementById('libInfo');
    const courseTemplateBtn = document.querySelector('.templateButtons .imageBtn:first-child');
    const createModal = document.getElementById('createTemplateModal');
    const listModal = document.getElementById('templatesListModal');
    const infoModal = document.getElementById('libModal');
    const templateFields = document.getElementById('templateFields');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const templatesContainer = document.getElementById('templatesContainer');

    // Инициализация приложения 
    function initApp() {
        // Оригинальные обработчики из вашего кода
        if (createBtn) createBtn.addEventListener('click', openCreateModal);
        if (listBtn) listBtn.addEventListener('click', openListModal);
        if (infoBtn) infoBtn.addEventListener('click', openInfoModal);
        if (addFieldBtn) addFieldBtn.addEventListener('click', addField);
        if (saveTemplateBtn) saveTemplateBtn.addEventListener('click', saveTemplate);

        // Новый обработчик для кнопки шаблона курсовой
        if (courseTemplateBtn) {
            courseTemplateBtn.addEventListener('click', showCourseForm);
        }

        // Закрытие модальных окон 
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modalClose')) {
                closeAllModals();
            }
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    }

    // Функция показа формы курсовой 
    function showCourseForm() {
        closeAllModals();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                <h2>Титульный лист курсовой работы</h2>
                
                <div class="formField">
                    <label>Институт:</label>
                    <select id="instituteSelect" class="formInput">
                        <option value="Медиатехнологий">Медиатехнологий</option>
                        <option value="Полиграфических технологий и оборудования">Полиграфических технологий и оборудования</option>
                    </select>
                </div>
                
                <div class="formField">
                    <label>Кафедра:</label>
                    <select id="kafedraSelect" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Направление подготовки:</label>
                    <input type="text" id="napravlenie" class="formInput" placeholder="09.03.01 Информатика и Вычислительная Техника">
                </div>
                
                <div class="formField">
                    <label>Профиль подготовки:</label>
                    <input type="text" id="profile" class="formInput" placeholder="Разработка IT-Систем и Мультимедийных Приложений">
                </div>
                
                <div class="formField">
                    <label>Дисциплина:</label>
                    <input type="text" id="disciplne" class="formInput">
                </div>
                
                <div class="formField">
                    <label>Тема работы:</label>
                    <input type="text" id="tema" class="formInput">
                </div>
                
                <div class="formField">
                    <label>ФИО студента (группа):</label>
                    <input type="text" id="fio" class="formInput" placeholder="Иванов И.И., 4-ТИД-7">
                </div>
                
                <div class="formField">
                    <label>Руководитель:</label>
                    <input type="text" id="ryk" class="formInput" placeholder="Петров П.П.">
                </div>
                
                <div class="formField">
                    <label>Год:</label>
                    <input type="text" id="year" class="formInput" placeholder="2024">
                </div>
                
                <div class="modalActions">
                    <button id="generateCourseDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose">Отмена</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        updateKafedraOptions();
        
        document.getElementById('instituteSelect').addEventListener('change', updateKafedraOptions);
        document.getElementById('generateCourseDocx').addEventListener('click', generateCourseDocx);
    }

    // Обновление кафедр 
    function updateKafedraOptions() {
        const instituteSelect = document.getElementById('instituteSelect');
        if (!instituteSelect) return;
        
        const institute = instituteSelect.value;
        const kafedraSelect = document.getElementById('kafedraSelect');
        
        if (kafedraSelect) {
            kafedraSelect.innerHTML = kafedraOptions[institute]
                .map(opt => `<option value="${opt}">${opt}</option>`)
                .join('');
        }
    }

    // Генерация документа 
    async function generateCourseDocx() {
        try {
            // Получаем данные формы 
            const formData = {
                institute: document.getElementById('instituteSelect').value,
                kafedra: document.getElementById('kafedraSelect').value,
                napravlenie: document.getElementById('napravlenie').value,
                profile: document.getElementById('profile').value,
                disciplne: document.getElementById('disciplne').value,
                tema: document.getElementById('tema').value,
                fio: document.getElementById('fio').value,
                ryk: document.getElementById('ryk').value,
                prep: document.getElementById('ryk').value.split(' ')[1] || '',
                year: document.getElementById('year').value
            };

            // Загрузка шаблона с Netlify
            const response = await fetch(TEMPLATE_URL);
            const template = await response.blob();
            
            // Генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `course_work_${formData.year}_${formData.fio.split(',')[0].trim()}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации:', error);
            alert('Ошибка при создании документа! Проверьте подключение к интернету.');
        }
    }

    function openCreateModal() { /* ... */ }
    function openListModal() { /* ... */ }
    function openInfoModal(e) { /* ... */ }
    function closeAllModals() { /* ... */ }
    function addField() { /* ... */ }
    function saveTemplate() { /* ... */ }
    function renderTemplatesList() { /* ... */ }
    window.editTemplate = function(index) { /* ... */ };
    window.deleteTemplate = function(index) { /* ... */ };
    window.generateCustomDocx = async function(index) { /* ... */ };

    // Запуск приложения
    initApp();
});
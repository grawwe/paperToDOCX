document.addEventListener('DOMContentLoaded', function() {
    // конфигурация 
    const TEMPLATE_URL = 'https://papertodocx.netlify.app/template_course.docx';
    const VKR_TEMPLATE_URL = 'https://papertodocx.netlify.app/template_vkr.docx';
    

    // данные для кафедр 
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


    // направления и профили для кафедр
    const napravlenieProfiles = {
        // ИМТ
        'Журналистики и медиатехнологий СМИ': {
            napravlenie: ['04.03.02 Журналистика', '04.04.02 Журналистика'],
            profile: 'Журналистика'
        },
        'Графики': {
            napravlenie: ['54.03.03 Графика'],
            profile: 'Художник‑график (оформление печатной продукции)'
        },
        'Книгоиздания и книжной торговли': {
            napravlenie: ['42.03.03 Издательское дело', '42.04.03 Издательское дело'],
            profile: {
                '42.03.03 Издательское дело': 'Издательские процессы в медиасфере',
                '42.04.03 Издательское дело': 'Издательские стратегии в медиапространстве'
            }
        },
        'Рекламы': {
            napravlenie: ['42.03.01 Реклама и связи с общественностью', '42.04.01 Реклама и связи с общественностью'],
            profile: {
                '42.03.01 Реклама и связи с общественностью': ['Реклама в медиаиндустрии', 'PR в медиаиндустрии'],
                '42.04.01 Реклама и связи с общественностью': 'Реклама и связи с общественностью в медиаиндустрии'
            }
        },
        
        // ИПТИО
        'Технологии полиграфического производства': {
            napravlenie: [
                '29.03.03 Технология полиграфического и упаковочного производства',
                '29.04.03 Технология полиграфического и упаковочного производства'
            ],
            profile: {
                '29.03.03 Технология полиграфического и упаковочного производства': [
                    'Технология полиграфического производства',
                    'Технология и дизайн упаковочного производства'
                ],
                '29.04.03 Технология полиграфического и упаковочного производства': 'Технология полиграфического производства'
            }
        },
        'Информационных и управляющих систем': {
            napravlenie: [
                '09.03.01 Информатика и вычислительная техника',
                '09.03.02 Информационные системы и технологии',
                '09.04.02 Информационные системы и технологии'
            ],
            profile: {
                '09.03.01 Информатика и вычислительная техника': 'Разработка IT‑систем и мультимедийных приложений',
                '09.03.02 Информационные системы и технологии': [
                    'Информационные технологии в дизайне',
                    'Информационные технологии в медиаиндустрии'
                ],
                '09.04.02 Информационные системы и технологии': 'Цифровые технологии в медиакоммуникациях и дизайне'
            }
        },
        'Полиграфического оборудования и управления': {
            napravlenie: [
                '15.03.02 Технологические машины и оборудование',
                '38.03.02 Менеджмент'
            ],
            profile: {
                '15.03.02 Технологические машины и оборудование': 'Принтмедиасистемы и комплексы',
                '38.03.02 Менеджмент': 'Менеджмент в медиабизнесе и полиграфии'
            }
        }
    };


    // инициализация 
    let templates = JSON.parse(localStorage.getItem('templates')) || [];
    let currentEditingIndex = null;


    // получение элементов 
    const createBtn = document.getElementById('createTemplateBtn');
    const listBtn = document.getElementById('myTemplatesBtn');
    const infoBtn = document.getElementById('libInfo');
    const courseTemplateBtn = document.querySelector('.templateButtons .imageBtn:first-child');
    const vkrTemplateBtn = document.querySelector('.templateButtons .imageBtn:nth-child(2)');
    const createModal = document.getElementById('createTemplateModal');
    const listModal = document.getElementById('templatesListModal');
    const infoModal = document.getElementById('libModal');
    const templateFields = document.getElementById('templateFields');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const templatesContainer = document.getElementById('templatesContainer');


    // инициализация приложения 
    function initApp() {
        // Обработчики
        if (createBtn) createBtn.addEventListener('click', openCreateModal);
        if (listBtn) listBtn.addEventListener('click', openListModal);
        if (addFieldBtn) addFieldBtn.addEventListener('click', addField);
        if (saveTemplateBtn) saveTemplateBtn.addEventListener('click', saveTemplate);
        if (infoBtn) {
            infoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.modal').forEach(m => m.remove()); // удаляем все существующие модальные окна
                
                // создаем новое модальное окно
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.innerHTML = `
                    <div class="modalContent">
                        <h2>Информация о проекте</h2>
                        <p>=====================</p>
                        <p>Веб-Приложение paperToDOCX написано с использованием библиотек:</p>
                        <p><a href="https://github.com/open-xml-templating/docxtemplater?tab=readme-ov-file">docxtemplater</a> — для создания и заполнения шаблонов формата .docx</p>
                        <p><a href="https://github.com/open-xml-templating/pizzip">pizzip</a> — вспомогательная библиотека для работы docxtemplater</p>
                        <p>=====================</p>
                        <p>Также используется сервис <a href="https://www.cloudflare.com/ru-ru/">Cloudflare</a></p>
                        <p>Исключительно как CDN (Content Delivery Network) для быстрой загрузки используемых ранее упомянутых библиотек.</p>
                        <p>=====================</p>
                        <p>Все иконки взяты из открытого доступа с сайта <a href="https://www.flaticon.com">www.flaticon.com</a>. По <a href="https://support.flaticon.com/articles/en_US/Knowledge/Personal-use-FI">правилам</a> бесплатного использования, для каждого используемого значка необходимо указывать автора.</p>
                        <p>Авторы: <a href="https://www.flaticon.com/authors/pixel-perfect">Pixel perfect</a>, <a href="https://www.flaticon.com/authors/three-musketeers">Three musketeers</a>, <a href="https://www.flaticon.com/authors/freepik">Freepik</a></p>
                        <p>=====================</p>
                        <div class="modalActions">
                            <button class="modalClose">Закрыть</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';
                
                // обработчик закрытия
                modal.querySelector('.modalClose').addEventListener('click', function() {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                });
            });
        }

        // обработчики для кнопок шаблонов
        if (courseTemplateBtn) {
            courseTemplateBtn.addEventListener('click', showCourseForm);
        }
        
        if (vkrTemplateBtn) {
            vkrTemplateBtn.addEventListener('click', showVkrForm);
        }

        // закрытие модальных окон 
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modalClose')) {
                closeAllModals();
            }
            if (e.target.classList.contains('modal')) {
                if (e.target === e.currentTarget.querySelector('.modal')) {
                    closeAllModals();
                }
            }
        });
    }

    
    // функция показа формы ВКР
    function showVkrForm() {
        closeAllModals();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                <h2>Титульный лист ВКР</h2>
                
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
                    <select id="napravlenie" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Тема работы:</label>
                    <input type="text" id="tema" class="formInput">
                </div>
                
                <div class="formField">
                    <label>ФИО студента:</label>
                    <input type="text" id="fio" class="formInput" placeholder="Шадрин Е.М.">
                </div>
                
                <div class="formField">
                    <label>Группа:</label>
                    <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
                </div>
                
                <div class="formField">
                    <label>ФИО руководителя:</label>
                    <input type="text" id="prep" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Количество консультантов:</label>
                    <select id="consultantCount" class="formInput">
                        <option value="0">Нет консультантов</option>
                        <option value="1">1 консультант</option>
                        <option value="2">2 консультанта</option>
                    </select>
                </div>
                
                <div id="consultantFields"></div>
                
                <div class="formField">
                    <label>Нормоконтролёр:</label>
                    <input type="text" id="normocontrol" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Год:</label>
                    <input type="text" id="year" class="formInput" placeholder="2025">
                </div>
                
                <div class="modalActions">
                    <button id="generateVkrDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        updateKafedraOptions();
        
        // Обработчики событий
        modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
        document.getElementById('instituteSelect').addEventListener('change', updateKafedraOptions);
        document.getElementById('kafedraSelect').addEventListener('change', updateNapravlenieOptions);
        document.getElementById('consultantCount').addEventListener('change', updateConsultantFields);
        document.getElementById('generateVkrDocx').addEventListener('click', generateVkrDocx);
        

        // Инициализация полей консультантов
        updateConsultantFields();
    }


    // Обновление полей консультантов
    function updateConsultantFields() {
        const count = document.getElementById('consultantCount').value;
        const container = document.getElementById('consultantFields');
        container.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const fieldHTML = `
                <div class="formField">
                    <label>Консультант ${i}:</label>
                    <input type="text" id="konsult${i}" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
            `;
            container.insertAdjacentHTML('beforeend', fieldHTML);
        }
    }


    // Генерация документа ВКР
    async function generateVkrDocx() {
        try {
            // получаем данные формы 
            const napravlenie = document.getElementById('napravlenie').value;
            const napravlenieCode = napravlenie.split(' ')[0];
            const isMagistratura = napravlenieCode.split('.')[1] === '04';
            
            const formData = {
                institute: document.getElementById('instituteSelect').value,
                kafedra: document.getElementById('kafedraSelect').value,
                napravlenie: napravlenie,
                obr: isMagistratura ? 'Магистерская диссертация' : 'Бакалаврская работа',
                tema: document.getElementById('tema').value,
                FIO: document.getElementById('fio').value,
                group: document.getElementById('group').value,
                prep: document.getElementById('prep').value,
                normocontrol: document.getElementById('normocontrol').value,
                year: document.getElementById('year').value
            };
            
            // Добавляем консультантов
            const consultantCount = document.getElementById('consultantCount').value;
            for (let i = 1; i <= consultantCount; i++) {
                formData[`konsult${i}`] = document.getElementById(`konsult${i}`).value;
            }
            
            // Если консультантов меньше 2, добавляем пустые значения
            if (consultantCount < 2) formData.konsult2 = '';
            if (consultantCount < 1) formData.konsult1 = '';

            // загрузка шаблона с netlify
            const response = await fetch(VKR_TEMPLATE_URL);
            const template = await response.blob();
            
            // генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `vkr_${formData.year}_${formData.FIO.split(' ')[0]}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации.', error);
            alert('Ошибка при создании документа!');
        }
    }

    // функция показа формы курсача
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
                    <select id="napravlenie" class="formInput"></select>
                </div>
                
                <div class="formField" id="profileField">
                    <label>Профиль подготовки:</label>
                    <select id="profile" class="formInput"></select>
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
                    <label>ФИО студента:</label>
                    <input type="text" id="fio" class="formInput" placeholder="Шадрин Е.М.">
                </div>
                
                <div class="formField">
                    <label>Группа:</label>
                    <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
                </div>
                
                <div class="formField">
                    <label>ФИО руководителя:</label>
                    <input type="text" id="prep" class="formInput" placeholder="Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Должность руководителя:</label>
                    <input type="text" id="ryk" class="formInput" placeholder="уч. степень, звание">
                </div>
                
                <div class="formField">
                    <label>Год:</label>
                    <input type="text" id="year" class="formInput" placeholder="2025">
                </div>
                
                <div class="modalActions">
                    <button id="generateCourseDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        updateKafedraOptions();
        modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
        document.getElementById('instituteSelect').addEventListener('change', updateKafedraOptions);
        document.getElementById('kafedraSelect').addEventListener('change', updateNapravlenieOptions);
        document.getElementById('napravlenie').addEventListener('change', updateProfileOptions);
        document.getElementById('generateCourseDocx').addEventListener('click', generateCourseDocx);
    }

    // обновление 
    function updateKafedraOptions() {
        const instituteSelect = document.getElementById('instituteSelect');
        if (!instituteSelect) return;
        
        const institute = instituteSelect.value;
        const kafedraSelect = document.getElementById('kafedraSelect');
        
        if (kafedraSelect) {
            kafedraSelect.innerHTML = kafedraOptions[institute]
                .map(opt => `<option value="${opt}">${opt}</option>`)
                .join('');
            
            // обновляем направления после изменения кафедры
            updateNapravlenieOptions();
        }
    }

    // обновление направлений
    function updateNapravlenieOptions() {
        const kafedraSelect = document.getElementById('kafedraSelect');
        if (!kafedraSelect) return;
        
        const kafedra = kafedraSelect.value;
        const napravlenieSelect = document.getElementById('napravlenie');
        
        if (napravlenieSelect && napravlenieProfiles[kafedra]) {
            const options = napravlenieProfiles[kafedra].napravlenie;
            napravlenieSelect.innerHTML = options
                .map(opt => `<option value="${opt}">${opt}</option>`)
                .join('');
            
            // обновляем профили после изменения направления
            if (document.getElementById('profile')) {
                updateProfileOptions();
            }
        }
    }

    // обновление профилей
    function updateProfileOptions() {
        const kafedraSelect = document.getElementById('kafedraSelect');
        const napravlenieSelect = document.getElementById('napravlenie');
        const profileSelect = document.getElementById('profile');
        
        if (!kafedraSelect || !napravlenieSelect || !profileSelect) return;
        
        const kafedra = kafedraSelect.value;
        const napravlenie = napravlenieSelect.value;
        
        if (napravlenieProfiles[kafedra]) {
            const profileData = napravlenieProfiles[kafedra].profile;
            
            if (typeof profileData === 'string') {  // один профиль  
                profileSelect.innerHTML = `<option value="${profileData}">${profileData}</option>`;
            } else if (typeof profileData === 'object') { // профиль зависит от направления
                const profile = profileData[napravlenie];
                if (Array.isArray(profile)) { // несколько вариантов профиля
                    profileSelect.innerHTML = profile
                        .map(opt => `<option value="${opt}">${opt}</option>`)
                        .join('');
                } else { // один профиль
                    profileSelect.innerHTML = `<option value="${profile}">${profile}</option>`;
                }
            }
        }
    }

    // генерация документа 
    async function generateCourseDocx() {
        try {
            // получаем данные формы 
            const formData = {
                institute: document.getElementById('instituteSelect').value,
                kafedra: document.getElementById('kafedraSelect').value,
                napravlenie: document.getElementById('napravlenie').value,
                profile: document.getElementById('profile').value,
                disciplne: document.getElementById('disciplne').value,
                tema: document.getElementById('tema').value,
                fio: document.getElementById('fio').value,
                group: document.getElementById('group').value,
                prep: document.getElementById('prep').value,
                ryk: document.getElementById('ryk').value,
                year: document.getElementById('year').value
            };

            // загрузка шаблона с netlify
            const response = await fetch(TEMPLATE_URL);
            const template = await response.blob();
            
            // генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `course_work_${formData.year}_${formData.fio.split(' ')[0]}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации.', error);
            alert('Ошибка при создании документа!');
        }
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
            modal.remove();
        });
        document.body.style.overflow = 'auto';
    }

    function openCreateModal() {
        closeAllModals();
        createModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openListModal() {
        closeAllModals();
        listModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderTemplatesList();
    }

    function openInfoModal() {
        closeAllModals();
        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        infoModal.querySelector('.modalClose').addEventListener('click', closeAllModals);
    }

    function addField() {
        const fieldId = Date.now();
        const fieldHTML = `
            <div class="templateField" data-id="${fieldId}">
                <input type="text" class="fieldName" placeholder="Название поля">
                <select class="fieldType">
                    <option value="text">Текст</option>
                    <option value="number">Число</option>
                    <option value="date">Дата</option>
                </select>
                <button class="removeFieldBtn" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        templateFields.insertAdjacentHTML('beforeend', fieldHTML);
    }

    function saveTemplate() {
        const templateName = document.getElementById('templateName').value;
        if (!templateName) {
            alert('Введите название шаблона!');
            return;
        }

        const fields = [];
        document.querySelectorAll('.templateField').forEach(field => {
            const name = field.querySelector('.fieldName').value;
            const type = field.querySelector('.fieldType').value;
            if (name) fields.push({ name, type });
        });

        if (fields.length === 0) {
            alert('Добавьте хотя бы одно поле!');
            return;
        }

        const template = {
            name: templateName,
            fields: fields
        };

        if (currentEditingIndex !== null) {
            templates[currentEditingIndex] = template;
            currentEditingIndex = null;
        } else {
            templates.push(template);
        }

        localStorage.setItem('templates', JSON.stringify(templates));
        closeAllModals();
    }

    function renderTemplatesList() {
        templatesContainer.innerHTML = '';
        if (templates.length === 0) {
            templatesContainer.innerHTML = '<p>У вас пока нет шаблонов</p>';
            return;
        }

        templates.forEach((template, index) => {
            const templateHTML = `
                <div class="templateItem">
                    <h3>${template.name}</h3>
                    <p>Поля: ${template.fields.map(f => f.name).join(', ')}</p>
                    <div class="templateActions">
                        <button onclick="editTemplate(${index})">Редактировать</button>
                        <button onclick="deleteTemplate(${index})">Удалить</button>
                        <button onclick="generateCustomDocx(${index})">Создать документ</button>
                    </div>
                </div>
            `;
            templatesContainer.insertAdjacentHTML('beforeend', templateHTML);
        });
    }

    window.editTemplate = function(index) {
        currentEditingIndex = index;
        const template = templates[index];
        document.getElementById('templateName').value = template.name;
        templateFields.innerHTML = '';
        
        template.fields.forEach(field => {
            const fieldId = Date.now();
            const fieldHTML = `
                <div class="templateField" data-id="${fieldId}">
                    <input type="text" class="fieldName" placeholder="Название поля" value="${field.name}">
                    <select class="fieldType">
                        <option value="text" ${field.type === 'text' ? 'selected' : ''}>Текст</option>
                        <option value="number" ${field.type === 'number' ? 'selected' : ''}>Число</option>
                        <option value="date" ${field.type === 'date' ? 'selected' : ''}>Дата</option>
                    </select>
                    <button class="removeFieldBtn" onclick="this.parentElement.remove()">×</button>
                </div>
            `;
            templateFields.insertAdjacentHTML('beforeend', fieldHTML);
        });
        
        openCreateModal();
    };

    window.deleteTemplate = function(index) {
        if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
            templates.splice(index, 1);
            localStorage.setItem('templates', JSON.stringify(templates));
            renderTemplatesList();
        }
    };

    window.generateCustomDocx = async function(index) {
        // реализация генерации документа для пользовательских шаблонов
        alert('Функция генерации документа для пользовательских шаблонов будет реализована позже');
    };

    // инициализация приложения
    initApp();
});